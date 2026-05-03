package komowai;

import jakarta.ejb.Schedule;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;
import jakarta.inject.Inject;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Singleton
@Startup
public class ScoutService {

    private boolean scoutingEnabled = false;

    public boolean isScoutingEnabled() {
        return scoutingEnabled;
    }

    public void setScoutingEnabled(boolean enabled) {
        this.scoutingEnabled = enabled;
        System.out.println("SCOUT: Autonomous scouting is now " + (enabled ? "ENABLED" : "DISABLED"));
    }

    private final Client client = ClientBuilder.newBuilder()
            .connectTimeout(10, TimeUnit.SECONDS)
            .readTimeout(60, TimeUnit.SECONDS)
            .build();

    private final String DISCOVER_URL = "http://localhost:8000/discover";

    @Inject
    private ScraperService scraper;

    @Inject
    private KnowMeAgent scoringAgent;

    @Inject
    private AdvocateAgent advocacyAgent;

    @Inject
    private JobMissionRepository missionRepo;

    @Inject
    private UserProfileRepository profileRepo;

    @Schedule(hour = "*", minute = "*/5", persistent = false)
    public void runScoutCycle() {
        if (!scoutingEnabled) {
            return;
        }

        System.out.println("SCOUT: Starting discovery cycle...");
        
        // 1. Discover new jobs
        DiscoveryResponse discovery = fetchNewJobs("Software Engineer", 10);
        if (discovery == null || discovery.jobs() == null) return;

        // 2. Process each new job
        for (JobBrief brief : discovery.jobs()) {
            if (missionRepo.findByUrl(brief.url()).isPresent()) {
                continue; // Skip already seen
            }

            System.out.println("SCOUT: Found new mission: " + brief.title() + " at " + brief.company());
            processMission(brief);
        }
    }

    public void processMission(JobBrief brief) {
        try {
            // Assume we're scouting for the first user for now (demo mode)
            List<UserProfile> profiles = profileRepo.findAll();
            if (profiles.isEmpty()) return;

            // Only Persist Mission as DISCOVERED
            JobMission mission = new JobMission();
            mission.setTitle(brief.title());
            mission.setCompany(brief.company());
            mission.setUrl(brief.url());
            mission.setStatus("DISCOVERED");

            DossierSanitizer.sanitizeMission(mission);
            missionRepo.save(mission);
            System.out.println("SCOUT: Mission added to queue: " + brief.title());

        } catch (Exception e) {
            System.err.println("SCOUT ERROR processing mission " + brief.id() + ": " + e.getMessage());
        }
    }

    private DiscoveryResponse fetchNewJobs(String keywords, int limit) {
        try {
            Response response = client.target(DISCOVER_URL)
                    .request(MediaType.APPLICATION_JSON)
                    .post(Entity.json(new DiscoveryRequest(keywords, limit)));
            
            if (response.getStatus() == 200) {
                return response.readEntity(DiscoveryResponse.class);
            }
        } catch (Exception e) {
            System.err.println("SCOUT: Failed to fetch new jobs: " + e.getMessage());
        }
        return null;
    }

    public record DiscoveryRequest(String keywords, int limit) {}
    public record JobBrief(String id, String title, String company, String url) {}
    public record DiscoveryResponse(List<JobBrief> jobs, int count) {}
}
