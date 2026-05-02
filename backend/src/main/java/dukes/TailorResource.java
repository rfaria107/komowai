package dukes;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

@Path("tailor")
@RequestScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TailorResource {

    @Inject
    private TailorAgent agent;

    @Inject
    private ScraperService scraper;

    @Inject
    private UserProfileRepository profileRepo;

    @Inject
    private KnowledgeTools tools;

    public record TailorRequest(String jobText, String jobUrl, Long profileId) {}

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public TailorResponse tailor(TailorRequest request) {
        String jobDescription = request.jobText();
        
        if (request.jobUrl() != null && !request.jobUrl().isBlank()) {
            jobDescription = scraper.scrapeToMarkdown(request.jobUrl());
        }
        
        if (jobDescription == null || jobDescription.isBlank()) {
            throw new BadRequestException("Job description or URL is required");
        }

        // Fetch user profile as a string for the agent
        UserProfile profile = profileRepo.findById(request.profileId())
                .orElseThrow(() -> new NotFoundException("Profile not found"));
        
        // We can pass the profile data to the agent
        String profileInfo = "Name: " + profile.getName() + "\n" +
                           "Email: " + profile.getEmail() + "\n" +
                           "Skills: " + tools.getUserSkills(profile.getId()) + "\n" +
                           "Experience: " + tools.getUserExperience(profile.getId()) + "\n" +
                           "Projects: " + tools.getUserProjects(profile.getId());

        try {
            return agent.tailor(jobDescription, profileInfo);
        } catch (Exception e) {
            System.err.println("CRITICAL ERROR DURING TAILORING:");
            e.printStackTrace();
            throw new InternalServerErrorException("Agent failed to generate tailored CV: " + e.getMessage());
        }
    }
}
