package dukes;

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

    public record ScoreRequest(String jobText, String jobUrl, Long userId) {}

    @POST
    public ScoreResponse score(ScoreRequest request) {
        String jobDescription = request.jobText();
        
        if (request.jobUrl() != null && !request.jobUrl().isBlank()) {
            jobDescription = scraper.scrapeToMarkdown(request.jobUrl());
        }
        
        if (jobDescription == null || jobDescription.isBlank()) {
            throw new BadRequestException("Job description or URL is required");
        }
        
        try {
            return agent.calculateFit(request.userId(), jobDescription);
        } catch (Exception e) {
            System.err.println("CRITICAL ERROR DURING SCORING [" + e.getClass().getSimpleName() + "]: " + e.getMessage());
            if (e.getCause() != null) {
                System.err.println("CAUSE: " + e.getCause().getMessage());
            }
            e.printStackTrace();
            throw new InternalServerErrorException("Agent failed to compute fit: " + e.getMessage());
        }
    }
}
