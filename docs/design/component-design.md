# Component Design (Atomic Design)

## 1. Directory Structure
`src/components/`

*   `ui/` (Atoms/Molecules): Generic UI parts (Button, Card, Badge).
*   `layout/` (Organisms): Header, Footer, Sidebar.
*   `features/` (Organisms/Templates): Domain specific complex components.
    *   `score/`: ScoreRenderer
    *   `audio/`: AudioPlayer
    *   `article/`: ArticleBody, TOC

## 2. Key Components

### ScoreRenderer (Organisms)
*   **Props:** `{ abc: string; highlightMeasure?: number }`
*   **Tech:** `react-abc` (or Verovio WASM wrapper)
*   **Responsibility:**
    *   Render ABC string to SVG.
    *   Handle responsive scaling.
    *   Highlight specific measures based on props.

### AudioPlayer (Organisms)
*   **Props:** `{ videoId: string; onTimeUpdate: (seconds: number) => void }`
*   **Tech:** `react-youtube` (IFrame API)
*   **Responsibility:**
    *   Play/Pause/Seek control.
    *   Emit current timestamp (100ms interval) to parent for syncing.

### ArticleBody (Template)
*   **Props:** `{ content: MDXRemoteSerializeResult }`
*   **Responsibility:**
    *   Render MDX content.
    *   Map custom MDX components (e.g. `<Score>` tag) to `ScoreRenderer`.

## 3. UI Library (Atoms)
Based on styling needs, we implement:
*   `Button`: Variants (Primary, Secondary, Ghost).
*   `Card`: Container for lists.
*   `Container`: Max-width wrapper.
*   `Typography`: H1, H2, P with correct font-family.
