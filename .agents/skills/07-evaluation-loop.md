# AI Evaluation Loop Instructions

When tasked with a complex problem, the AI MUST follow this internal loop:

## 1. Understand & Plan
- **Requirement Check:** Validate that you fully understand the user's request. Does it conflict with `ARTSEA_doc.md`? If so, warn the user.
- **Architecture Check:** Determine where the new code belongs. Leverage existing components in `/components` instead of building from scratch.

## 2. Execution Phase
- **Step-by-Step Draft:** Implement changes incrementally. Do not dump massive amounts of code at once. Create the UI framework, then connect state, then tie in API calls.
- **Self-Correction:** As you write, constantly ask yourself if you missed an import, if a type is wrong, or if a variable might be undefined.

## 3. Review & Evaluate (The Loop)
- **Static Analysis Check:** "Did I break any TypeScript rules? Are there any missing dependencies in my `useEffect` hooks?"
- **Design Check:** "Did I use the UI/UX Pro Max tool for colors/fonts? Is this component distraction-free and mobile-responsive?"
- **Security Check:** "Are my endpoints correctly verifying user auth? Did I accidentally expose a token or PII?"

## 4. Final Handoff
- **Summary:** Present the completed work to the user with a concise summary of exactly what files were modified.
- **Next Steps:** Clearly state what the user needs to do next (e.g., "Run the server and check the /dashboard route to verify").
