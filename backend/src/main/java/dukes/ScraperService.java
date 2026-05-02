package dukes;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.core.EntityPart;
import jakarta.ws.rs.core.GenericEntity;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.io.InputStream;
import java.util.List;

@ApplicationScoped
public class ScraperService {

    private final Client client = ClientBuilder.newClient();

    private final String HTML2MD_URL = "http://localhost:8000/convert";
    private final String HTML2MD_FILE_URL = "http://localhost:8000/convert/file";

    public String scrapeToMarkdown(String url) {
        if (url == null || url.isBlank()) {
            return "";
        }
        
        try {
            System.out.println("SCRAPER: Calling local Python service for URL: " + url);
            Response response = client.target(HTML2MD_URL)
                    .request(MediaType.APPLICATION_JSON)
                    .post(Entity.json(new ConvertRequest(url)));
            
            if (response.getStatus() == 200) {
                return sanitize(response.readEntity(ConvertResponse.class).markdown());
            } else {
                return "Error from html2md (URL): " + response.readEntity(String.class);
            }
        } catch (Exception e) {
            System.err.println("SCRAPER ERROR (URL): " + e.getMessage());
            return "Error calling local microservice for URL: " + e.getMessage();
        }
    }

    public String convertFileToMarkdown(InputStream fileStream, String filename) {
        try {
            System.out.println("SCRAPER: Using local html2md for file: " + filename);
            List<EntityPart> parts = List.of(
                EntityPart.withName("file")
                        .fileName(filename)
                        .content(fileStream)
                        .mediaType(MediaType.APPLICATION_OCTET_STREAM)
                        .build()
            );

            Response response = client.target(HTML2MD_FILE_URL)
                    .request(MediaType.APPLICATION_JSON)
                    .post(Entity.entity(new GenericEntity<List<EntityPart>>(parts) {}, MediaType.MULTIPART_FORM_DATA));

            if (response.getStatus() == 200) {
                return sanitize(response.readEntity(ConvertResponse.class).markdown());
            } else {
                return "Error from html2md: " + response.readEntity(String.class);
            }
        } catch (Exception e) {
            System.err.println("SCRAPER ERROR (FILE): " + e.getMessage());
            return "Error calling file conversion: " + e.getMessage();
        }
    }

    /**
     * Aggressively strips disallowed Unicode characters that break database persistence.
     * Keeps only standard printable characters and common whitespace.
     */
    private String sanitize(String input) {
        if (input == null) return null;
        
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < input.length(); i++) {
            char c = input.charAt(i);
            // Whitelist approach:
            // Allow: Tab (9), LF (10), CR (13), and Printable ASCII/Unicode (32 to 55295)
            // Plus high-range blocks if needed, but for CVs, this range is usually sufficient and safest.
            if (c == 9 || c == 10 || c == 13 || (c >= 32 && c <= 55295) || (c >= 57344 && c <= 65533)) {
                sb.append(c);
            } else {
                sb.append(' '); // Replace junk with space
            }
        }
        return sb.toString().replaceAll(" +", " ").trim();
    }

    public record ConvertRequest(String url) {}
    public record ConvertResponse(String url, String filename, String markdown, int char_count, int elapsed_ms) {}
}
