# UI/UX Design Skill (Powered by UI/UX Pro Max)

## Core Philosophy
We strive for a premium, distraction-free reading experience.
Whenever making design decisions or building new UI components, the AI **MUST** use the UI/UX Pro Max search engine to query best practices, palettes, and typography.

## Dynamic Design System Engine
Instead of hardcoding colors and fonts, the AI must run the following command in the terminal to fetch tailored design variables:

```bash
python3 .ai/skills/ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain> --stack react
```

### Search Domains to Use:
- **`color`**: For generating cohesive color palettes based on product mood (e.g., query "minimalist" or "dark mode").
- **`typography`**: For finding Google Font pairings (e.g., query "editorial" or "publishing").
- **`style`**: For generating CSS keywords and tailwind classes (e.g., query "glassmorphism").
- **`ux`**: For verifying UX best practices before implementing interactive components.

## Accessibility (a11y)
- Always check color contrast and ensure screen-reader compatibility for custom components.
