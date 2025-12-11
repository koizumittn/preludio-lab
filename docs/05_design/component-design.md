# コンポーネント設計 (Component Design - Atomic Design)

## 1. ディレクトリ構造 (Directory Structure)
`src/components/`

*   `ui/` (Atoms/Molecules): 汎用UIパーツ (Button, Card, Badgeなど)。
*   `layout/` (Organisms): Header, Footer, Sidebarなどの共通レイアウト部品。
*   `features/` (Organisms/Templates): ドメイン固有の複雑なコンポーネント。
    *   `score/`: ScoreRenderer
    *   `audio/`: AudioPlayer
    *   `article/`: ArticleBody, TOC

## 2. 主要コンポーネント (Key Components)

### ScoreRenderer (Organisms)
*   **Props:** `{ abc: string; highlightMeasure?: number }`
*   **Tech:** `react-abc` (または Verovio WASM wrapper)
*   **Responsibility (責務):**
    *   ABC記法の文字列をSVG楽譜として描画する。
    *   レスポンシブスケーリング（画面幅に応じたサイズ調整）。
    *   Propsに基づいて特定の小節をハイライト表示する。

### AudioPlayer (Organisms)
*   **Props:** `{ videoId: string; onTimeUpdate: (seconds: number) => void }`
*   **Tech:** `react-youtube` (IFrame API)
*   **Responsibility (責務):**
    *   再生/一時停止/シーク制御。
    *   現在の再生時間（タイムスタンプ）を親コンポーネントへ通知（100ms間隔等で同期用イベント発火）。

### ArticleBody (Template)
*   **Props:** `{ content: MDXRemoteSerializeResult }`
*   **Responsibility (責務):**
    *   MDXコンテンツのレンダリング。
    *   カスタムMDXコンポーネント（例: `<Score>` タグ）を `ScoreRenderer` にマッピングする。

## 3. UIライブラリ (Atoms)
スタイリング要件に基づき、以下を実装する：
*   `Button`: バリアント (Primary, Secondary, Ghost)。
*   `Card`: リスト表示用コンテナ。
*   `Container`: 最大幅（max-width）制御用ラッパー。
*   `Typography`: H1, H2, P など、適切なフォントファミリーを適用したテキスト部品。
