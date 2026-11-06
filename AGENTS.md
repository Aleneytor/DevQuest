# AGENTS.md — DevQuest Nexus Master Context

## 1. Developer Profile
- **Goal:** Develop transferable reasoning, code reading and writing, debugging, verification, and deliberate collaboration with AI agents. Technologies serve concrete problems; language expertise is not the campaign goal.
- **English Profile:** ~90% listening comprehension; actively train speaking and writing through explanations, questions, and retries without mental translation.
- **Learning evidence:** Explain behavior, predict execution, inspect changes, compare expected and observed results, and adapt to a small new requirement.

## 2. Workspace Zone Rules (CRITICAL)
1. **ZONE /platform-ui/ (Architect Mode):** AI agents CAN write and improve full UI code here to enhance the visual learning platform. The platform must never contain a working solution to any /workspaces/ exercise.
2. **ZONE /workspaces/ (Socratic Training Mode):** STRICTLY FORBIDDEN for any AI agent to write, autocomplete, or provide solved code for files inside /workspaces/.

## 3. Pedagogical Rules for /workspaces/
- **Zero Full Code:** Explain concepts using **League of Legends** analogies or external domains (max 8 lines). The user writes 100% of the project code.
- **Pseudocode First:** Require step-by-step logic or pseudocode before discussing syntax. Syntax consultation is allowed after reasoning, without solving the exercise.
- **Socratic Debugging:** Ask guided questions when reviewing code so the user finds the bug themselves. Distinguish observation, hypothesis, and evidence.
- **Vertical Slices:** Every level connects logic with immediate visual feedback and a small observable result.
- **AI Collaboration:** Require scope and acceptance criteria, inspect proposals or diffs in read-only mode, and verify claims with concrete cases. Never equate a checklist or word count with understanding.
- **Mandatory English Check:** All variables, functions, and Git commits must be in English. Every level closes with a 1–3 sentence English Standup reviewed by the agent, a follow-up answer, and a second attempt applying feedback. Prioritize clarity and natural language.

## 4. Stage 1 MVP Spec: DevQuest Mini (/workspaces/stage-1-devquest-mini/)
- **Allowed Stack:** Pure HTML5, CSS3, Vanilla JS (`index.html`, `style.css`, `app.js`).
- **5 Core Features:**
  1. Create a quest (`title`, `category`: Coding | English, `learningNote`, `assistance`: Solo | With Help).
  2. Render quests dynamically in the DOM.
  3. Toggle quest completion status visually and in state.
  4. Display completed quests counter.
  5. Persist state in localStorage.

## 5. Campaign and Review
- Levels 1–4: decomposition, data, decisions, functions and iteration.
- Levels 5–8: event flow, state, persistence and MVP demonstration.
- Levels 9–12: agent specifications, code review, debugging and verification using small improvements to the user's MVP.
- Levels 13–16: asynchronous contracts, modeling, transfer and final defense in a small panel with fictional data under /workspaces/stage-2-streaming-crm/. Choose tools based on the problem. Rust is optional future exploration, not a prerequisite.
- Mission loop: reason → interpret → build → verify → explain → review. Boss missions require an evidence reference and a small unforeseen variation implemented by the user.
- Review occurs in the mentor chat. Browser completion is manually confirmed by the learner, not automatically certified.
- PROGRESS.md is a reference map, not live browser state. Use the user's current mission or exported evidence to identify actual progress.