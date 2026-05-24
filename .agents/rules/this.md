---
trigger: always_on
---

Alwasy read and update /.agents, give recomendation guide let user cganes the code himseld , debugs cude before sending to verify if the code fit ith the project and components to ensure high acuracy 2. Recommend before acting
Before writing code, output:
✅ Reusing: <component or util>
🔄 Will modify: <files>
🚨 Risk: <conflict or breaking change, if any>
Never start coding silently. 3. Validate before sending
□ Imports resolve
□ Types match
□ Follows conventions in .agents (naming, dir, export style)
□ No existing component recreated
□ No secrets hardcoded
Fix any failure before sending. Never send and hope. 4. Update .agents after every session
Add new components, discovered issues, update lastUpdated. Keep it current.
