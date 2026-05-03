package komowai;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

@Path("score")
@RequestScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ScoreResource {

    @Inject
    private KnowMeAgent agent;

    @Inject
    private ScraperService scraper;

    @Inject
    private JobMissionRepository missionRepo;

    @Inject
    private AdvocateAgent advocacyAgent;

    public record ScoreRequest(String jobText, String jobUrl, Long userId, Long missionId, boolean persist) {}

    @POST
    public ScoreResponse calculateFit(ScoreRequest request) {
        JobMission mission = null;
        if (request.missionId() != null) {
            mission = missionRepo.findById(request.missionId()).orElse(null);
            if (mission != null) {
                mission.setStatus("ANALYZING");
                missionRepo.save(mission);
            }
        }

        String jobDescription = request.jobText();

        // If there's a mission with a valid URL, try scraping it
        if (mission != null && mission.getUrl() != null && !mission.getUrl().startsWith("manual-input-")) {
            jobDescription = scraper.scrapeToMarkdown(mission.getUrl());
        } else if (request.jobUrl() != null && !request.jobUrl().isBlank() && !request.jobUrl().startsWith("manual-input-")) {
            jobDescription = scraper.scrapeToMarkdown(request.jobUrl());
        } else if (mission != null && mission.getJobText() != null) {
            // Fall back to the stored job text for manual missions
            jobDescription = mission.getJobText();
        }

        if (jobDescription == null || jobDescription.isBlank() || "placeholder".equals(jobDescription)) {
            if (mission != null) {
                mission.setStatus("FAILED");
                missionRepo.save(mission);
            }
            throw new BadRequestException("Job description or URL is required to calculate fit");
        }

        try {
            ScoreResponse score = agent.calculateFit(request.userId(), jobDescription);
            
            AdvocacyResponse advocacy = advocacyAgent.generateBrief(request.userId(), jobDescription);

            if (request.persist() || mission != null) {
                if (mission == null) {
                    mission = new JobMission();
                    mission.setTitle("Manual Mission Analysis");
                    mission.setCompany("Direct Input");
                    mission.setUrl(request.jobUrl() != null ? request.jobUrl() : "manual-input-" + System.currentTimeMillis());
                }
                mission.setScore(score.matchScore());
                mission.setRationale(score.rationale());
                if (advocacy != null) {
                    mission.setTips(String.join("\n", advocacy.tips()));
                    mission.setCoverLetter(advocacy.coverLetter());
                }
                mission.setStatus("ANALYZED");
                
                DossierSanitizer.sanitizeMission(mission);
                missionRepo.save(mission);
            }

            return score;
        } catch (Exception e) {
            if (mission != null) {
                mission.setStatus("FAILED");
                missionRepo.save(mission);
            }
            System.err.println("CRITICAL ERROR DURING SCORING [" + e.getClass().getSimpleName() + "]: " + e.getMessage());
            if (e.getCause() != null) {
                System.err.println("CAUSE: " + e.getCause().getMessage());
            }
            e.printStackTrace();
            throw new InternalServerErrorException("Agent failed to compute fit: " + e.getMessage());
        }
    }
}
