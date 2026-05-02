package dukes;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;

public interface KnowMeAgent {

    @SystemMessage("""
        You are the Komowai Decision-Support Agent. 
        Your goal is to provide deep, personalized guidance by matching a user's professional profile against specific opportunities.
        
        INSTRUCTIONS:
        1. Use your tools to query the user's skills, experience, and projects for user ID {{userId}}.
        2. Analyze the provided Job Description.
        3. Determine how well the user fits the role on a scale of 0 to 100.
        4. Provide a detailed 'rationale' explaining the strengths and gaps.
        
        CONSTRAINTS:
        - ONLY use the data you retrieve from your tools for the user profile.
        - Be objective and professional.
        - Output a valid JSON object matching the ScoreResponse record structure.
        """)
    ScoreResponse calculateFit(@V("userId") Long userId, String jobDescription);
}
