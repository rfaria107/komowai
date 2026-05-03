package komowai;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.EntityPart;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Path("cv")
@RequestScoped
@Produces(MediaType.APPLICATION_JSON)
public class CVResource {

    @Inject
    private CVService cvService;

    @Inject
    private ScraperService scraper;

    public record CVRequest(String text) {}

    @POST
    @Path("extract")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response extract(CVRequest request) {
        if (request.text() == null || request.text().isBlank()) {
            throw new BadRequestException("CV text is required");
        }
        
        // Extract only, do not persist yet to allow user review
        UserProfile profile = cvService.extractStructuredData(request.text());
        return Response.ok(profile).build();
    }

    @POST
    @Path("extract/file")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response extractFile(java.util.List<EntityPart> parts) throws IOException {
        
        EntityPart filePart = parts.stream()
                .filter(p -> "file".equals(p.getName()))
                .findFirst()
                .orElseThrow(() -> new BadRequestException("File is required"));

        InputStream fileStream = filePart.getContent();
        String fileName = filePart.getFileName().orElse("dossier.pdf");

        // 1. Convert File to Markdown via Python
        String markdown = scraper.convertFileToMarkdown(fileStream, fileName);

        // 2. Extract structured data from Markdown
        UserProfile profile = cvService.extractStructuredData(markdown);

        return Response.ok(profile).build();
    }
}
