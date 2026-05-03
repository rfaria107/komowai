package komowai;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("missions")
@RequestScoped
@Produces(MediaType.APPLICATION_JSON)
public class MissionResource {

    @Inject
    private JobMissionRepository missionRepo;

    @GET
    public List<JobMission> getMissions() {
        // Return latest missions first
        return missionRepo.findAll().stream()
                .sorted((a, b) -> b.getId().compareTo(a.getId()))
                .toList();
    }

    @DELETE
    public Response clearMissions() {
        missionRepo.deleteAll(missionRepo.findAll());
        return Response.noContent().build();
    }
    
    @DELETE
    @Path("{id}")
    public void deleteMission(@PathParam("id") Long id) {
        missionRepo.findById(id).ifPresent(missionRepo::delete);
    }

    public record CreateMissionRequest(String jobText, String jobUrl) {}

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public JobMission createMission(CreateMissionRequest request) {
        JobMission mission = new JobMission();
        mission.setTitle("Manual Mission Target");
        mission.setCompany("Direct Input");
        
        String url = request.jobUrl() != null && !request.jobUrl().isBlank() ? request.jobUrl() : "manual-input-" + System.currentTimeMillis();
        mission.setUrl(url);
        
        if (request.jobText() != null && !request.jobText().isBlank()) {
            mission.setJobText(request.jobText());
        }

        mission.setStatus("DISCOVERED");
        DossierSanitizer.sanitizeMission(mission);
        
        return missionRepo.save(mission);
    }
}
