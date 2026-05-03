package komowai;

import java.util.List;

public record ExtractedProfile(
    String name,
    String email,
    List<ExtractedSkill> skills,
    List<ExtractedExperience> experiences,
    List<ExtractedProject> projects
) {
    public record ExtractedSkill(String name, String level, String context) {}
    public record ExtractedExperience(String title, String company, String description) {}
    public record ExtractedProject(String title, String description, String technologies) {}
}
