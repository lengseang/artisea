# API Integration & Data Schema Guidelines

## 1. Schema Alignment
- Always refer to `ARTSEA_doc.md` for the single source of truth regarding the PostgreSQL Entity Relationship Diagram.
- Core entities include: Users, Articles, Profiles, Interactions, Verifications.
- Ensure all frontend TypeScript interfaces mirror the exact fields and types defined in the ERD.

## 2. API Communication
- Follow RESTful endpoints as defined in the SRS (e.g., `/api/v1/articles`, `/api/v1/auth/register`).
- Support offline-first architectures and delta-sync patterns where applicable (especially for drafts).
- Always include robust loading states, error handling, and timeout recovery logic when calling APIs.

## 3. Security
- Never log or expose sensitive user data, passwords, or tokens (JWT/Refresh tokens).
- Maintain proper authorization scopes based on the User Roles (reader, author, agent, admin, offline_owner).
