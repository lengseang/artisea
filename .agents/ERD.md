# ArtiSea Technical Data ERD

This document defines the comprehensive database schema for the ArtiSea platform, including support for the Social discovery engine, Agent-Owner workflows, and unified interaction systems.

```mermaid
erDiagram
    USERS ||--|| PROFILES : "has profile"
    USERS ||--o{ REFRESH_TOKENS : "owns"
    USERS ||--o{ ARTICLES : "writes"
    USERS ||--o{ INTERACTIONS : "performs"
    USERS ||--o{ FOLLOWS : "is follower"
    USERS ||--o{ FOLLOWS : "is following"
    USERS ||--o{ SAVED_ARTICLES : "bookmarks"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS ||--o{ ACTIVITY_LOGS : "generates"
    USERS ||--o{ VERIFICATIONS : "submits/reviews"
    USERS ||--|| AGENT_PROFILES : "is agent"
    
    ARTICLES ||--o{ ARTICLE_MEDIA : "contains"
    ARTICLES ||--o{ ARTICLE_TAGS : "categorized by"
    ARTICLES ||--o{ INTERACTIONS : "has engagement"
    ARTICLES ||--o{ DRAFT_VERSIONS : "history"
    ARTICLES ||--o{ SAVED_ARTICLES : "saved as"
    
    TAGS ||--o{ ARTICLE_TAGS : "maps to"
    
    AGENT_ASSIGNMENTS ||--o{ ARTICLES : "manages content"
    AGENT_PROFILES ||--o{ AGENT_ASSIGNMENTS : "performs"
    USERS ||--o{ AGENT_ASSIGNMENTS : "is owner of"

    USERS {
        uuid id PK
        string email UK
        string password_hash
        string username UK
        enum role "reader|author|agent|admin|offline_owner"
        enum status "active|suspended|pending_verification|deactivated"
        boolean email_verified
        timestamp last_login_at
        timestamp created_at
        timestamp updated_at
    }

    PROFILES {
        uuid id PK
        uuid user_id FK
        string display_name
        text bio
        string avatar_url
        string cover_image_url
        jsonb social_links
        string location
        boolean is_featured
        int follower_count
        int following_count
        int article_count
        timestamp created_at
        timestamp updated_at
    }

    ARTICLES {
        uuid id PK
        uuid author_id FK
        uuid agent_id FK "optional"
        string title
        string slug UK
        text excerpt
        jsonb content "Lexical/Tiptap format"
        text content_text "For search"
        string cover_image
        enum status "draft|published|archived|under_review"
        enum visibility "public|unlisted|private"
        boolean is_verified
        int read_time_minutes
        int view_count
        int like_count
        int comment_count
        int save_count
        int share_count
        tsvector search_vector "PostgreSQL Full-Text"
        timestamp published_at
        timestamp auto_saved_at
        timestamp created_at
        timestamp updated_at
    }

    INTERACTIONS {
        uuid id PK
        uuid article_id FK
        uuid user_id FK
        enum type "like|comment|save|share"
        text content "Only for comments"
        uuid parent_id FK "For threaded comments"
        timestamp created_at
    }

    FOLLOWS {
        uuid id PK
        uuid follower_id FK
        uuid following_id FK
        timestamp created_at
    }

    SAVED_ARTICLES {
        uuid id PK
        uuid user_id FK
        uuid article_id FK
        string folder_name "Default: Read Later"
        timestamp created_at
    }

    TAGS {
        uuid id PK
        string name UK
        string slug UK
        int usage_count
    }

    ARTICLE_TAGS {
        uuid article_id FK
        uuid tag_id FK
    }

    DRAFT_VERSIONS {
        uuid id PK
        uuid article_id FK
        jsonb content
        int version_number
        timestamp saved_at
    }

    ARTICLE_MEDIA {
        uuid id PK
        uuid article_id FK
        string original_url
        string thumbnail_url
        string file_type "image/webp|gif|etc"
        int width
        int height
        string alt_text
        int sort_order
    }

    AGENT_PROFILES {
        uuid id PK
        uuid user_id FK
        string agency_name
        boolean is_verified
        int max_clients
    }

    AGENT_ASSIGNMENTS {
        uuid id PK
        uuid agent_id FK
        uuid owner_id FK
        string status "active|revoked"
        jsonb permissions
        timestamp assigned_at
    }

    VERIFICATIONS {
        uuid id PK
        uuid target_id "User or Article ID"
        enum target_type "owner|agent|content"
        enum status "pending|approved|rejected"
        uuid reviewer_id FK
        text review_notes
        timestamp submitted_at
        timestamp reviewed_at
    }

    NOTIFICATIONS {
        uuid id PK
        uuid recipient_id FK
        uuid actor_id FK
        enum type "like|comment|follow|system"
        uuid reference_id "Related Entity ID"
        boolean is_read
        timestamp created_at
    }

    ACTIVITY_LOGS {
        uuid id PK
        uuid user_id FK
        string action "e.g., login, publish, delete"
        string entity_type
        uuid entity_id
        inet ip_address
        timestamp created_at
    }

    REFRESH_TOKENS {
        uuid id PK
        uuid user_id FK
        string token_hash
        timestamp expires_at
        timestamp revoked_at
    }
```
