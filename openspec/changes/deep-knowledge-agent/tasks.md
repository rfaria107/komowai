## 1. Data Layer: Jakarta Data Repositories

- [x] 1.1 Add Jakarta Data dependency to `pom.xml`
- [x] 1.2 Enable `data-1.0` feature in Open Liberty `server.xml`
- [x] 1.3 Create `ProfileRepository` interface with `@Find` methods for Skills, Projects, and Experience
- [x] 1.4 Refactor `ProfileResource` to use `ProfileRepository` instead of `EntityManager`

## 2. Automated Extraction (Agent 1)

- [x] 2.1 Define `ExtractorAgent` interface with `@AiService` for CV parsing
- [x] 2.2 Create structured extraction records (e.g., `ExtractedSkill`, `ExtractedProject`) for JSON-B mapping
- [x] 2.3 Implement `ManagedExecutorService` logic in a `CVService` to process extractions asynchronously
- [x] 2.4 Add "Extract from CV" endpoint to the JAX-RS backend

## 3. Deep Knowledge Tools & Scoring (Agent 2)

- [x] 3.1 Create `KnowledgeTools` CDI bean with `@Tool` annotations for database querying
- [x] 3.2 Implement `getUserSkills`, `getUserProjects`, and `getUserExperience` tool methods
- [x] 3.3 Refactor `TailorAgent` into a broader `KnowMeAgent` that includes the `KnowledgeTools`
- [x] 3.4 Implement a "Score Match" method in the agent that returns a 0-100 score and a reason string
- [x] 3.5 Create `ScoreResource` to handle job link/text submission and return the match results

## 4. Frontend: Extraction & Scoring Dashboard

- [x] 4.1 Update React UI to include a "Upload CV" button (text/file)
- [x] 4.2 Build a "Match Score" gauge component using Tailwind CSS
- [x] 4.3 Add a "Reasoning" card that displays the agent's justification for the score
- [x] 4.4 Implement "Real-time" polling or updates to show extraction progress
