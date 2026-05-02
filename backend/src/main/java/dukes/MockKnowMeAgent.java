package dukes;

import jakarta.annotation.Priority;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Alternative;
import jakarta.enterprise.inject.Vetoed;

@Vetoed
public class MockKnowMeAgent implements KnowMeAgent {

    @Override
    public ScoreResponse calculateFit(Long userId, String jobDescription) {
        // Return a high score for testing purposes
        return new ScoreResponse(
            92,
            "MOCK ANALYSIS: Based on the structured data in your Jakarta database, you are an excellent fit. Your 'Komowai' project perfectly aligns with the Java 25 requirements mentioned in the job description."
        );
    }
}
