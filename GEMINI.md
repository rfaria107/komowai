# Komowai: The "Know-Me" Engine

## Project Overview
**Komowai** (working titles: *DukeWeaver*, *Jakarta Jigsaw*, *TailorBean*, *ProfilePilot*) is a portable, enterprise-grade decision-support system built for the **ShiftAPPens Hackathon 2026**. 

The mission is to build a "Know-Me" Engine using the **Jakarta EE 11** platform that ingests data from a Large Language Model (LLM) and refines it through a structured, context-aware filter. This bridges the gap between vast public knowledge and personal context, eliminating "Average Answers" in favor of personalized guidance.

### Primary Use Case: Career Orchestrator
The core application is a modular CV builder that dynamically reconfigures a user's professional identity (Skills, Projects, Experience) to match specific job descriptions scraped from the market.

## Technology Stack
- **Platform:** Jakarta EE 11
- **Language:** Java 25
- **Build Tool:** Maven 3.9.x
- **AI Integration:** LangChain4j-CDI or OmniHai (utilizing OpenAI API)
- **Runtime:** Jakarta EE 11 compatible (e.g., WildFly, Payara, GlassFish, or Open Liberty)
- **Key APIs:**
  - **CDI:** For pluggable AI services and modular business logic.
  - **Jakarta Persistence (JPA) & Jakarta Data:** For granular user profile management.
  - **Jakarta REST:** For system endpoints.
  - **JSON-B / JSON-P:** For structured data mapping between AI and Java.

## Architecture & Implementation Strategy
- **Modular Profile:** User data is broken into atomic units (`Skill`, `Project`, `Experience` entities) using Jakarta Persistence.
- **Semantic Mapping:** The AI performs a match between job descriptions and the modular profile to produce an "Ideal CV Configuration."
- **Pluggable AI:** CDI is used to swap between different LLM providers or local/cloud models without changing business logic.
- **Guardrailing:** Strict system prompts are used to ensure the AI only uses provided profile data and avoids hallucinations.

## Building and Running
> **Note:** This repository currently contains planning and documentation files. The source code is yet to be implemented.

### Prerequisites
- Java Development Kit (JDK) 25
- Maven 3.9.x

### Getting Started
1. **Skeleton Project:** A recommended starting point is the [duke-knows-me skeleton](https://github.com/ivargrimstad/duke-knows-me).
2. **Environment:** Ensure your Jakarta EE 11 runtime is configured.
3. **Build:** Use `mvn clean install` (once code is present).

## Development Conventions
- **Portability First:** Always prioritize standardized Jakarta APIs over vendor-specific features.
- **Structured Information:** Map LLM responses directly to Java Records or POJOs using JSON-B.
- **Context is King:** Always fetch the user profile from the database and inject it into the AI prompt to ensure personalized results.
- **Security:** Do not hardcode API keys. Use environment variables or secret management.
