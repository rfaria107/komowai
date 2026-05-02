package dukes;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

public interface ExtractorAgent {

    @SystemMessage("""
        You are a professional HR data extraction specialist.
        Your task is to take raw text from a CV and extract it into a structured JSON format.
        
        RULES:
        - Extract the user's name and email.
        - Extract all skills, including their level (Beginner, Intermediate, Advanced, Expert) and context (where they were used).
        - Extract professional experiences (title, company, description).
        - Extract key projects (title, description, technologies used).
        - Do NOT hallucinate. If info is missing, leave it empty.
        - The output MUST be a valid JSON object matching the ExtractedProfile record structure.
        """)
    @UserMessage("Extract professional profile from this CV text: {{text}}")
    ExtractedProfile extract(String text);
}
