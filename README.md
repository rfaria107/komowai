# KOMOWAI: The Agentic Identity Protocol - V1.2.2

**Komowai** is a production-grade career advocacy engine built for the **ShiftAPPens Hackathon 2026**. It leverages the **Jakarta EE 11** platform and agentic AI to provide deep professional grounding, transforming static CVs into dynamic, queryable career assets.

## Key Capabilities

- **Neural Identity Extraction**: Autonomously parses raw CVs (PDF, DOCX, TXT) into structured **Jakarta Data** entities, capturing the atomic impact of your career.
- **Vanguard Discovery**: An autonomous scouting agent that scans LinkedIn Guest APIs to identify high-fit opportunities while you sleep.
- **Agentic Grounding**: A multi-agent system (Scoring, Advocacy, and Tailoring) that uses specialized tools to query your professional database on-demand, ensuring zero-hallucination results.
- **Strategic Advocacy**: Generates tailored cover letters and tactical advice grounded in your specific technical history.

## Technology Stack

- **Runtime**: **Open Liberty 26.0.0.x** (Jakarta EE 11 Certified).
- **Backend Architecture**: 
  - **Jakarta Data 1.0**: Declarative repositories for high-signal data access.
  - **LangChain4j-CDI**: Seamless AI integration via standard CDI lifecycle and `@Tool` annotations.
  - **Jakarta Persistence 3.2**: Managing complex, cascaded professional identity graphs.
- **Microservices**: Python-based `html2md` using **Microsoft MarkItDown** for robust file and URL conversion.
- **Frontend**: **React 19** (Vite + TypeScript + Tailwind CSS) with a refined, high-roundness aesthetic.

## System Architecture

The system operates on an **Embedded MCP (Model Context Protocol)** philosophy. Our AI agents are not just "chatting"—they have "hands" (Tools) that reach directly into the Jakarta repositories to fetch the evidence needed for their recommendations.

## Getting Started

### Prerequisites
- **Java 25** (OpenJDK)
- **Maven 3.9.x**
- **Python 3.12+** (for the conversion service)
- **Node.js 22+**

### 1. Initialize the Conversion Microservice
```bash
cd html2md
python -m venv .venv
source .venv/bin/activate # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
python main.py
```

### 2. Launch the Engine (Jakarta EE)
```bash
cd backend
mvn clean liberty:run
```

### 3. Deploy the Interface (React)
```bash
cd frontend
npm install
npm run dev
```

## The "Vanguard" Workflow

1. **Establish Identity**: Upload your CV. The `ExtractorAgent` maps your trajectory.
2. **Autonomous Scout**: Toggle the Vanguard Agent. It discovers missions and calculates "Fit Coefficients" in the background.
3. **Strategic Artifacts**: Review tailored briefs and advocacy documents generated specifically for your profile.

---
*Architected for the ShiftAPPens Hackathon 2026.*

