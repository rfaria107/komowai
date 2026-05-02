## ADDED Requirements

### Requirement: Quantitative Match Scoring
The system SHALL calculate a percentage score (0-100) representing the match between a user's professional profile and a specific job description.

#### Scenario: High Match Score
- **WHEN** a user with 10 years of Java experience applies for a "Senior Java Developer" role
- **THEN** the agent SHALL return a score above 90 and explain the alignment

### Requirement: Qualitative Fit Rationale
The scoring agent SHALL provide a human-readable justification for the assigned match score, highlighting both strengths and missing requirements.

#### Scenario: Identifying Gaps
- **WHEN** a job requires "AWS" and the user's profile lacks AWS experience
- **THEN** the scoring rationale SHALL explicitly mention the lack of AWS knowledge as a reason for a lower score
