## ADDED Requirements

### Requirement: Automated CV Unit Extraction
The system SHALL provide a mechanism to extract Skills, Experience, and Projects from raw CV text using an LLM-based agent and store them in the relational database.

#### Scenario: Successful Extraction from Text
- **WHEN** a user uploads a raw CV text blob
- **THEN** the Extractor Agent SHALL identify atomic units and save them as JPA entities (Skill, Project, Experience)

### Requirement: Structured Profile Refinement
The system SHALL allow users to manually edit or delete units that were automatically extracted by the agent to ensure data integrity.

#### Scenario: User Correction
- **WHEN** the agent incorrectly extracts a project name
- **THEN** the user SHALL be able to update the project name in the React UI and persist the change to the database
