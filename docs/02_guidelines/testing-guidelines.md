# Testing Guidelines (v1.0)

## 1. Testing Philosophy (The Test Pyramid)
*   **Unit Tests:** 多めに書く。ロジックの正しさを保証する。高速。
*   **Integration Tests:** 必要に応じて。コンポーネント間の連携を確認する。
*   **E2E Tests:** 重要導線のみ。ユーザー体験を保証する。低速で壊れやすい。

## 2. Unit Testing Strategy
**Tool:** `Vitest` (Jest互換、Viteネイティブ)

*   **Target:**
    *   `src/lib/` 配下のユーティリティ関数（特にMDXパーサー、ABC記法変換ロジック）。
    *   複雑なロジックを持つCustom Hooks。
*   **Naming:** `*.test.ts` または `*.test.tsx`。対象ファイルの真横に配置する（Colocation）。

## 3. Integration / Component Testing
**Tool:** `React Testing Library`

*   **Target:**
    *   `ScoreRenderer` などのコア機能コンポーネント。
    *   ユーザーインタラクション（クリック、入力）を伴うUI。

## 4. E2E Testing (Phase 4+)
**Tool:** `Playwright`

*   **Target Environment:** **Verification Environment (Vercel Preview)** に対して実行する。`localhost` ではない。
*   **Scenarios:**
    *   トップページから楽曲記事への遷移とレンダリング確認。
    *   多言語切り替え機能の動作テスト。
    *   **Smoke Test:** 本番リリース前の必須チェック項目（例: 500エラーが出ていないか）。
