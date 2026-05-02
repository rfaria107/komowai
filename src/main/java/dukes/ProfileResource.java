package dukes;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("profile")
@RequestScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProfileResource {

    @Inject
    private UserProfileRepository profileRepo;

    @GET
    public List<UserProfile> getProfiles() {
        return profileRepo.findAll();
    }

    @POST
    public Response saveProfile(UserProfile profile) {
        if (profile.getExperiences() != null) {
            profile.getExperiences().forEach(e -> e.setUserProfile(profile));
        }
        if (profile.getSkills() != null) {
            profile.getSkills().forEach(s -> s.setUserProfile(profile));
        }
        if (profile.getProjects() != null) {
            profile.getProjects().forEach(p -> p.setUserProfile(profile));
        }
        
        UserProfile saved = profileRepo.save(profile);
        return Response.status(Response.Status.CREATED).entity(saved).build();
    }
    
    @GET
    @Path("{id}")
    public UserProfile getProfile(@PathParam("id") Long id) {
        return profileRepo.findById(id).orElseThrow(() -> new NotFoundException());
    }
}
