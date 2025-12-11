# Components Directory Guidelines (UI Layer - View)

This directory is for **Presentational Components**.
They should focus on "How things look" and "User Interaction".

## Structure
*   `features/`: Domain-specific components (e.g., `ScoreRenderer`, `AudioPlayer`).
*   `ui/`: Reusable generic components (e.g., `Button`, `Card`).

## Rules (DOs)
*   **DO** keep components pure and deterministic (given same props, render same UI).
*   **DO** define Props interface explicitly (and export it).
*   **DO** use `use client` only when interactivity (`onClick`, `useState`) is needed.

## Prohibitions (DON'Ts)
*   **DON'T** fetch data in components. Receive data as Props.
*   **DON'T** depend on `src/services/` directly. Components should be unaware of Infrastructure.
*   **DON'T** contain heavy business logic.
