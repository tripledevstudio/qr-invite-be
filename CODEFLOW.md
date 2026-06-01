# Project Code Flow & Constructor Overview

## Table of Contents
1. [Project Overview](#project-overview)
2. [Application Bootstrap (`src/main.ts`)](#application-bootstrap-srcmaints)
3. [Versioning & Global Prefix](#versioning--global-prefix)
4. [Swagger Configuration](#swagger-configuration)
5. [Core Modules](#core-modules)
   - [AppModule](#appmodule)
   - [UserModule](#usermodule)
   - [DynamoModule](#dynamomodule)
   - [UploadModule (if exists)](#uploadmodule)
6. [Controllers & Request Flow](#controllers--request-flow)
   - [AppController](#appcontroller)
   - [UserController](#usercontroller)
   - [Auth Controllers (brief)](#auth-controllers)
7. [Services & Constructors](#services--constructors)
   - [UploadService](#uploadservice)
   - [AppService](#appservice)
   - [UserService / Use‑Cases](#userservice--use‑cases)
8. [Repositories & Data Access](#repositories--data-access)
9. [Adding a New Feature](#adding-a-new-feature)
10. [Developer Handover Tips](#developer-handover-tips)

---

## Project Overview
The project is a **NestJS** API server that serves a health‑check, a welcome HTML page, and several domain‑specific resources (users, uploads, etc.).  
Key design principles:

- **Modular architecture** – each domain (User, Upload, DynamoDB) lives in its own module.
- **Dependency Injection (DI)** – services, use‑cases, and repository implementations are injected via constructors.
- **API versioning** – URI‑based versioning (`/v1`, `/v2`) is enabled globally, while the root HTML page is version‑neutral (`VERSION_NEUTRAL`).
- **Swagger** – auto‑generated API docs at `/api`.

---

## Application Bootstrap (`src/main.ts`)

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Global pipes, filters, interceptors
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Global URL prefix – all routes are under `/api`
  app.setGlobalPrefix('api', { exclude: ['/'] });

  // Enable URI versioning (`/v1`, `/v2`, …)
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Swagger UI configuration
  const config = new DocumentBuilder()
    .setTitle('QR INVITE API')
    .setDescription('API documentation for the NestJS application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'QR INVITE API Docs',
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(3000);
}
bootstrap();
```

**Key take‑aways for new devs**

- `setGlobalPrefix('api')` pushes every route under `/api` **except** the root (`/`) which is excluded.
- `enableVersioning` adds a version segment (`/v1`) after the global prefix for any route **not explicitly marked as `VERSION_NEUTRAL`**.
- All controllers/services are instantiated by Nest’s DI container.

---

## Versioning & Global Prefix

| Route | Final URL | Reason |
|-------|-----------|--------|
| Home HTML (`getHello`) | `http://localhost:3000/` | Decorated with `@Version(VERSION_NEUTRAL)` → bypasses version segment. |
| Health check | `http://localhost:3000/api/v1/health` | Uses default version `1`. |
| User CRUD (`UserController`) | `http://localhost:3000/api/v1/users` | Default version applied automatically. |

**How to make a new endpoint version‑neutral:**  
```ts
import { VERSION_NEUTRAL, Version } from '@nestjs/common';

@Version(VERSION_NEUTRAL)
@Get('my‑path')
myHandler() { … }
```

**How to add a new version (e.g., v2):**  

1. Add a new controller or method and decorate it with `@Version('2')`.  
2. The same global prefix (`/api`) + version segment (`/v2`) will be applied automatically.

---

## Swagger Configuration
Swagger is served at `/api`. Because the global prefix is `/api`, the UI is reachable at:

```
http://localhost:3000/api
```

All versioned routes appear under their respective version tags in the generated docs.

---

## Core Modules

### AppModule
- Root module that imports **UserModule**, **UploadModule**, **DynamoModule**, etc.
- Binds global providers (e.g., `APP_FILTER`, `APP_INTERCEPTOR`) if any.

### UserModule (`src/user/user.module.ts`)
```ts
@Module({
  imports: [DynamoModule],
  providers: [
    { provide: USER_REPOSITORY_TOKEN, useClass: DynamoUserRepository },
    CreateUserUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
  controllers: [UserController],
  exports: [USER_REPOSITORY_TOKEN],
})
export class UserModule {}
```
- **Purpose**: Encapsulates all user‑related logic (controllers, use‑cases, repository).

### DynamoModule (`src/dynamo/dynamo.module.ts`)
- Provides DynamoDB connection & shared services.
- Exposes `DynamoService` for other modules.

### UploadModule (if present)
- Registers `UploadService` as a provider.
- Handles file uploads to Cloudinary.

---

## Controllers & Request Flow

### AppController (`src/app.controller.ts`)
```ts
@Controller()
export class AppController {
  @Version(VERSION_NEUTRAL)
  @Get()
  @Header('Content-Type', 'text/html')
  @ApiOperation({ summary: 'Welcome page' })
  getHello(@Res() res: Response) {
    return res.type('text/html').send(welcomeHtml);
  }

  @Get('health')
  @ApiOperation({ summary: 'Check server health' })
  healthCheck() { … }
}
```
- **Flow**:  
  1. HTTP GET `/` → Nest router matches `AppController.getHello`.  
  2. Response is an HTML string from `welcomeHtml` (imported from `app.html.ts`).  

### UserController (`src/user/user.controller.ts`)
```ts
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  @Post() create(@Body() dto) { … }
  @Get(':id') findOne(@Param('id') id) { … }
  @Put(':id') update(@Param('id') id, @Body() dto) { … }
  @Delete(':id') remove(@Param('id') id) { … }
}
```
- **Flow**:  
  1. Request → Auth guard validates JWT.  
  2. Controller delegates to **use‑case** classes (e.g., `CreateUserUseCase`).  
  3. Use‑case talks to the **repository** (`DynamoUserRepository`).  

### UploadService (`src/upload/upload.service.ts`)
- **Constructor** injects `ConfigService` for Cloudinary credentials.
- Provides two methods: `uploadFile` (multipart) and `uploadBase64`.

---

## Services & Constructors

### UploadService
```ts
@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }
  // …uploadFile & uploadBase64 methods
}
```
- **DI Pattern**: `ConfigService` is automatically provided by `@nestjs/config` (imported in `AppModule`).  
- All Cloudinary interactions are encapsulated here, keeping controllers thin.

### AppService
- Simple wrapper for health‑check logic (`this.appService.healthCheck()`).

### Use‑Case Classes (`src/user/application/use-cases/*.usecase.ts`)
- Follow **Command‑Query Responsibility Segregation (CQRS)** style.  
- Each class receives required repositories via constructor injection and implements a single `execute` method.

---

## Repositories & Data Access

- **UserRepository Token** (`USER_REPOSITORY_TOKEN`) abstracts the underlying data store.  
- **DynamoUserRepository** implements the interface using AWS DynamoDB SDK.  
- This pattern enables swapping the persistence layer without touching business logic.

---

## Adding a New Feature (Step‑by‑Step)

1. **Create a DTO (if needed)** in `src/<domain>/dto/`.  
2. **Add a Use‑Case** (`src/<domain>/application/use-cases/`) that injects the repository token.  
3. **Expose a Controller Method**:   
   ```ts
   @Post('my‑resource')
   create(@Body() dto: CreateMyResourceDto) {
     return this.myUseCase.execute(dto);
   }
   ```
4. **Register the Use‑Case** in the respective module’s `providers` array.  
5. **Versioning**:  
   - If you want the new endpoint under `/v1`, **do nothing** (default version applies).  
   - For `/v2`, add `@Version('2')` on the controller or method.  

---

## Developer Handover Tips

| Area | What to Look For | Common Pitfalls |
|------|------------------|-----------------|
| **DI / Constructors** | All services and use‑cases receive dependencies via constructor parameters. | Forgetting to add a provider to the module `providers` array leads to “Nest can’t resolve dependencies” errors. |
| **Versioning** | Routes without `@Version(VERSION_NEUTRAL)` are automatically under `/v1`. | Adding a new version without updating Swagger may cause missing docs. |
| **Config Service** | Environment variables are accessed via `ConfigService.get()`. | Direct `process.env` usage bypasses validation; keep all env access inside services. |
| **Testing** | End‑to‑end tests live under `test/`. Run `npm run test:e2e` to verify routes. | Tests may still reference old `/v1` paths after refactoring; update them accordingly. |
| **Swagger** | Generated from decorators (`@ApiOperation`, `@ApiTags`). | Missing decorators → undocumented endpoints. |

---

## Summary
- **Bootstrap** (`main.ts`) sets global prefix, versioning, and Swagger.  
- **Root HTML** is version‑neutral (`VERSION_NEUTRAL`).  
- **Modules** encapsulate domain logic; **controllers** route requests; **services/use‑cases** contain business logic; **repositories** handle persistence.  
- Adding new features follows a predictable **DTO → Use‑Case → Controller → Module** flow.

Feel free to expand this document with additional diagrams or flowcharts as the team grows.