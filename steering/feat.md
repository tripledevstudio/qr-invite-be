# Feature Development Steering Context (/feat)

You are tasked with adding a new feature to the **Diaty Base** project. Follow this strict domain-driven, use-case-centric workflow:

## 1. Directory Structure Rule
Every new module must follow this architecture:
```text
src/<module-name>/
├── <module-name>.module.ts       # NestJS Module
├── <module-name>.controller.ts   # NestJS Controller
├── application/
│   └── use-cases/                # Business logic use cases
│       ├── create-<entity>.usecase.ts
│       └── ...
├── domain/
│   ├── entities/                 # Domain Entity classes (NOT interfaces)
│   └── repositories/             # Repository interfaces & injection tokens
└── infrastructure/
    └── dynamo/                   # DynamoDB implementations
```

## 2. Implementation Steps
1. **Define Entity**: Create the core class in `src/<module>/domain/entities/<entity>.entity.ts` with a constructor accepting `Partial<Entity>`.
2. **Define Repository Contract**: Create the repository interface and injection token in `src/<module>/domain/repositories/<entity>.repository.ts`.
3. **Implement Repository**: Write the DynamoDB implementation using `@aws-sdk/lib-dynamodb` and `DynamoRepository` wrapper in `src/<module>/infrastructure/dynamo/dynamo-<entity>.repository.ts`.
4. **Define DTOs**: Create DTOs with validation rules in `src/<module>/dto/`.
5. **Create Use Cases**: Add distinct business operation classes in `src/<module>/application/use-cases/`. Inject repositories via the token.
6. **Expose Controller**: Create HTTP handlers in `src/<module>/<module>.controller.ts`.
7. **Wire Module**: Declare everything in `src/<module>/<module>.module.ts`.

## 3. General Principles
- Keep use-cases focused on a single business action (Single Responsibility Principle).
- Use `camelCase` for code and variables, `kebab-case` for file names.
- Do not mix database-specific types (like DynamoDB AttributeValues) inside Entities or Use Cases.