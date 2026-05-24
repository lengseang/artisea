# Bug Fixing Protocol & Instructions

## 1. Initial Assessment
- **Reproduction:** Before changing any code, attempt to understand the exact state, props, and user actions that trigger the bug. If a terminal command is needed to check logs, do so.
- **Context Gathering:** Check `ARTSEA_doc.md` to see if the feature behaves as originally designed. Search the codebase for related components and API calls.

## 2. Root Cause Analysis
- **Tracing:** Trace the data flow chronologically: User Input -> State Update -> API Request -> Database -> API Response -> UI Render. Find where the chain breaks.
- **Hypothesis Generation:** Formulate at least one strong hypothesis for the root cause before attempting a fix.

## 3. Resolution Strategy
- **Minimal Intervention:** Change only what is absolutely necessary. Do not rewrite or refactor entire files or logic blocks just to fix a single bug unless explicitly asked by the user.
- **Testing the Fix:** Verify the fix by checking TypeScript strictness and making sure no linting rules are broken.

## 4. Post-Mortem
- **Documentation:** Add a brief inline comment explaining *why* the fix was applied if the solution involves a non-obvious workaround.
- **Prevention:** Consider if a stricter TypeScript type or an assertion could have prevented this bug, and apply it if it's a minor change.
