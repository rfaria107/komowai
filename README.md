# KOMOWAI: The Deep Knowledge Career Agent - Day 1

**Komowai** is an enterprise-grade decision-support system built for the **ShiftAPPens Hackathon 2026**. It leverages the **Jakarta EE 11** platform and agentic AI to provide personalized career guidance, moving beyond "Average Answers" to deliver insights grounded in your unique professional context.

## Key Features

- **Automated CV Extraction**: Send your raw CV text, and our `ExtractorAgent` will autonomously structure it into atomic units (Skills, Projects, Experience).
- **Deep Knowledge Agent**: A "Grounding" agent that uses specialized tools to query your professional database on-demand.
- **Match Fit Scoring**: Paste a job link or description and get a 0-100 fit score based on objective analysis of your real experience.
- **Agent Rationale**: Transparent explanations of why the agent assigned a specific score and where your strengths/gaps lie.

## Technology Stack

- **Backend**: Jakarta EE 11 (running on Open Liberty Beta).
- **Frontend**: React (Vite + TypeScript + Tailwind CSS).
- **Data Layer**: **Jakarta Data 1.0** (declarative repositories) & Jakarta Persistence 3.2.
- **AI Orchestration**: **LangChain4j-CDI** integration.
- **Runtime**: Open Liberty 26.0.0.5-beta (Jakarta EE 11 certified).

## Getting Started

### Prerequisites
- **Java 25** (OpenJDK)
- **Maven 3.9.x**
- **Node.js** (for the frontend)

### 1. Run the Backend (Jakarta EE)

The backend provides the REST API and the Agentic Engine.

```bash
cd backend
mvn clean liberty:run
```
*Note: The first run will download the Open Liberty runtime and H2 database driver.*

### 2. Run the Frontend (React)

The frontend provides the interactive dashboard.

```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

## Jakarta EE 11 Highlights

This project serves as a showcase for modern Jakarta EE 11 capabilities:
- **Jakarta Data 1.0**: Using `@Repository` interfaces for type-safe, boilerplate-free data access.
- **Jakarta Persistence 3.2**: Managing modular professional identity units.
- **CDI 4.1**: Powering pluggable AI services and tool injection.
- **Jakarta Concurrency 3.0**: Handling async AI extraction in the background.

## Mock Mode (No API Key Required)

The project includes **Mock Agents** enabled by default via CDI `@Alternative`. This allows you to test the full data pipeline and UI flow without an OpenAI API key.

To use real AI:
1. Provide an `OPENAI_API_KEY` environment variable.
2. Remove or comment out the `@Priority(1)` annotation in `MockExtractorAgent.java` and `MockKnowMeAgent.java`.

---
*Built for ShiftAPPens Hackathon 2026.*
