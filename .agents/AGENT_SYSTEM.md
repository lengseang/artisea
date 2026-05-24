# ArtiSea AI Agent System Proposal

This document adapts the autonomous AI agent structure to the current ArtiSea codebase. The goal is to support agent-assisted drafting, owner-managed publishing, and reviewable AI actions without forcing a separate standalone service too early.

## Recommended Placement In This Repo

```text
artisea-frontsheet/
  app/
    api/
      v1/
        agent/
          tasks/route.ts
          tasks/[id]/route.ts
          suggestions/route.ts
          execute/route.ts
  components/
    dashboard/
      agent-view.tsx
  lib/
    agent/
      core/
        agent.ts
        planner.ts
        memory.ts
        executor.ts
      tools/
        article-search.ts
        owner-context.ts
        style-guide.ts
        publish-guard.ts
      prompts/
        system-prompt.ts
        drafting-prompt.ts
        review-prompt.ts
      workflows/
        draft-workflow.ts
        review-workflow.ts
        publish-workflow.ts
      llm/
        providers/
          openai.ts
          anthropic.ts
          local-model.ts
        embeddings/
          embed.ts
      memory/
        short-term.ts
        long-term.ts
        vector-store.ts
  services/
    agent.service.ts
  types/
    agent.ts
  .ai/
    AGENT_SYSTEM.md
```

## Mapping To Existing ArtiSea Concepts

| Agent System Layer | ArtiSea Responsibility |
| :--- | :--- |
| `core/agent.ts` | Entry point for task orchestration from dashboard or API. |
| `planner.ts` | Breaks requests into drafting, fact-gathering, revision, and approval steps. |
| `memory.ts` | Merges owner profile, article history, and active session context. |
| `executor.ts` | Runs tools and applies article updates safely. |
| `tools/*` | Reads articles, owner constraints, style rules, and publish checks. |
| `prompts/*` | Centralizes role, draft, verification, and review instructions. |
| `workflows/*` | Defines repeatable flows for draft, revise, and publish. |
| `llm/providers/*` | Lets ArtiSea swap providers without changing agent logic. |
| `memory/*` | Supports short-term session state and later semantic retrieval. |
| `app/api/v1/agent/*` | Exposes the agent to the frontend and future external clients. |

## Recommended Execution Flow

```text
User Request
  -> Agent API Route
  -> Agent Core
  -> Planner
  -> Memory Hydration
  -> Tool Execution
  -> LLM Reasoning
  -> Draft / Suggestions / Approval Required
  -> Human Review
  -> Publish or Save Draft
```

## Workflow Rules

1. Never publish directly from raw LLM output.
2. Require a review checkpoint before any owner-facing or public action.
3. Keep provider-specific logic inside `llm/providers`.
4. Keep article mutations inside executor or service boundaries, not inside UI components.
5. Store reusable prompts centrally instead of scattering them across API routes.
6. Start with short-term memory only, then add vector retrieval when enough content exists to justify it.

## Suggested First Implementation Slice

1. Add `types/agent.ts` for task, step, tool-result, and approval types.
2. Add `lib/agent/core/planner.ts` with deterministic step planning.
3. Add `lib/agent/prompts/system-prompt.ts` and `drafting-prompt.ts`.
4. Add `app/api/v1/agent/suggestions/route.ts` for non-destructive draft suggestions.
5. Update the dashboard agent view to show workflow stages, suggestions, and review queue status.

## Suggestions

- Keep the first version suggestion-only. Execution without approval will create trust and audit problems.
- Prefer article and owner tools over generic web tools in v1. Domain context matters more than broad capability at the start.
- Add a task log table before adding autonomous background execution. Debuggability matters more than autonomy early on.
- Treat memory as scoped by owner and article, not as one global conversation blob.
- Add provider adapters now, even if only OpenAI is wired first. It prevents refactors later.
