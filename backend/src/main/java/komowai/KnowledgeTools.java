package komowai;

import dev.langchain4j.agent.tool.Tool;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.List;
import java.util.stream.Collectors;

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

    // Simple DTOs for the Agent to avoid circular references and JPA proxies
    public record SkillInfo(String name, String level, String context) {}
    public record ExperienceInfo(String title, String company, String description) {}
    public record ProjectInfo(String title, String description, String technologies) {}

    @Tool("Get the user's professional skills to understand their technical expertise")
    public List<SkillInfo> getUserSkills(Long userId) {
        System.out.println("AGENT CALLING TOOL: getUserSkills for ID " + userId);
        return profileRepo.findById(userId)
                .map(p -> {
                    List<Skill> list = skillRepo.findByUserProfile(p);
                    System.out.println("FOUND SKILLS: " + list.size());
                    return list.stream()
                            .map(s -> new SkillInfo(s.getName(), s.getLevel(), s.getContext()))
                            .collect(Collectors.toList());
                })
                .orElse(List.of());
    }

    @Tool("Get the user's professional experience to understand their career history")
    public List<ExperienceInfo> getUserExperience(Long userId) {
        System.out.println("AGENT CALLING TOOL: getUserExperience for ID " + userId);
        return profileRepo.findById(userId)
                .map(p -> {
                    List<Experience> list = experienceRepo.findByUserProfile(p);
                    System.out.println("FOUND EXPERIENCE: " + list.size());
                    return list.stream()
                            .map(e -> new ExperienceInfo(e.getTitle(), e.getCompany(), e.getDescription()))
                            .collect(Collectors.toList());
                })
                .orElse(List.of());
    }

    @Tool("Get the user's projects to understand their practical achievements")
    public List<ProjectInfo> getUserProjects(Long userId) {
        System.out.println("AGENT CALLING TOOL: getUserProjects for ID " + userId);
        return profileRepo.findById(userId)
                .map(p -> {
                    List<Project> list = projectRepo.findByUserProfile(p);
                    System.out.println("FOUND PROJECTS: " + list.size());
                    return list.stream()
                            .map(pr -> new ProjectInfo(pr.getTitle(), pr.getDescription(), pr.getTechnologies()))
                            .collect(Collectors.toList());
                })
                .orElse(List.of());
    }

    @Tool("Get a specific professional skill by its ID")
    public SkillInfo getSkillById(Long id) {
        return skillRepo.findById(id)
                .map(s -> new SkillInfo(s.getName(), s.getLevel(), s.getContext()))
                .orElse(null);
    }

    @Tool("Get a specific professional experience by its ID")
    public ExperienceInfo getExperienceById(Long id) {
        return experienceRepo.findById(id)
                .map(e -> new ExperienceInfo(e.getTitle(), e.getCompany(), e.getDescription()))
                .orElse(null);
    }

    @Tool("Get a specific project by its ID")
    public ProjectInfo getProjectById(Long id) {
        return projectRepo.findById(id)
                .map(pr -> new ProjectInfo(pr.getTitle(), pr.getDescription(), pr.getTechnologies()))
                .orElse(null);
    }
}
