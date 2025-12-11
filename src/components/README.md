## 設計思想 (Philosophy)
**「責務による分離 (Separation of Concerns)」** を重視しています。
UIコンポーネントを「機能（Domain）」と「見た目（UI）」と「構造（Layout）」に明確に分けることで、再利用性と保守性を高めます。

## ディレクトリ構造
*   **`ui/` (Presentation):**
    *   特定のドメイン（User, Score等）を知らない、純粋な見た目のパーツ。
    *   他プロジェクトでも使えるような汎用性を持つ（Atomic Designの Atoms/Molecules 相当）。
    *   例: `Button`, `Card`, `Modal`
*   **`features/` (Container/Domain):**
    *   特定のドメイン知識を持つ、機能的なコンポーネント。
    *   `ui/` を組み合わせて作られることが多い（Atomic Designの Organisms 相当）。
    *   例: `ScoreRenderer` (楽譜を描画する), `AudioPlayer` (音楽を再生する)
*   **`layouts/` (Structure):**
    *   ページの骨組み。ヘッダー、フッター、サイドバーなど。
*   **`providers/` (Context Wrappers):**
    *   **役割:** アプリケーション全体に「機能（State/Context）」を提供するためのラッパー。
    *   **なぜ必要か:** Next.js App Router (`layout.tsx`) はサーバーコンポーネントですが、React Context (`createContext`) はクライアント側でしか動きません。そのため、`"use client"` を付けた別のコンポーネントとして切り出す必要があります。
    *   例: `ThemeProvider` (ダークモード管理), `AuthProvider` (ログイン状態管理)
*   **`skeletons/` (Loading States):**
    *   データ読み込み中に表示する「読み込み中プレースホルダー」。
    *   Suspense の `fallback` として使用する。


## ルール (DOs)
*   **DO** コンポーネントは純粋 (Pure) かつ決定的 (Deterministic) に保つ（同じPropsなら同じ表示になる）。
*   **DO** Props のインターフェースを明示的に定義し、export する。
*   **DO** `use client` はインタラクション (`onClick`, `useState`) が必要な場合のみ付与する。

## 禁止事項 (DON'Ts)
*   **DON'T** コンポーネント内でデータフェッチを行わない。データは Props として受け取る。
*   **DON'T** `src/services/` に直接依存しない。コンポーネントはインフラ層を知るべきではない。
*   **DON'T** 重厚なビジネスロジックを含めない。
