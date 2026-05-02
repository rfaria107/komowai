package dukes;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("cv")
@RequestScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CVResource {

    @Inject
    private CVService cvService;

    public record CVRequest(String text) {}

    @POST
    @Path("extract")
    public Response extract(CVRequest request) {
        if (request.text() == null || request.text().isBlank()) {
            throw new BadRequestException("CV text is required");
        }
        
        // For hackathon simplicity, we might do it synchronously if requested, 
        // but let's use the service.
        UserProfile profile = cvService.processCV(request.text());
        return Response.ok(profile).build();
    }
}
