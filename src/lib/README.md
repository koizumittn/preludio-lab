# Lib Directory Guidelines (Shared Utilities)

This directory is for **Stateless Utility Functions**.

## Responsibilities
*   **Helpers:** Date formatting, String manipulation, Validation.
*   **Constants:** Global configuration values.

## Rules (DOs)
*   **DO** write pure functions (no side effects).
*   **DO** include Unit Tests (`*.test.ts`) for complex logic.

## Prohibitions (DON'Ts)
*   **DON'T** contain React Components.
*   **DON'T** depend on specific UI frameworks if possible.
