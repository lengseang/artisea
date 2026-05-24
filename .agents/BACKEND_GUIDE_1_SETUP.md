# ArtiSea Backend Guide — Part 1: Setup & Database Design

> **Stack**: NestJS · PostgreSQL · TypeORM · Docker · pgAdmin  
> **Standard**: Production-grade, enterprise-level architecture  
> **Part**: 1 of 2 — Environment, Structure, Entities

---

## 1. Technology Stack

| Layer | Technology | Reason |
|:---|:---|:---|
| Framework | NestJS (TypeScript) | Modular, opinionated, production-proven |
| Database | PostgreSQL 16 | ACID-compliant, full-text search, JSONB |
| ORM | TypeORM | Native NestJS integration, migrations |
| Local DB Runtime | Docker + Docker Compose | Reproducible, no local install needed |
| DB Admin UI | pgAdmin 4 (Docker) | Visual query + schema management |
| Auth | JWT (Access) + HTTP-only Cookie (Refresh) | Secure, stateless |
| Validation | class-validator + class-transformer | Decorator-based DTO validation |
| Config | @nestjs/config + .env files | Per-environment settings |
| Logging | Winston + nest-winston | Structured JSON logs |
| Rate Limiting | @nestjs/throttler | API abuse protection |
| File Upload | Multer + AWS S3 / Cloudinary | Scalable media storage |
| Testing | Jest + Supertest | Unit + E2E |

---

## 2. Prerequisites

```bash
# Required installs
node >= 20.x
npm >= 10.x
docker >= 24.x
docker compose >= 2.x

# Install NestJS CLI globally
npm install -g @nestjs/cli
```

---

## 3. Project Bootstrap

```bash
# Create the NestJS backend project
nest new artisea-backend --strict

cd artisea-backend

# Core dependencies
npm install \
  @nestjs/config \
  @nestjs/typeorm typeorm pg \
  @nestjs/jwt @nestjs/passport \
  passport passport-jwt passport-local \
  bcryptjs \
  class-validator class-transformer \
  @nestjs/throttler \
  @nestjs/swagger swagger-ui-express \
  helmet \
  compression \
  winston nest-winston \
  uuid \
  multer @aws-sdk/client-s3

# Dev dependencies
npm install -D \
  @types/passport-jwt @types/passport-local \
  @types/bcryptjs @types/multer \
  @types/uuid
```

---

## 4. Docker Compose — Local Environment

Create `docker-compose.yml` in the project root:

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    container_name: artisea_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER:-artisea}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-artisea_secret}
      POSTGRES_DB: ${DB_NAME:-artisea_db}
    ports:
      - '5432:5432'
    volumes:
      - artisea_pgdata:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql  # optional seed
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${DB_USER:-artisea}']
      interval: 10s
      timeout: 5s
      retries: 5

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: artisea_pgadmin
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: ${PGADMIN_EMAIL:-admin@artisea.com}
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD:-admin123}
    ports:
      - '5050:80'
    depends_on:
      - postgres

volumes:
  artisea_pgdata:
```

```bash
# Start local database
docker compose up -d

# pgAdmin is now at http://localhost:5050
# Connect with: host=postgres, port=5432
```

---

## 5. Environment Configuration

Create `.env` (and `.env.example` to commit):

```env
# App
NODE_ENV=development
PORT=3001
API_PREFIX=api/v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=artisea
DB_PASSWORD=artisea_secret
DB_NAME=artisea_db
DB_SYNC=false          # NEVER true in production
DB_LOGGING=true

# JWT
JWT_ACCESS_SECRET=your-access-secret-min-64-chars
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_SECRET=your-refresh-secret-min-64-chars
JWT_REFRESH_EXPIRES=7d

# pgAdmin
PGADMIN_EMAIL=admin@artisea.com
PGADMIN_PASSWORD=admin123

# Storage (Cloudinary example)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Security
CORS_ORIGIN=http://localhost:4000
THROTTLE_TTL=60
THROTTLE_LIMIT=100
BCRYPT_ROUNDS=12
```

---

## 6. Project Folder Structure

```
artisea-backend/
├── src/
│   ├── main.ts                    # App bootstrap + global middleware
│   ├── app.module.ts              # Root module
│   ├── config/
│   │   ├── database.config.ts     # TypeORM factory
│   │   ├── jwt.config.ts
│   │   └── app.config.ts
│   ├── common/
│   │   ├── decorators/            # @CurrentUser, @Roles, @Public
│   │   ├── guards/                # JwtAuthGuard, RolesGuard
│   │   ├── filters/               # GlobalExceptionFilter
│   │   ├── interceptors/          # LoggingInterceptor, TransformInterceptor
│   │   ├── pipes/                 # ValidationPipe setup
│   │   └── dto/                   # Shared DTOs (PaginationDto, etc.)
│   ├── modules/
│   │   ├── auth/                  # Register, Login, Refresh, Logout
│   │   ├── users/                 # User profile management
│   │   ├── articles/              # CRUD + publish + autosave
│   │   ├── interactions/          # Like, Comment, Save, Share
│   │   ├── follows/               # Follow/Unfollow social graph
│   │   ├── notifications/         # Notification engine
│   │   ├── search/                # Full-text search
│   │   ├── tags/                  # Tag management
│   │   ├── media/                 # File upload + CDN
│   │   ├── agent/                 # Agent-Owner operations
│   │   └── admin/                 # Admin verification + management
│   ├── entities/                  # TypeORM entities (all tables)
│   └── migrations/                # Database migration files
├── test/                          # E2E tests
├── docker-compose.yml
├── .env
├── .env.example
├── tsconfig.json
└── package.json
```

---

## 7. TypeORM Configuration

`src/config/database.config.ts`:

```typescript
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  config: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.get('DB_HOST'),
  port: config.get<number>('DB_PORT'),
  username: config.get('DB_USER'),
  password: config.get('DB_PASSWORD'),
  database: config.get('DB_NAME'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: config.get('DB_SYNC') === 'true', // NEVER in production
  logging: config.get('NODE_ENV') === 'development',
  ssl: config.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
});
```

---

## 8. TypeORM Entity Definitions

### 8.1 User Entity

`src/entities/user.entity.ts`:

```typescript
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToOne, OneToMany, Index,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Article } from './article.entity';
import { RefreshToken } from './refresh-token.entity';

export enum UserRole {
  READER = 'reader',
  AUTHOR = 'author',
  AGENT = 'agent',
  ADMIN = 'admin',
  OFFLINE_OWNER = 'offline_owner',
}

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
  DEACTIVATED = 'deactivated',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Index({ unique: true })
  @Column({ unique: true })
  username: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.READER })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING_VERIFICATION })
  status: UserStatus;

  @Column({ default: false })
  email_verified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  last_login_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToOne(() => Profile, (p) => p.user, { cascade: true })
  profile: Profile;

  @OneToMany(() => Article, (a) => a.author)
  articles: Article[];

  @OneToMany(() => RefreshToken, (rt) => rt.user)
  refresh_tokens: RefreshToken[];
}
```

### 8.2 Profile Entity

```typescript
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToOne, JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @OneToOne(() => User, (u) => u.profile)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  display_name: string;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ nullable: true })
  avatar_url: string | null;

  @Column({ nullable: true })
  cover_image_url: string | null;

  @Column({ type: 'jsonb', nullable: true })
  social_links: Record<string, string> | null;

  @Column({ nullable: true })
  location: string | null;

  @Column({ default: false })
  is_featured: boolean;

  @Column({ default: 0 })
  follower_count: number;

  @Column({ default: 0 })
  following_count: number;

  @Column({ default: 0 })
  article_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

### 8.3 Article Entity

```typescript
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, OneToMany, ManyToMany,
  JoinTable, Index, JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Tag } from './tag.entity';
import { Interaction } from './interaction.entity';

export enum ArticleStatus {
  DRAFT = 'draft',
  UNDER_REVIEW = 'under_review',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum ArticleVisibility {
  PUBLIC = 'public',
  UNLISTED = 'unlisted',
  PRIVATE = 'private',
}

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  author_id: string;

  @Column({ nullable: true })
  agent_id: string | null;

  @Column()
  title: string;

  @Index({ unique: true })
  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  excerpt: string | null;

  @Column({ type: 'jsonb', nullable: true })
  content: Record<string, unknown> | null;

  @Column({ type: 'text', nullable: true })
  content_text: string | null;

  @Column({ nullable: true })
  cover_image: string | null;

  @Column({ type: 'enum', enum: ArticleStatus, default: ArticleStatus.DRAFT })
  status: ArticleStatus;

  @Column({ type: 'enum', enum: ArticleVisibility, default: ArticleVisibility.PUBLIC })
  visibility: ArticleVisibility;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ default: 0 })
  read_time_minutes: number;

  @Column({ default: 0 })
  view_count: number;

  @Column({ default: 0 })
  like_count: number;

  @Column({ default: 0 })
  comment_count: number;

  @Column({ default: 0 })
  save_count: number;

  @Column({ default: 0 })
  share_count: number;

  @Column({ type: 'timestamp', nullable: true })
  published_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  auto_saved_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => User, (u) => u.articles)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @ManyToMany(() => Tag, { cascade: true })
  @JoinTable({
    name: 'article_tags',
    joinColumn: { name: 'article_id' },
    inverseJoinColumn: { name: 'tag_id' },
  })
  tags: Tag[];

  @OneToMany(() => Interaction, (i) => i.article)
  interactions: Interaction[];
}
```

### 8.4 Interaction Entity (Unified)

```typescript
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Article } from './article.entity';

export enum InteractionType {
  LIKE = 'like',
  COMMENT = 'comment',
  SAVE = 'save',
  SHARE = 'share',
}

@Entity('interactions')
export class Interaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  article_id: string;

  @Column()
  user_id: string;

  @Column({ type: 'enum', enum: InteractionType })
  type: InteractionType;

  @Column({ type: 'text', nullable: true })
  content: string | null; // Comments only

  @Column({ nullable: true })
  parent_id: string | null; // Threaded comments

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Article, (a) => a.interactions)
  @JoinColumn({ name: 'article_id' })
  article: Article;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
```

### 8.5 Refresh Token Entity

```typescript
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  token_hash: string; // Store bcrypt hash, never raw token

  @Column({ type: 'boolean', default: false })
  is_revoked: boolean;

  @Column({ type: 'timestamp' })
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (u) => u.refresh_tokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
```

### 8.6 Notification Entity

```typescript
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum NotificationType {
  LIKE = 'like',
  COMMENT = 'comment',
  FOLLOW = 'follow',
  SYSTEM = 'system',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  recipient_id: string;

  @Column({ nullable: true })
  actor_id: string | null;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ nullable: true })
  reference_id: string | null;

  @Column({ default: false })
  is_read: boolean;

  @Column({ type: 'text', nullable: true })
  message: string | null;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'recipient_id' })
  recipient: User;
}
```

---

## 9. Database Migrations

```bash
# Generate a migration after changing entities
npx typeorm migration:generate src/migrations/InitSchema -d src/config/datasource.ts

# Run migrations
npx typeorm migration:run -d src/config/datasource.ts

# Revert last migration
npx typeorm migration:revert -d src/config/datasource.ts
```

Add to `package.json` scripts:

```json
{
  "migration:generate": "typeorm migration:generate src/migrations/Migration -d dist/config/datasource.js",
  "migration:run": "typeorm migration:run -d dist/config/datasource.js",
  "migration:revert": "typeorm migration:revert -d dist/config/datasource.js"
}
```

---

## 10. Critical Database Indices

Create these in your initial migration for performance:

```sql
-- High-frequency queries
CREATE INDEX idx_articles_status_published ON articles(status, published_at DESC);
CREATE INDEX idx_articles_author ON articles(author_id);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_interactions_article_type ON interactions(article_id, type);
CREATE INDEX idx_interactions_user ON interactions(user_id, type);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, is_read);
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash);

-- Full-text search vector
ALTER TABLE articles ADD COLUMN search_vector tsvector;
CREATE INDEX idx_articles_search ON articles USING GIN(search_vector);

-- Trigger to auto-update search vector
CREATE FUNCTION update_article_search_vector() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    coalesce(NEW.title, '') || ' ' ||
    coalesce(NEW.excerpt, '') || ' ' ||
    coalesce(NEW.content_text, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_search_vector_update
  BEFORE INSERT OR UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_article_search_vector();
```

---

> **Continue in**: `.ai/BACKEND_GUIDE_2_API.md` → Auth module, all API endpoints, security patterns, and DevOps.
