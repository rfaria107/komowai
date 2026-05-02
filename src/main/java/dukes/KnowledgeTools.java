package dukes;

import dev.langchain4j.agent.tool.Tool;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.List;

@ApplicationScoped
public class KnowledgeTools {

    @Inject
    private UserProfileRepository profileRepo;

    @Inject
    private SkillRepository skillRepo;

    @Inject
    private ExperienceRepository experienceRepo;

    @Inject
    private ProjectRepository projectRepo;

    @Tool("Get the user's professional skills to understand their technical expertise")
    public List<Skill> getUserSkills(Long userId) {
        return profileRepo.findById(userId)
                .map(skillRepo::findByUserProfile)
                .orElse(List.of());
    }

    @Tool("Get the user's professional experience to understand their career history")
    public List<Experience> getUserExperience(Long userId) {
        return profileRepo.findById(userId)
                .map(experienceRepo::findByUserProfile)
                .orElse(List.of());
    }

    @Tool("Get the user's projects to understand their practical achievements")
    public List<Project> getUserProjects(Long userId) {
        return profileRepo.findById(userId)
                .map(projectRepo::findByUserProfile)
                .orElse(List.of());
    }
}
