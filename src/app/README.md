# App Directory Guidelines (UI Layer - Controller)

This directory corresponds to the **Controller** in MVC.
It is responsible for Routing, Data Fetching, and Layouts.

## Responsibilities
*   **Routing:** Define URL structure using Next.js App Router conventions.
*   **Data Fetching:** Fetch data from `src/services/` in Server Components.
*   **Layout:** Define common UI structures (`layout.tsx`).
*   **Metadata:** Define SEO metadata (`generateMetadata`).

## Rules (DOs)
*   **DO** use Server Components by default.
*   **DO** call functions from `src/services/` to fetch data.
*   **DO** pass fetched data to components in `src/components/` via props.

## Prohibitions (DON'Ts)
*   **DON'T** write complex business logic here. Move it to `src/services/` or `src/lib/`.
*   **DON'T** call external APIs (fetch) directly. Use `src/services/`.
*   **DON'T** import DB clients (Supabase) directly. Use `src/services/`.
