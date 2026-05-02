## Context

Building on the Phase 1 foundations, we are shifting the architectural center of gravity from simple UI-to-AI prompts to a tool-based agentic loop. This allows the system to "know" the user by querying a structured Jakarta EE database rather than having the entire profile shoved into a single context window.

## Goals / Non-Goals

**Goals:**
- Implement the "Extractor Agent" to automate CV-to-DB mapping.
- Use **Jakarta Data 1.0** repositories for all data access.
- Build a "Grounding Toolset" that gives the AI read access to specific profile units.
- Implement a scoring algorithm (0-100) using the agent's reasoning.

**Non-Goals:**
- Removing the "Manual Editor" (the UI editor from Phase 1 remains as a way to "clean up" what the AI extracts).
- Complex vector search (sticking to structured SQL queries via Jakarta Data for predictable results).

## Decisions

### 1. Data Access: Jakarta Data `@Repository`
We will replace direct `EntityManager` usage in resources with Jakarta Data interfaces.
- **Rationale**: This is the flagship feature of Jakarta EE 11. It provides a more declarative, type-safe, and portable way to handle data, and maps perfectly to the "Tooling" pattern (the AI calls the Repository).
- **Alternatives**: Traditional DAO or Panache-style patterns (too vendor-specific).

### 2. The "Knowledge Bridge": LangChain4j `@Tool`
We will create a CDI bean `ProfileTools` where methods are annotated with `@Tool`.
- **Rationale**: This allows the AI to decide *what* it needs to know. If a job mentions "Java", the AI can call `getUserSkills()` to verify.
- **Alternatives**: RAG (Vector DB). RAG is great for massive data, but for a single CV, structured SQL queries on a relational DB are more accurate.

### 3. Async Extraction: ManagedExecutorService
When a user sends a CV, the extraction happens in the background.
- **Rationale**: Parsing a CV with an LLM can take 5-10 seconds. Using Jakarta Concurrency ensures the REST request returns immediately with a "Processing" status.

### 4. Scoring Logic: Agent Reasoning
The score (0-100) will be determined by a prompt that instructs the agent to act as a "Fair Recruiter".
- **Rationale**: LLMs are better at "Holistic Matching" than static regex-based keyword counters.

## Risks / Trade-offs

- **[Risk] Tool Over-use**: The Agent might call 10 tools and burn tokens. 
  - **Mitigation**: Use specific tools like `fetchFullProfile` for the initial load and smaller tools for targeted queries.
- **[Risk] Extraction Accuracy**: The AI might mis-categorize a skill.
  - **Mitigation**: Always allow the user to review and edit extracted data in the React frontend.
- **[Risk] Jakarta Data Support**: Jakarta Data 1.0 is very new.
  - **Mitigation**: Ensure the Open Liberty runtime version supports the latest beta/release features.
