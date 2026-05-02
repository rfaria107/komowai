## Why

The current implementation uses a simple prompt-based approach for profile management. To create a truly professional decision-support system, we need a "Deep Knowledge Agent" that can autonomously extract information from CVs, query structured user data using enterprise-grade Jakarta EE tools, and provide objective scoring for job opportunities.

## What Changes

- **Agentic CV Extraction**: Introduction of an agent that parses raw CV text/PDFs and populates the database automatically.
- **Jakarta Data Repositories**: Migration from raw JPA EntityManagers to the new Jakarta Data 1.0 `@Repository` pattern for cleaner, type-safe data access.
- **Deep Knowledge Tools**: Implementation of LangChain4j tools that allow the agent to query the user's profile from the database on-demand.
- **Job Fit Scoring**: A specialized agent capability to analyze job descriptions against the queried profile and return a 0-100 fit score with detailed rationale.

## Capabilities

### New Capabilities
- `cv-extraction`: Ability to ingest unstructured CV data and transform it into structured JPA entities.
- `profile-repositories`: Type-safe data access layer using Jakarta Data 1.0.
- `knowledge-tools`: A set of agentic tools (functions) that bridge the LLM to the Jakarta database.
- `job-scoring`: Analytical engine to calculate match scores between profiles and jobs.

### Modified Capabilities
- `user-profile`: Adding Jakarta Data support and potentially more granular fields for better AI querying.
- `tailor-agent`: Refactoring into a more generic `KnowMeAgent` that uses tools rather than a static prompt.

## Impact

- **Database**: Updated schema to support automated extraction and structured querying.
- **Jakarta EE**: Heavy usage of Jakarta Data 1.0, Jakarta Validation, and Jakarta Concurrency.
- **AI**: Shift from zero-shot prompting to tool-use (function calling) for "Grounding" the AI in local data.
