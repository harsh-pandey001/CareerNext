# apps/ai-service — PLACEHOLDER (V6)

Standalone AI service. **Not implemented yet** — scalable placeholder only.

Planned (V6): Resume Analysis, Skill Matching, Learning Suggestions, Career
Suggestions, Interview Preparation. Tech (future stack): FastAPI + OpenAI/Claude.

Key principle: AI is a **separate service**, not embedded in `apps/api`. It
communicates over the network and must not introduce breaking changes to the
core architecture.
