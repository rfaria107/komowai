## ADDED Requirements

### Requirement: Multi-Source Job Description Ingestion
The system SHALL provide a mechanism for users to input job descriptions via raw text pasting or by providing a valid URL to a job listing.

#### Scenario: Text Input Ingestion
- **WHEN** a user pastes a job description text into the ingestion field
- **THEN** the system SHALL store the content for analysis by the tailoring agent

### Requirement: URL Scraped Content Extraction
The system SHALL use a scraping service to extract readable text content from provided job listing URLs while bypassing common anti-bot mechanisms.

#### Scenario: URL Scraping
- **WHEN** a user provides a LinkedIn job listing URL
- **THEN** the system SHALL fetch the content (e.g., via Jina Reader) and convert it to clean Markdown for the agent
