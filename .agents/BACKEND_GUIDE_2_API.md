# ArtiSea Backend Guide — Part 2: API, Security & DevOps

> **Stack**: NestJS · PostgreSQL · TypeORM · Docker  
> **Part**: 2 of 2 — Authentication, All API Endpoints, Security, Testing

---

## 1. Global Application Bootstrap

`src/main.ts`:

```typescript
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import compression from "compression";
import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";
import { WinstonModule } from "nest-winston";
import { winstonConfig } from "./config/winston.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  const config = app.get(ConfigService);
  const port = config.get<number>("PORT", 3001);
  const prefix = config.get<string>("API_PREFIX", "api/v1");

  // Global prefix
  app.setGlobalPrefix(prefix);

  // Security headers
  app.use(helmet());

  // Compression
  app.use(compression());

  // CORS
  app.enableCors({
    origin: config.get("CORS_ORIGIN", "http://localhost:4000"),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });

  // Global validation pipe — strict by default
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Throw on unknown props
      transform: true, // Auto-transform types
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global response transform
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger (dev only)
  if (config.get("NODE_ENV") !== "production") {
    const swaggerConfig = new DocumentBuilder()
      .setTitle("ArtiSea API")
      .setDescription("ArtiSea Platform Backend API")
      .setVersion("1.0")
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("docs", app, document);
  }

  await app.listen(port);
}
bootstrap();
```

---

## 2. Authentication Module

### 2.1 Auth Module Structure

```
src/modules/auth/
├── auth.module.ts
├── auth.controller.ts
├── auth.service.ts
├── strategies/
│   ├── jwt.strategy.ts
│   ├── jwt-refresh.strategy.ts
│   └── local.strategy.ts
└── dto/
    ├── register.dto.ts
    ├── login.dto.ts
    └── refresh-token.dto.ts
```

### 2.2 Register DTO

```typescript
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from "class-validator";

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-z0-9_]+$/, {
    message:
      "Username can only contain lowercase letters, numbers, and underscores",
  })
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72) // bcrypt max
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(80)
  display_name: string;
}
```

### 2.3 Auth Service (Core Logic)

```typescript
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { ConfigService } from "@nestjs/config";
import { User } from "../../entities/user.entity";
import { RefreshToken } from "../../entities/refresh-token.entity";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(RefreshToken)
    private tokensRepo: Repository<RefreshToken>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.usersRepo.findOne({
      where: [{ email: dto.email }, { username: dto.username }],
    });
    if (exists) throw new ConflictException("Email or username already in use");

    const rounds = this.config.get<number>("BCRYPT_ROUNDS", 12);
    const hash = await bcrypt.hash(dto.password, rounds);

    const user = this.usersRepo.create({
      email: dto.email,
      username: dto.username,
      password_hash: hash,
      profile: { display_name: dto.display_name },
    });

    const saved = await this.usersRepo.save(user);
    const tokens = await this.issueTokens(saved);
    return { user: this.sanitizeUser(saved), ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({
      where: { email: dto.email },
      relations: ["profile"],
    });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const valid = await bcrypt.compare(dto.password, user.password_hash);
    if (!valid) throw new UnauthorizedException("Invalid credentials");

    if (user.status === "suspended")
      throw new ForbiddenException("Account suspended");

    // Update last login
    await this.usersRepo.update(user.id, { last_login_at: new Date() });

    const tokens = await this.issueTokens(user);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async refresh(userId: string, rawToken: string) {
    const tokens = await this.tokensRepo.find({
      where: { user_id: userId, is_revoked: false },
    });

    let valid = false;
    let tokenRecord: RefreshToken | null = null;
    for (const t of tokens) {
      if (await bcrypt.compare(rawToken, t.token_hash)) {
        if (t.expires_at < new Date())
          throw new UnauthorizedException("Refresh token expired");
        valid = true;
        tokenRecord = t;
        break;
      }
    }
    if (!valid || !tokenRecord)
      throw new UnauthorizedException("Invalid refresh token");

    // Rotate: revoke old, issue new
    await this.tokensRepo.update(tokenRecord.id, { is_revoked: true });

    const user = await this.usersRepo.findOne({
      where: { id: userId },
      relations: ["profile"],
    });
    return this.issueTokens(user!);
  }

  async logout(userId: string) {
    await this.tokensRepo.update(
      { user_id: userId, is_revoked: false },
      { is_revoked: true },
    );
  }

  private async issueTokens(user: User) {
    const payload = { sub: user.id, role: user.role };

    const access_token = this.jwtService.sign(payload, {
      secret: this.config.get("JWT_ACCESS_SECRET"),
      expiresIn: this.config.get("JWT_ACCESS_EXPIRES", "15m"),
    });

    const rawRefresh = this.jwtService.sign(payload, {
      secret: this.config.get("JWT_REFRESH_SECRET"),
      expiresIn: this.config.get("JWT_REFRESH_EXPIRES", "7d"),
    });

    const rounds = this.config.get<number>("BCRYPT_ROUNDS", 12);
    const token_hash = await bcrypt.hash(rawRefresh, rounds);
    const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.tokensRepo.save({ user_id: user.id, token_hash, expires_at });

    return { access_token, refresh_token: rawRefresh };
  }

  private sanitizeUser(user: User) {
    const { password_hash, ...safe } = user as any;
    return safe;
  }
}
```

---

## 3. Common Infrastructure

### 3.1 JWT Auth Guard

`src/common/guards/jwt-auth.guard.ts`:

```typescript
import { Injectable, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }
}
```

### 3.2 Roles Guard

```typescript
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { UserRole } from "../../entities/user.entity";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!required.includes(user.role)) {
      throw new ForbiddenException("Insufficient permissions");
    }
    return true;
  }
}
```

### 3.3 Standard Response Wrapper

`src/common/interceptors/transform.interceptor.ts`:

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface StandardResponse<T> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  StandardResponse<T>
> {
  intercept(
    _: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data: data?.data ?? data,
        meta: data?.meta,
      })),
    );
  }
}
```

### 3.4 Global Exception Filter

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : "Internal server error";

    this.logger.error(
      `${request.method} ${request.url} → ${status}`,
      exception instanceof Error ? exception.stack : "",
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

---

## 4. Complete API Endpoint Reference

> All routes prefixed with `/api/v1`. 🔒 = Requires JWT. 👤 = Specific role.

### 4.1 Auth Endpoints

| Method | Path             | Auth   | Description            |
| :----- | :--------------- | :----- | :--------------------- |
| POST   | `/auth/register` | Public | Register new user      |
| POST   | `/auth/login`    | Public | Login, get tokens      |
| POST   | `/auth/refresh`  | Public | Rotate refresh token   |
| POST   | `/auth/logout`   | 🔒 Any | Revoke session         |
| GET    | `/auth/me`       | 🔒 Any | Current user + profile |

**POST /auth/register** — Request:

```json
{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "SecurePass123!",
  "display_name": "John Doe"
}
```

Response `201`:

```json
{
  "success": true,
  "data": {
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "user": { "id": "uuid", "email": "...", "role": "reader" }
  }
}
```

---

### 4.2 User & Profile Endpoints

| Method | Path                           | Auth   | Description               |
| :----- | :----------------------------- | :----- | :------------------------ |
| GET    | `/users/:username`             | Public | Get public author profile |
| PATCH  | `/users/me/profile`            | 🔒 Any | Update own profile        |
| GET    | `/users/me/notifications`      | 🔒 Any | Get notifications         |
| PATCH  | `/users/me/notifications/read` | 🔒 Any | Mark all as read          |
| GET    | `/users/:id/articles`          | Public | Articles by author        |

---

### 4.3 Article Endpoints

| Method | Path                    | Auth           | Description          |
| :----- | :---------------------- | :------------- | :------------------- |
| GET    | `/articles`             | Public         | Feed (paginated)     |
| GET    | `/articles/:slug`       | Public         | Single article       |
| POST   | `/articles`             | 🔒 Author+     | Create draft         |
| PATCH  | `/articles/:id`         | 🔒 Owner/Agent | Update content       |
| DELETE | `/articles/:id`         | 🔒 Owner/Admin | Archive article      |
| POST   | `/articles/:id/publish` | 🔒 Owner/Agent | Publish article      |
| GET    | `/articles/me/drafts`   | 🔒 Author      | My drafts            |
| POST   | `/articles/:id/view`    | Public         | Increment view count |
| POST   | `/media/upload`         | 🔒 Author+     | Upload cover image   |

**GET /articles** — Query Params:

```
?feed=best|hot|new|top
&page=1
&limit=20
&tag=technology
&search=typescript
&author_id=uuid
```

**POST /articles** — Request:

```json
{
  "title": "My Article Title",
  "content": { "type": "doc", "content": [] },
  "excerpt": "Short summary",
  "cover_image": "https://cdn.../image.webp",
  "tags": ["technology", "writing"],
  "visibility": "public"
}
```

---

### 4.4 Interaction Endpoints

| Method | Path                     | Auth           | Description             |
| :----- | :----------------------- | :------------- | :---------------------- |
| POST   | `/articles/:id/like`     | 🔒 Reader+     | Toggle like             |
| GET    | `/articles/:id/comments` | Public         | Get comments (threaded) |
| POST   | `/articles/:id/comments` | 🔒 Reader+     | Post comment            |
| DELETE | `/comments/:id`          | 🔒 Owner/Admin | Delete comment          |
| POST   | `/articles/:id/save`     | 🔒 Reader+     | Toggle save to library  |
| POST   | `/articles/:id/share`    | 🔒 Reader+     | Log share event         |

**POST /articles/:id/comments** — Request:

```json
{
  "content": "Great article!",
  "parent_id": "uuid-of-parent-comment" // optional for threads
}
```

---

### 4.5 Social Graph Endpoints

| Method | Path                   | Auth       | Description                |
| :----- | :--------------------- | :--------- | :------------------------- |
| POST   | `/users/:id/follow`    | 🔒 Reader+ | Follow / Unfollow (toggle) |
| GET    | `/users/:id/followers` | Public     | List followers             |
| GET    | `/users/:id/following` | Public     | List following             |

---

### 4.6 Search & Discovery Endpoints

| Method | Path                   | Auth   | Description              |
| :----- | :--------------------- | :----- | :----------------------- |
| GET    | `/search`              | Public | Unified full-text search |
| GET    | `/tags`                | Public | List all tags            |
| GET    | `/tags/:slug/articles` | Public | Articles by tag          |

**GET /search** — Query Params:

```
?q=search+query
&type=articles|authors|tags
&page=1
&limit=20
&sort=relevance|latest|popular
```

---

### 4.7 Agent-Owner Endpoints

| Method | Path                         | Auth     | Description               |
| :----- | :--------------------------- | :------- | :------------------------ |
| GET    | `/agent/assignments`         | 🔒 Agent | My assigned owners        |
| GET    | `/agent/owners/:id`          | 🔒 Agent | Owner profile details     |
| GET    | `/agent/owners/:id/articles` | 🔒 Agent | Owner's articles          |
| POST   | `/agent/owners/:id/articles` | 🔒 Agent | Create on behalf of owner |
| POST   | `/agent/articles/:id/submit` | 🔒 Agent | Submit for verification   |

---

### 4.8 Admin Endpoints

| Method | Path                       | Auth     | Description               |
| :----- | :------------------------- | :------- | :------------------------ |
| GET    | `/admin/users`             | 🔒 Admin | All users (paginated)     |
| PATCH  | `/admin/users/:id/status`  | 🔒 Admin | Suspend / Activate user   |
| PATCH  | `/admin/users/:id/role`    | 🔒 Admin | Change user role          |
| GET    | `/admin/verifications`     | 🔒 Admin | Pending verifications     |
| PATCH  | `/admin/verifications/:id` | 🔒 Admin | Approve / Reject          |
| GET    | `/admin/articles`          | 🔒 Admin | All articles (any status) |
| DELETE | `/admin/articles/:id`      | 🔒 Admin | Hard delete article       |

---

## 5. Security Implementation

### 5.1 Rate Limiting

`src/app.module.ts`:

```typescript
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          name: "default",
          ttl: config.get("THROTTLE_TTL", 60) * 1000,
          limit: config.get("THROTTLE_LIMIT", 100),
        },
        {
          name: "auth", // Stricter for auth routes
          ttl: 60_000,
          limit: 10,
        },
      ],
    }),
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
```

### 5.2 Input Sanitization

```typescript
// On your DTOs, never trust HTML input
import { Transform } from "class-transformer";
import { IsString } from "class-validator";

export class CommentDto {
  @IsString()
  @Transform(({ value }) => value?.trim().replace(/<[^>]*>/g, "")) // Strip HTML
  content: string;
}
```

### 5.3 RBAC Decorator Pattern

```typescript
// Usage on any controller
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Patch('users/:id/role')
changeRole(@Param('id') id: string, @Body() dto: ChangeRoleDto) {
  return this.adminService.changeRole(id, dto);
}
```

### 5.4 Ownership Guard (Custom)

```typescript
// Prevents authors from editing other authors' articles
@Injectable()
export class ArticleOwnershipGuard implements CanActivate {
  constructor(@InjectRepository(Article) private repo: Repository<Article>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { user, params } = req;

    if (user.role === UserRole.ADMIN) return true; // Admins bypass

    const article = await this.repo.findOne({ where: { id: params.id } });
    if (!article) throw new NotFoundException("Article not found");

    const isOwner = article.author_id === user.id;
    const isAgent =
      user.role === UserRole.AGENT && article.agent_id === user.id;

    if (!isOwner && !isAgent) throw new ForbiddenException("Not your article");
    return true;
  }
}
```

---

## 6. Pagination Pattern

`src/common/dto/pagination.dto.ts`:

```typescript
import { Type } from "class-transformer";
import { IsOptional, IsInt, Min, Max } from "class-validator";

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
```

Standard paginated response:

```typescript
async findAll(dto: PaginationDto) {
  const [data, total] = await this.repo.findAndCount({
    skip: dto.skip,
    take: dto.limit,
    order: { created_at: 'DESC' },
  });

  return {
    data,
    meta: {
      total,
      page: dto.page,
      limit: dto.limit,
      totalPages: Math.ceil(total / dto.limit),
    },
  };
}
```

---

## 7. Swagger / API Documentation

Access at `http://localhost:3001/docs` in development.

Add decorators to controllers:

```typescript
@ApiTags("Articles")
@ApiBearerAuth()
@Controller("articles")
export class ArticlesController {
  @ApiOperation({ summary: "Get paginated article feed" })
  @ApiQuery({ name: "feed", enum: ["best", "hot", "new", "top"] })
  @ApiResponse({ status: 200, description: "Article list" })
  @Public()
  @Get()
  findAll(@Query() query: ArticleListDto) {
    return this.articlesService.findAll(query);
  }
}
```

---

## 8. Testing

### 8.1 Unit Test (Auth Service)

```typescript
describe("AuthService", () => {
  it("should throw ConflictException if email exists", async () => {
    jest.spyOn(usersRepo, "findOne").mockResolvedValue({ id: "x" } as User);
    await expect(service.register(registerDto)).rejects.toThrow(
      ConflictException,
    );
  });
});
```

### 8.2 E2E Test

```typescript
describe("POST /api/v1/auth/register", () => {
  it("returns 201 with tokens", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/auth/register")
      .send({
        email: "test@test.com",
        username: "tester",
        password: "Pass1234!",
        display_name: "Tester",
      });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("access_token");
  });
});
```

Run:

```bash
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Coverage report
```

---

## 9. Deployment Checklist

```
✅ DB_SYNC = false in production
✅ JWT secrets are strong (64+ chars, random)
✅ Helmet enabled
✅ Rate limiting enabled on all auth routes
✅ HTTPS only (TLS via reverse proxy)
✅ CORS locked to production domain
✅ Passwords hashed with bcrypt (12+ rounds)
✅ Refresh tokens stored as bcrypt hashes
✅ Database user has minimal permissions (SELECT, INSERT, UPDATE, DELETE — no DDL)
✅ All secrets in environment variables, not hardcoded
✅ Logging structured (JSON) for log aggregation
✅ Health check endpoint at /health
✅ DB migrations run before deploy
✅ pg_isready healthcheck in Docker Compose
```

---

## 10. Implementation Phase Order

| Phase | Focus        | Modules                                |
| :---- | :----------- | :------------------------------------- |
| 1     | Foundation   | Auth, Users/Profiles                   |
| 2     | Core Content | Articles CRUD, Tags, Media upload      |
| 3     | Engagement   | Interactions (Like/Comment/Save/Share) |
| 4     | Social Graph | Follows, Notifications                 |
| 5     | Agent System | Agent-Owner, Verifications             |
| 6     | Admin        | Admin panel, Reporting                 |
| 7     | Performance  | Redis cache, Search optimization       |
