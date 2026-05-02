## ADDED Requirements

### Requirement: Atomic Professional Profile
The system SHALL store user professional information as modular, atomic units including Skills, Experience, and Projects to facilitate granular AI selection and matching.

#### Scenario: Profile Unit Storage
- **WHEN** a user adds a new project with a title, description, and skill tags
- **THEN** the system SHALL persist this as a distinct Project entity linked to the user's profile

### Requirement: Profile Metadata Enhancement
The system SHALL allow users to associate metadata (e.g., years of experience, proficiency level) with each skill or experience unit to provide additional context for the tailoring engine.

#### Scenario: Adding Skill Proficiency
- **WHEN** a user updates a skill to "Expert" level with "5 years" of experience
- **THEN** the system SHALL store these attributes within the skill's data structure
