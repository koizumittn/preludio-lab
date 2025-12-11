# Components Directory Guidelines (UI Layer - View)

このディレクトリは **Presentational Components (表示用コンポーネント)** のための場所です。
「どのように見えるか」と「ユーザーインタラクション」のみに関心を持ちます。

## ディレクトリ構造
*   `features/`: ドメイン固有の機能コンポーネント (例: `ScoreRenderer`, `AudioPlayer`)。
*   `ui/`: 再利用可能な共通UIパーツ (例: `Button`, `Card`)。

## ルール (DOs)
*   **DO** コンポーネントは純粋 (Pure) かつ決定的 (Deterministic) に保つ（同じPropsなら同じ表示になる）。
*   **DO** Props のインターフェースを明示的に定義し、export する。
*   **DO** `use client` はインタラクション (`onClick`, `useState`) が必要な場合のみ付与する。

## 禁止事項 (DON'Ts)
*   **DON'T** コンポーネント内でデータフェッチを行わない。データは Props として受け取る。
*   **DON'T** `src/services/` に直接依存しない。コンポーネントはインフラ層を知るべきではない。
*   **DON'T** 重厚なビジネスロジックを含めない。
