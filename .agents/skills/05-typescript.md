# TypeScript Implementation Instructions

## Typing Philosophy
- Strict typing is mandatory across the entire codebase. Do NOT use `any`. Use `unknown` if a type is truly dynamic, and narrow it with type guards.
- Strive for self-documenting types that reflect the exact business logic constraints.

## Interfaces & Types
- **Global Types:** Store shared or global types/interfaces in the `/types` directory. Match them exactly to the `ARTSEA_doc.md` ERD.
- **Component Props:** Suffix component props with `Props` (e.g., `ArticleCardProps`). Avoid inline type declarations for complex objects.
- **API Responses:** Create explicit types for all API responses in `/types/api.ts` to ensure frontend/backend contract safety.

## Null & Error Handling
- **Optional Chaining:** Use optional chaining (`?.`) and nullish coalescing (`??`) defensively when accessing deeply nested data.
- **Type Guards:** Implement custom type guards (e.g., `isArticle(data: unknown): data is Article`) when dealing with API payloads.
- **Error Types:** Standardize error catching. Always assume `error` in a catch block is `unknown` and assert or type-guard it before accessing `.message`.

## Conventions
- **Naming:** Use PascalCase for Types/Interfaces, camelCase for variables and functions.
- **Enums vs Unions:** Prefer string union types (`type Status = "draft" | "published"`) over TypeScript `enum` objects, as they are cleaner in bundle size and easier to serialize.
