# AI Steering & Development Guidelines

This document serves as the core instruction manual for AI coding assistants (and developers) working on the **Diaty Base** project. It outlines the architectural patterns, coding conventions, and folder structures to be strictly followed during feature development, bug fixing, and refactoring.

## 1. Architectural Pattern & Folder Structure
The project uses **NestJS** and follows a **Domain-Driven Design (DDD)** inspired modular architecture.

For every new feature or module (e.g., `user`, `store`, `checkin`), the structure MUST follow this exact pattern:

```text
src/<module-name>/
├── <module-name>.module.ts       # Module definition, registers controllers and providers
├── <module-name>.controller.ts   # HTTP layer, handles routing and request/response mapping
├── application/
│   └── use-cases/                # Business logic layer
│       ├── create-<entity>.usecase.ts
│       ├── update-<entity>.usecase.ts
│       └── ...
├── domain/
│   ├── entities/                 # Core domain models
│   │   └── <entity>.entity.ts    # Class definitions (NOT interfaces)
│   └── repositories/             # Repository interfaces & DI tokens
│       └── <entity>.repository.ts
├── infrastructure/
│   └── dynamo/                   # Infrastructure implementations
│       └── dynamo-<entity>.repository.ts
└── dto/                          # Data Transfer Objects (Validation)
    ├── create-<entity>.dto.ts
    └── update-<entity>.dto.ts
```
*Note: The traditional `<module-name>.service.ts` is deprecated in favor of Use Cases. Avoid adding business logic to `service.ts`.*

## 2. Coding Guidelines by Layer

### 2.1. Domain Entities (`domain/entities/`)
- Entities **MUST** be defined as `class` (never as `interface`), to ensure runtime instantiation and default value assignment.
- Always include a constructor that accepts a `Partial<Entity>` to map database/DTO results.
- Example:
  ```typescript
  export class ExampleEntity {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;

    constructor(partial: Partial<ExampleEntity>) {
      Object.assign(this, partial);
      if (!this.created_at) this.created_at = new Date().toISOString();
      if (!this.updated_at) this.updated_at = new Date().toISOString();
    }
  }
  ```

### 2.2. Domain Repositories (`domain/repositories/`)
- Define the contract (interface) for data access.
- Export a dependency injection token.
- Example:
  ```typescript
  export const EXAMPLE_REPOSITORY_TOKEN = 'EXAMPLE_REPOSITORY';
  export interface ExampleRepository {
    create(dto: CreateDto): Promise<ExampleEntity>;
    findOne(id: string): Promise<ExampleEntity | undefined>;
    // ...
  }
  ```

### 2.3. Use Cases (`application/use-cases/`)
- Encapsulate a single business operation per file.
- Inject the repository interface using the token.
- Example:
  ```typescript
  @Injectable()
  export class CreateExampleUseCase {
    constructor(@Inject(EXAMPLE_REPOSITORY_TOKEN) private readonly repo: ExampleRepository) {}

    async execute(dto: CreateDto): Promise<ExampleEntity> {
      return this.repo.create(dto);
    }
  }
  ```

### 2.4. Infrastructure / DynamoDB (`infrastructure/dynamo/`)
- Implement the repository interface.
- Use `@aws-sdk/lib-dynamodb` (`PutCommand`, `GetCommand`, `UpdateCommand`, `ScanCommand`, `DeleteCommand`).
- Inject the wrapper `DynamoRepository` to execute commands.
- Map DynamoDB responses to the Entity classes.

## 3. Workflow for Specific Tasks

### 💡 Feature Development
1. **Domain First**: Define the entity class (`.entity.ts`).
2. **Contract**: Define the repository interface and DI token (`.repository.ts`).
3. **Infrastructure**: Implement the DynamoDB repository (`dynamo-<entity>.repository.ts`).
4. **Application**: Write the necessary DTOs and Use Cases (`.usecase.ts`).
5. **Transport**: Expose the endpoints via the Controller (`.controller.ts`).
6. **Wire Up**: Register everything in the Module (`.module.ts`).

### 🐛 Bug Fixing
- **Locate the Logic**: Check Controllers for routing bugs, Use Cases for business logic bugs, and Infrastructure for database interaction bugs.
- **Maintain Boundaries**: Do not leak AWS/DynamoDB specific logic into Use Cases or Entities. Database specifics stay in `infrastructure/dynamo`.

### ♻️ Refactoring
- **Check Entity Alignment**: If migrating legacy code, convert `interfaces` to entity `classes` (e.g., following the `User` module standard).
- **Service Deprecation**: Break down fat services into single-responsibility Use Cases in the `application/use-cases/` directory.
- **Type Strictness**: Replace `any` types in older code with strict DTOs and Entity classes.

## 4. General Rules
- Always use `camelCase` for variables/methods and `kebab-case` for file names.
- Ensure dependency injection relies on tokens/interfaces to keep modules loosely coupled.
- Keep `package.json` clean and rely on standard `nest` commands for building and starting the app.