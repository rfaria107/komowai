## ADDED Requirements

### Requirement: Type-Safe Data Repositories
The system SHALL use Jakarta Data 1.0 repositories to perform CRUD operations on `UserProfile`, `Skill`, `Project`, and `Experience` entities.

#### Scenario: Querying Skills by User
- **WHEN** the system requests all skills for a specific user ID
- **THEN** the Jakarta Data Repository SHALL return a list of matching `Skill` entities using a declarative `@Find` method
