package dukes;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;

@Path("tailor")
@RequestScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TailorResource {

    @Inject
    private KnowMeAgent agent; // Updated from TailorAgent to KnowMeAgent

    @Inject
    private ScraperService scraper;

    @Inject
    private UserProfileRepository profileRepo;

    private static final Jsonb jsonb = JsonbBuilder.create();

    public record TailorRequest(String jobText, String jobUrl, Long profileId) {}

    @POST
    public ScoreResponse tailor(TailorRequest request) {
        String jobDescription = request.jobText();
        
        if (request.jobUrl() != null && !request.jobUrl().isBlank()) {
            jobDescription = scraper.scrapeToMarkdown(request.jobUrl());
        }
        
        if (jobDescription == null || jobDescription.isBlank()) {
            throw new BadRequestException("Job description or URL is required");
        }
        
        return agent.calculateFit(request.profileId(), jobDescription);
    }
}
