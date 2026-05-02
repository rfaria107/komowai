## ADDED Requirements

### Requirement: Agentic Profile Grounding
The tailoring and scoring agents SHALL have access to a set of LangChain4j tools that perform SQL-based lookups on the user's professional profile.

#### Scenario: On-Demand Skill Verification
- **WHEN** the scoring agent needs to verify if a user knows "Jakarta EE"
- **THEN** it SHALL call the `getUserSkills` tool and receive the structured data from the database

### Requirement: Cross-Capability Data Access
The system SHALL ensure that knowledge tools can access all parts of the modular profile, including projects and experiences, to provide a holistic "Know-Me" experience.

#### Scenario: Holistic Knowledge Access
- **WHEN** the agent is asked "Why am I a good fit for this role?"
- **THEN** it SHALL use multiple tools to gather skills and project context before formulating a response
