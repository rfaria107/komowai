package komowai;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.util.HashMap;
import java.util.Map;

@Path("debug/db")
@RequestScoped
@Produces(MediaType.APPLICATION_JSON)
public class DatabaseDebugResource {

    @Inject
    private UserProfileRepository profileRepo;

    @Inject
    private SkillRepository skillRepo;

    @Inject
    private ExperienceRepository experienceRepo;

    @Inject
    private ProjectRepository projectRepo;

    @GET
    public Map<String, Object> dumpDatabase() {
        Map<String, Object> dump = new HashMap<>();
        dump.put("profiles", profileRepo.findAll());
        dump.put("total_skills", skillRepo.findAll().size());
        dump.put("total_experiences", experienceRepo.findAll().size());
        dump.put("total_projects", projectRepo.findAll().size());
        
        // Return a summary of everything
        return dump;
    }
}
