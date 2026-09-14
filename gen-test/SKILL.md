---
name: gen-test
description: Generate tests for the current project using its testing framework. Use when asked to write tests, add test coverage, or create test files.
disable-model-invocation: true
---

# Generate Tests

Create tests that follow the project's existing patterns and testing framework.

## Step 1: Detect testing framework

Check the project root for:
- `package.json` → look for jest, vitest, mocha, playwright in devDependencies
- `pom.xml` / `build.gradle` → JUnit 5
- `pyproject.toml` / `setup.py` → pytest
- `go.mod` → Go testing

## Step 2: Find existing test patterns

Search for existing tests to match the project's style:
- File naming: `*.test.ts`, `*.spec.ts`, `*Test.java`, `test_*.py`
- Directory structure: `__tests__/`, `src/test/`, `tests/`
- Import patterns, assertion libraries, mocking approach
- Setup/teardown patterns

## Step 3: Generate tests

For each function/class/module to test, generate:

1. **Happy path** — Normal expected behavior
2. **Edge cases** — Empty inputs, nulls, boundary values, zero/negative numbers
3. **Error handling** — Invalid inputs, expected exceptions
4. **Financial precision** (if applicable) — Rounding, BigDecimal, floating point

## Rules

- Match the existing test file naming convention exactly
- Use the same assertion library as existing tests
- Use the same mocking approach (don't introduce new mock libraries)
- Place test files in the same location pattern as existing tests
- For Java: use `@DisplayName` for readable test names
- For TypeScript: use `describe`/`it` blocks with clear descriptions
- For Python: use descriptive `test_` function names
- Never mock the database if existing tests use real connections
- Financial calculations: always test with known expected values, not approximate comparisons
