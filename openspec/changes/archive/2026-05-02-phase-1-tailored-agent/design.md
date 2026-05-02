## Context

The current project is a skeleton Jakarta EE 11 application. We need to implement the core "Know-Me" engine functionality, which involves capturing user data and using an AI agent to tailor that data for specific job opportunities.

## Goals / Non-Goals

**Goals:**
- Implement a modular data model for user profiles.
- Integrate LangChain4j for AI-driven CV tailoring.
- Provide a web-based UI for profile management and job input.
- Generate high-quality LaTeX code tailored to specific jobs.

**Non-Goals:**
- Building a full PDF rendering engine (we will output LaTeX code).
- Autonomous job searching (this is for Phase 2).
- Managing multiple users (focusing on a single-user "local" experience for the hackathon).

## Decisions

### 1. Data Model: Modular Profile Entities
We will use Jakarta Persistence (JPA) to define a `UserProfile` that contains collections of `Experience`, `Skill`, and `Project` entities.
- **Rationale**: Breaking the profile into atomic units allows the AI to select only the most relevant pieces for a specific job, avoiding "information overload" in the tailored CV.
- **Alternatives**: Storing the CV as a single blob of text (too difficult for the AI to selectively reorder).

### 2. AI Integration: LangChain4j-CDI
We will use LangChain4j's CDI integration to define a `TailorAgent` as a declarative AI service.
- **Rationale**: This aligns with the "Portability First" requirement and keeps the AI logic decoupled from the JAX-RS resources.
- **Alternatives**: Manual OpenAI API calls (too much boilerplate).

### 3. Structured Output: JSON-B & Java Records
The `TailorAgent` will return a Java Record (`TailorResponse`) which JSON-B will automatically serialize.
- **Rationale**: Ensures the frontend receives a predictable structure containing both the `reasoning` and the `latex_code`.
- **Alternatives**: Returning raw strings (requires manual parsing in the frontend).

### 4. Job Ingestion: Jina Reader API
For URL-based job ingestion, we will use a simple JAX-RS `Client` to call `https://r.jina.ai/<URL>`.
- **Rationale**: Extremely fast implementation for a hackathon that handles anti-bot measures and returns clean Markdown.
- **Alternatives**: Playwright/Selenium (too heavy for this runtime).

### 5. Styling: Tailwind CSS
We will use Tailwind CSS for styling the React frontend.
- **Rationale**: Provides high developer velocity and ensures a modern, responsive design without writing custom CSS.
- **Alternatives**: Vanilla CSS (too slow for a hackathon), Bootstrap (too generic).

## Risks / Trade-offs

- **[Risk] LaTeX Compilation Errors** → **Mitigation**: Use a strict system prompt that provides a fixed LaTeX structure and forbids the AI from adding custom packages or complex commands.
- **[Risk] LLM Hallucinations** → **Mitigation**: The system prompt will explicitly instruct the AI to ONLY use the data provided in the user's profile.
- **[Risk] Scraper Failure** → **Mitigation**: Always provide a "Raw Text" fallback input in the UI if the URL scraper fails.
