package dukes;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.core.MediaType;

@ApplicationScoped
public class ScraperService {

    private final Client client = ClientBuilder.newClient();

    public String scrapeToMarkdown(String url) {
        if (url == null || url.isBlank()) {
            return "";
        }
        
        // Jina Reader API: prefix the URL with https://r.jina.ai/
        String jinaUrl = "https://r.jina.ai/" + url;
        
        try {
            return client.target(jinaUrl)
                    .request(MediaType.TEXT_PLAIN)
                    .get(String.class);
        } catch (Exception e) {
            // Fallback or error handling
            return "Error scraping URL: " + e.getMessage();
        }
    }
}
