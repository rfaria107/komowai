## Why

Standard AI career advice is often "average" and lacks personal context. This change introduces the foundation of the "Know-Me" engine by building a tailored career agent that bridges the gap between a user's modular professional identity and specific job requirements.

## What Changes

- **User Profile Management**: Implementation of a modular system to store and manage a user's skills, experience, and projects as atomic units.
- **Job Description Ingestion**: A new interface for users to provide job descriptions via direct text input or a URL.
- **Agentic Tailoring**: An AI agent that analyzes job descriptions, selects relevant profile units, and rewrites them to highlight the most pertinent skills and achievements.
- **LaTeX Generation**: Transformation of the tailored content into professional, ready-to-use LaTeX code for high-quality CV generation.

## Capabilities

### New Capabilities
- `user-profile`: Storage and management of skills, projects, and professional experience using Jakarta Persistence.
- `job-ingestion`: Capability to receive and process job descriptions from user input or URLs.
- `tailor-agent`: The core reasoning engine that matches profile units to job requirements and generates tailored LaTeX content.

### Modified Capabilities
- (None)

## Impact

- **Backend**: New Jakarta EE 11 modules for JPA entities, JAX-RS endpoints, and LangChain4j-CDI services.
- **Frontend**: A React-based UI for profile management and job input.
- **Data**: New database schema for user profiles.
- **AI**: Integration with OpenAI via LangChain4j.
