# Agent Workflow & Execution Directives

## 1. Code Review & Discovery
- **Understand First:** Before writing code, inspect the `components/` and `lib/` directories to leverage existing code and avoid duplication.
- **Incremental Steps:** Break down complex tasks into smaller chunks: UI first -> State Management -> API Integration.

## 2. Quality Assurance
- **Verification:** Do not propose code that introduces TypeScript errors or linting warnings.
- **No Hallucinations:** If a UI component's design or API endpoint details are missing, pause and ask the user for clarification or refer to the core SRS `ARTSEA_doc.md`.
- **Maintainability:** Add clear comments for complex logic blocks (e.g., state sync mechanisms, editor logic).
