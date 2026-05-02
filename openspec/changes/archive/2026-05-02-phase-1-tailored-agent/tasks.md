## 1. Project Setup & Dependencies

- [x] 1.1 Uncomment LangChain4j dependencies in `pom.xml` and update versions to 1.0.0-beta1 if needed
- [x] 1.2 Ensure `jakarta.persistence` and `jakarta.data` dependencies are present in `pom.xml`
- [x] 1.3 Add Open Liberty features (`persistence-3.1`, `jdbc-4.3`, `jsonb-3.0`) to `server.xml`
- [x] 1.4 Configure a DataSource (H2 for hackathon speed) in `server.xml`

## 2. Data Model (The "Know-Me" Foundation)

- [x] 2.1 Create `UserProfile` entity as the root of the professional identity
- [x] 2.2 Create `Experience`, `Skill`, and `Project` entities with Many-to-One relationships to `UserProfile`
- [x] 2.3 Create a `persistence.xml` in `src/main/resources/META-INF`
- [x] 2.4 Implement `ProfileResource` JAX-RS endpoint to allow the frontend to save user data

## 3. The Tailoring Agent (The AI Brain)

- [x] 3.1 Define the `TailorResponse` record (fields: `reasoning`, `latexCode`)
- [x] 3.2 Implement `ScraperService` using JAX-RS `Client` to call Jina Reader (`r.jina.ai`)
- [x] 3.3 Define the `TailorAgent` `@AiService` with a strict System Prompt for LaTeX generation
- [x] 3.4 Implement `TailorResource` that accepts job input, fetches the `UserProfile`, and calls the agent

## 4. Frontend Development (React)

- [x] 4.1 Scaffold React app using Vite and TypeScript, and install Tailwind CSS
- [x] 4.2 Build a "Profile Editor" form to break CVs into atomic units
- [x] 4.3 Build the "Job Ingestion" component (Text area + URL field)
- [x] 4.4 Build the "Tailored Result" view with a "Copy LaTeX" button and Reasoning display

## 5. Verification & Final Demo Polish

- [x] 5.1 End-to-end test: Input URL -> Scrape -> Tailor -> LaTeX Output
- [x] 5.2 Validate that AI "Reasoning" correctly explains its matches
- [x] 5.3 Add a sample "Deedy" or "Modern" LaTeX template to the system prompt for consistent formatting
