# ArtiSea Backend & API Specification

This document outlines the technical requirements, database architecture, and API endpoint definitions for the ArtiSea backend. This specification ensures alignment between the frontend prototype and the production-grade NestJS/PostgreSQL backend.

## 1. System Architecture
*   **Framework**: [NestJS](https://nestjs.com/) (Node.js)
*   **Database**: [PostgreSQL](https://www.postgresql.org/)
*   **ORM**: [TypeORM](https://typeorm.io/) (Recommended for type-safety)
*   **Auth**: JWT (Stateless) with HTTP-only Refresh Tokens
*   **Storage**: AWS S3 or Cloudinary for media assets
*   **Search**: PostgreSQL Full-Text Search (initially) or Meilisearch/Elasticsearch (for scale)
*   **Agent Orchestration**: Planner -> Memory -> Tools -> LLM -> Approval pipeline
*   **LLM Abstraction**: Provider adapters for OpenAI, Anthropic, and optional local models
*   **Agent Memory**: Short-term task state first, vector retrieval later when article volume justifies it

---

## 2. Database Design (Entity Relationships)

The database follows a normalized relational structure optimized for social discovery and editorial management.

### 2.1 Core Entities & Purpose
| Entity | Description |
| :--- | :--- |
| **Users** | Identity, credentials, and global roles (Reader, Author, Agent, Admin). |
| **Profiles** | Public-facing metadata (bio, avatar, follower counts, featured status). |
| **Articles** | Core content entity. Supports Drafts, Scheduled, and Published states. |
| **Interactions** | Unified table for Likes, Comments, Saves, and Shares to simplify engagement tracking. |
| **Follows** | Self-referencing relationship for the social graph. |
| **Agent Assignments** | Maps the relationship between Professional Agents and Offline Owners. |
| **Verifications** | Audit trail for verifying identity (Owners/Agents) and content quality. |

### 2.2 Key Table Schemas (Draft)
Refer to `.ai/ERD.md` for the full Mermaid diagram. Key constraints:
*   **UUIDs**: All Primary Keys (PK) and Foreign Keys (FK) must use UUID v4.
*   **Indexing**: Proper indices on `slug`, `username`, `email`, and `published_at` for high-performance reads.
*   **JSONB**: Used for `content` (Lexical/Tiptap blocks) to maintain rich media integrity.

---

## 3. API Endpoint Definitions

All endpoints are prefixed with `/api/v1`.

### 3.1 Authentication & Identity (`/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| POST | `/auth/register` | Public | Create a new account. |
| POST | `/auth/login` | Public | Authenticate and receive tokens. |
| POST | `/auth/refresh` | Public | Refresh Access Token using Refresh Token cookie. |
| POST | `/auth/logout` | Private | Revoke active session. |
| GET | `/auth/me` | Private | Return current user and role profile. |

### 3.2 Articles & Editorial (`/articles`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| GET | `/articles` | Public | Fetch feed (Params: `feed=best\|hot\|new`, `tag`, `search`). |
| GET | `/articles/:slug` | Public | Fetch full article by slug. |
| POST | `/articles` | Author+ | Create a new draft. |
| PATCH | `/articles/:id` | Author+ | Update article (autosave/edit). |
| DELETE | `/articles/:id` | Author+ | Move article to archive/trash. |
| POST | `/articles/:id/publish` | Author+ | Change status to `published`. |

### 3.3 Social & Interactions (`/interactions`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| POST | `/interactions/:articleId/like` | Reader+ | Toggle like status. |
| GET | `/interactions/:articleId/comments` | Public | Fetch threaded comments. |
| POST | `/interactions/:articleId/comments` | Reader+ | Post a new comment. |
| POST | `/interactions/:articleId/save` | Reader+ | Bookmark article to "Library". |
| POST | `/users/:id/follow` | Reader+ | Follow/Unfollow a user. |

### 3.4 Agent-Owner Operations (`/agent`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| GET | `/agent/assignments` | Agent | List all managed Offline Owners. |
| GET | `/agent/owners/:id/articles` | Agent | Manage articles for a specific owner. |
| POST | `/agent/owners/:id/verify` | Admin | Verify an Offline Owner's identity. |

### 3.5 AI Agent Task Operations (`/agent`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| POST | `/agent/tasks` | Agent | Create an AI task for draft, revise, summarize, or review. |
| GET | `/agent/tasks/:id` | Agent | Fetch task status, steps, and outputs. |
| POST | `/agent/tasks/:id/approve` | Agent | Approve a reviewed draft for save or publish. |
| POST | `/agent/tasks/:id/reject` | Agent | Reject output and send revision feedback. |
| POST | `/agent/suggestions` | Agent | Generate non-destructive article suggestions. |
| POST | `/agent/execute` | Agent | Run an approved workflow step against an article. |

---

## 4. Security & Access Control (RBAC)

### 4.1 Roles Defined
1.  **Reader**: Default. Can read, like, comment, and follow.
2.  **Author**: Can write and publish their own content.
3.  **Agent**: Can manage articles for assigned "Offline Owners".
4.  **Admin**: Can verify users, verify content, and manage system settings.
5.  **Offline Owner**: Account type that cannot log in directly; content is managed by an Agent.

### 4.2 Middleware Requirements
*   **Authenticated**: Validates JWT in the `Authorization: Bearer` header.
*   **Role-Based**: Restricts access to specific endpoints (e.g., `Admin` only for verification).
*   **Ownership-Based**: Ensures an Author can only edit *their* articles, or an Agent can only edit articles for *their* assigned owners.
*   **Approval-Based**: Prevents direct publication from raw model output without an explicit review action.

---

## 5. Implementation Roadmap
1.  **Phase 1**: Database migrations and Auth module (JWT/Refresh).
2.  **Phase 2**: Article CRUD and Profile module.
3.  **Phase 3**: Interaction engine (Likes/Comments) and Social graph (Follows).
4.  **Phase 4**: Agent-Owner workflow and Verification system.
5.  **Phase 5**: AI task orchestration, prompt library, and approval gate.
6.  **Phase 6**: Real-time notifications, search optimization, and semantic memory.

---

> [!TIP]
> **Performance Recommendation**: Use **Redis** for caching the "Popular" and "Hot" feeds to reduce database load during traffic spikes.
