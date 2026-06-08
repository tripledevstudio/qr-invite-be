# Refactor Steering Context (/refactor)

When you type `/refactor` in the chat, this file provides the guiding principles for code refactoring.

## Goals
- Improve readability, maintainability, and performance.
- Preserve existing behavior (run full test suite after changes).

## Checklist
1. **Locate the target module** – identify the module, entity, or use‑case you wish to refactor.
2. **Write tests (if missing)** – ensure coverage for the current behavior.
3. **Apply incremental changes** – modify one file at a time.
4. **Run tests after each change** – `npm run test`.
5. **Commit logical units** – each commit should represent a single refactor step.

## Rules
- Do not alter public repository interfaces unless a migration plan is in place.
- Keep the domain entities pure (no DynamoDB‑specific code).
- Keep Use‑Cases focused on a single business operation.
- **DynamoDB Tables**: When renaming or restructuring modules, ensure any new/modified table names are updated in `src/dynamo/constants.ts` and registered for auto-creation in `DynamoDBService#ensureTablesExist`.
