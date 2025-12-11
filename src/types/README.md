# Types Directory Guidelines (Domain Layer)

This directory defines the **Domain Entities** and Interfaces.
It is the "Language" of the project.

## Responsibilities
*   **Entities:** `Score`, `User`, `Composer`.
*   **Interfaces:** `ContentRepository`, `AuthService` (Abstract interfaces).

## Rules (DOs)
*   **DO** use `interface` or `type` definitions.
*   **DO** define strictly typed structures.

## Prohibitions (DON'Ts)
*   **DON'T** include implementation logic (functions). Only Types.
*   **DON'T** import from `src/app` or `src/components`. (No dependency on UI).
