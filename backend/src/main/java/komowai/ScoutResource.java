package komowai;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.HashMap;
import java.util.Map;

@Path("scout")
@RequestScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ScoutResource {

    @Inject
    private ScoutService scoutService;

    @GET
    @Path("status")
    public Map<String, Object> getStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("enabled", scoutService.isScoutingEnabled());
        return status;
    }

    @POST
    @Path("toggle")
    public Map<String, Object> toggleScouting(Map<String, Boolean> request) {
        boolean enabled = request.getOrDefault("enabled", false);
        scoutService.setScoutingEnabled(enabled);
        
        if (enabled) {
            // Run immediately in a new thread so we don't block the HTTP response
            new Thread(() -> scoutService.runScoutCycle()).start();
        }
        
        Map<String, Object> status = new HashMap<>();
        status.put("enabled", enabled);
        return status;
    }
}
