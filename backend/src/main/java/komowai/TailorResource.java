package komowai;

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

    public record CompositionBlock(String type, Long id) {}
    public record TailorRequest(String jobText, String jobUrl, Long profileId, java.util.List<CompositionBlock> blocks) {}

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
        StringBuilder profileInfo = new StringBuilder();
        profileInfo.append("Name: ").append(profile.getName()).append("\n");
        profileInfo.append("Email: ").append(profile.getEmail()).append("\n\n");

        if (request.blocks() != null && !request.blocks().isEmpty()) {
            profileInfo.append("USER HAS SELECTED THESE SPECIFIC UNITS IN THIS ORDER:\n");
            for (int i = 0; i < request.blocks().size(); i++) {
                CompositionBlock block = request.blocks().get(i);
                profileInfo.append(String.format("%d. TYPE: %s, ID: %d\n", (i+1), block.type(), block.id()));
            }
            profileInfo.append("\nAGENT: Use your tools to fetch the content for each of these IDs before generating the LaTeX.");
        } else {
            // Legacy/Default: pass everything (or let agent fetch everything)
            profileInfo.append("Skills: ").append(tools.getUserSkills(profile.getId())).append("\n");
            profileInfo.append("Experience: ").append(tools.getUserExperience(profile.getId())).append("\n");
            profileInfo.append("Projects: ").append(tools.getUserProjects(profile.getId()));
        }

        try {
            return agent.tailor(jobDescription, profileInfo.toString());
        } catch (Exception e) {
            System.err.println("CRITICAL ERROR DURING TAILORING [" + e.getClass().getSimpleName() + "]: " + e.getMessage());
            if (e.getCause() != null) {
                System.err.println("CAUSE: " + e.getCause().getMessage());
            }
            e.printStackTrace();
            throw new InternalServerErrorException("Agent failed to generate tailored CV: " + e.getMessage());
        }
    }
}
