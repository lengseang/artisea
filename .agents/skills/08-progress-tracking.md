# 08 — Progress Tracking

## Directive

The file `.ai/PROGRESS.md` is the **single source of truth** for all development progress on this project.

### On Session Start

1. **Always read** `.ai/PROGRESS.md` before starting any work.
2. Use the "Remaining Work" section to understand what needs to be done next.
3. Check the "Completed Work" section to avoid re-doing finished tasks.
4. Note the current build status and last update date.

### During Development

1. When you **start** a task from the remaining list, mark it as `[/]` (in progress).
2. When you **complete** a task, mark it as `[x]` and move it to the appropriate completed section.
3. If you **discover new bugs or tasks**, add them to the remaining list under the correct priority.

### On Session End

1. **Always update** `.ai/PROGRESS.md` with:
   - Updated `Last Updated` date and session name.
   - Updated `Build Status` (run `npm run build` to verify).
   - All newly completed items moved to the ✅ section.
   - Any new remaining items discovered during the session.
   - Updated stats table.
2. Keep the `.dev/PROGRESS.md` in sync — it's a gitignored copy for the developer.

### Rules

- Never remove completed items — they serve as a historical record.
- Always preserve the existing structure and formatting.
- If a completed task needs to be revisited (regression), move it back to remaining with a note like `(REGRESSION: reason)`.
- Group new remaining tasks by priority: 🔴 High, 🟡 Medium, 🟢 Low.
