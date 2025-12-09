# Development Guidelines (v1.0)

## 1. Application Architecture
Next.js App Router (v15+) をベースとしたディレクトリ構成と責任分界点。

*   **Atomic Design (Loose):** コンポーネントは `features/` (機能単位) と `ui/` (汎用単位) に分割する。厳密なAtomic Designよりも「コロケーション（関連するものを近くに置く）」を重視する。
*   **Server Components:** 原則としてServer Componentを使用する。`use client` はインタラクティブなLeaf Componentにのみ付与する。
*   **Data Fetching:** フェッチ処理はServer Component内 (`page.tsx` や `layout.tsx`) で行い、Propsとして渡す。

## 2. Coding Standards
**Google TypeScript Style Guide** をベースとし、以下の独自ルールを追加適用する。

*   **TypeScript:** `strict: true` を必須とする。`any` 型の使用は原則禁止（`unknown` を使用し、型ガードを行う）。
*   **Documentation (JSDoc/TSDoc):**
    *   公開関数（Exported Functions）や複雑なロジックには、必ず JSDoc/TSDoc形式でコメントを記述する。
    *   IDEのホバー情報として表示されることを意識する。
*   **Comments:**
    *   **言語:** コメントは原則として「日本語」で記述する。
    *   **What vs Why:** 「コードが何をしているか（What）」はコード自体で語る。「なぜそうしたか（Why）」や「注意点」を書く。
        *   Good: `// 【注意】APIのレートリミット回避のため、ここでは意図的に5秒待機する`
        *   Bad: `// countをインクリメントする`
*   **Immutability:** 変数は可能な限り `const` を使用し、再代入可能な `let` の使用を避ける。
*   **Functional:** `for` ループよりも `map`, `filter`, `reduce` 等の高階関数を使用する。

## 3. Git Branching Strategy
**GitHub Flow** を採用する。シンプルさを最優先。

1.  `main` ブランチは常にデプロイ可能な状態を保つ。
2.  開発は `feat/xxx` や `fix/xxx` ブランチを作成して行う。
3.  Pull Request を作成し、CI (Lint/Test) がパスしたら `main` にマージする。
4.  マージと同時にProduction環境（Vercel）へデプロイされる。

## 4. CI/CD Operations
*   **CI:** GitHub Actionsにより、Lint, TypeCheck, Unit Test を自動実行。
*   **CD:** Vercel Integrationにより自動デプロイ。
