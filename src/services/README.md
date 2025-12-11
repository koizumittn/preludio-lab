# Services Directory Guidelines (Infrastructure Layer)

This directory is the implementation of the **Repository Pattern**.
It handles all external communication (APIs, DB, FileSystem).

## Structure
*   `auth/`: Supabase Auth wrapping.
*   `content/`: MDX reading/parsing logic.
*   `gemini/`: Google AI Studio API calls.
*   `youtube/`: YouTube Data API calls.

## Rules (DOs)
*   **DO** abstract the implementation details. (e.g. `getPost()` rather than `fs.readFileSync()`).
*   **DO** handle errors and return typed results defined in `src/types/`.

## Prohibitions (DON'Ts)
*   **DON'T** export raw SDK clients (SupabaseClient) to the UI layer.
*   **DON'T** return UI components. Return Data.
