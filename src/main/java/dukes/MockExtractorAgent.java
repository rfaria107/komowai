package dukes;

import jakarta.annotation.Priority;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Alternative;
import java.util.List;

@Alternative
@Priority(1)
@ApplicationScoped
public class MockExtractorAgent implements ExtractorAgent {

    @Override
    public ExtractedProfile extract(String text) {
        // Return a realistic mock profile based on typical hackathon test data
        return new ExtractedProfile(
            "Duke J. Enterprise",
            "duke@jakarta.ee",
            List.of(
                new ExtractedProfile.ExtractedSkill("Jakarta EE", "Expert", "10 years building enterprise apps"),
                new ExtractedProfile.ExtractedSkill("React", "Advanced", "Built several dashboard prototypes"),
                new ExtractedProfile.ExtractedSkill("AI Orchestration", "Intermediate", "Integrated LangChain4j")
            ),
            List.of(
                new ExtractedProfile.ExtractedExperience("Senior Developer", "Java Corp", "Led the migration to Jakarta EE 11")
            ),
            List.of(
                new ExtractedProfile.ExtractedProject("Komowai", "An agentic career scout", "Java 25, LangChain4j, React")
            )
        );
    }
}
