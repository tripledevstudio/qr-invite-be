# Bug Fix Steering Context (/bug)

Use this file as the context when you type `/bug` in the chat.

## Typical Steps
1. **Identify the failing test or runtime error** – locate the file and line number.
2. **Check the repository contract** – ensure the repository interface still matches the entity.
3. **Fix the implementation** – modify the affected use‑case, repository, or controller.
4. **Run the test suite** – `npm run test` (or `npm run test:watch`).
5. **Verify no regressions** – ensure existing tests still pass.

## Principles
- Keep the fix isolated to the smallest possible component.
- Do not introduce new business logic in a bug‑fix commit.
- Update only the files that directly affect the failing scenario.