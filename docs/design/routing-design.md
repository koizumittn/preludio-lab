# Routing Design

## 1. URL Structure Principle
`domain/[lang]/[category]/[slug]`

*   **[lang]:** `ja`, `en`, `es` (ISO 639-1)
*   **[category]:** Resource collection name (plural)
*   **[slug]:** Unique identifier (kebab-case)

## 2. Route Map

| URL Pattern | Page Type | Description |
| :--- | :--- | :--- |
| `/` | Redirect | Redirects to default locale (`/ja`) using Middleware. |
| `/[lang]` | **Top Page** | Landing page. Hero, Categories, New Arrivals. |
| `/[lang]/works` | **Index** | List of all work analysis articles. Filterable. |
| `/[lang]/works/[slug]` | **Detail** | **(Core)** Work Analysis article with Score & Audio. |
| `/[lang]/composers` | **Index** | List of composers. |
| `/[lang]/composers/[slug]` | **Detail** | Composer profile and their works. |
| `/[lang]/theory` | **Index** | List of theory articles. |
| `/[lang]/theory/[slug]` | **Detail** | Theory explanation. |
| `/[lang]/about` | **Static** | About the proejct. |

## 3. Redirect Rules
*   `/` -> `/ja` (307 Temporary Redirect -> 308 Permanent later)
*   Disable direct access to `/works/[slug]` without locale (Middleware handles this).
