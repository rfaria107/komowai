## ADDED Requirements

### Requirement: Semantic Profile-to-Job Matching
The tailoring agent SHALL analyze a job description and select the most relevant units (Skills, Projects, Experience) from the user's profile based on semantic relevance and priority.

#### Scenario: Relevant Unit Selection
- **WHEN** the agent processes a job description requiring "Jakarta EE 11"
- **THEN** it SHALL prioritize projects and skills that explicitly mention or are related to Jakarta EE 11

### Requirement: Context-Aware LaTeX Generation
The system SHALL generate tailored LaTeX code blocks for the selected profile units, rewriting bullet points to incorporate keywords from the job description while maintaining factual accuracy.

#### Scenario: LaTeX CV Tailoring
- **WHEN** the agent identifies a match between a user project and a job requirement
- **THEN** it SHALL output a LaTeX `\item` that rephrases the project impact using the job's terminology

### Requirement: Rationale Transparency
The system SHALL provide a "Reasoning" or "Rationale" field explaining why specific profile units were selected and how they were tailored to match the job description.

#### Scenario: Displaying Rationale
- **WHEN** the tailoring process completes
- **THEN** the system SHALL return a JSON object containing both the LaTeX code and a human-readable explanation of the agent's choices
