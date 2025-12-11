# Development Guidelines (v1.0)

## 1. Application Architecture
Next.js App Router (v15+) をベースとしたディレクトリ構成と責任分界点。

*   **Atomic Design (Loose):** コンポーネントは `features/` (機能単位) と `ui/` (汎用単位) に分割する。厳密なAtomic Designよりも「コロケーション（関連するものを近くに置く）」を重視する。
*   **Server Components:** 原則としてServer Componentを使用する。`use client` はインタラクティブなLeaf Componentにのみ付与する。
*   **Data Fetching:** フェッチ処理はServer Component内 (`page.tsx` や `layout.tsx`) で行い、Propsとして渡す。

## 2. Coding Standards
**Google TypeScript Style Guide** をベースとし、以下の独自ルールを追加適用する。

### 2.1. TypeScript & JavaScript
*   **TypeScript:** `strict: true` を必須とする。`any` 型の使用は原則禁止（`unknown` を使用し、型ガードを行う）。
*   **Immutability:** 変数は可能な限り `const` を使用し、再代入可能な `let` の使用を避ける。
*   **Functional:** `for` ループよりも `map`, `filter`, `reduce` 等の高階関数を使用する。

### 2.2. React / Next.js Best Practices
*   **Hooks Rules:**
    *   **Prefix:** Custom Hooksは `use` で始める。
    *   **Logic Separation:** 複雑なロジック（Effect, State Management）はコンポーネント内にベタ書きせず、`useYourLogic.ts` に切り出して責務を分離する（Colocation）。
*   **Component Definition:**
    *   `function` キーワードを使用する（アロー関数 `const Component = () => {}` は、Propsの型定義が見づらくなるため避ける）。
    *   **Props:** 必ず `interface` で定義し、エクスポートする。`React.FC` は使用しない。
*   **Server vs Client:**
    *   データフェッチは Server Component で行う。
        *   **Reason:** クライアントへAPIキーやDB接続情報を露出させないため（Security）、およびJSバンドルサイズを削減するため（Performance）。VercelなどのServerless環境でも動作する。
    *   `use client` はツリーの末端（Leaf）で使用し、サーバーレンダリングの恩恵を最大化する。
    *   Image Optimization: `next/image` を使用し、レイアウトシフト（CLS）を防ぐ。

### 2.3. Documentation & Comments
*   **Documentation (JSDoc/TSDoc):**
    *   公開関数（Exported Functions）や複雑なロジックには、必ず JSDoc/TSDoc形式でコメントを記述する。
    *   IDEのホバー情報として表示されることを意識する。
*   **Language:** コメントは原則として「日本語」で記述する。
*   **What vs Why:** 「コードが何をしているか（What）」はコード自体で語る。「なぜそうしたか（Why）」や「注意点」を書く。

## 3. Git Branching & Workflow Strategy
**GitHub Flow** を採用し、シンプルかつ高速なリリースサイクルを維持する。

### 3.1. Branch Rules
*   `master`: **Protected Branch.** 直接コミット禁止。PRマージのみ受け付ける。常にデプロイ可能な状態（Deployable）を維持する。
*   `feat/{issue-id}-{slug}`: 機能追加。
    *   **Note:** Issue ID (`#123`) を含めることで、GitHub上でIssueとPR/Branchが自動的に紐付き、追跡性（Traceability）が向上する。
*   `fix/{issue-id}-{slug}`: バグ修正。
*   `docs/{slug}`: ドキュメント修正。

### 3.2. Pull Request (PR) Policy
*   **Template:** プロジェクト規定のPRテンプレート（`.github/pull_request_template.md`）を使用する。
    *   **Summary:** 何をしたか。
    *   **Related Issues:** 関連するIssue番号 closes #123.
    *   **Verification:** どうやって動作確認したか（スクショ、動画、コマンド）。
*   **Review:** 最低1名の承認（Approve）を必須とする（AIエージェントによる自動承認も含む）。
*   **Merge Strategy:** **Squash & Merge** を原則とする。
    *   **Reason:** 開発中の試行錯誤（typo修正など）の履歴を1つのコミットにまとめ、`master` の履歴を「機能単位」でクリーンに保つため。

### 3.3. Commit Message Convention
*   **Prefix:** `naming-conventions.md` で定義されたPrefix (`feat:`, `fix:`, etc.) を必ず付与する。
*   **Language:** 日本語。
*   **Scope:** 変更範囲が明確な場合は `feat(ui):` のようにスコープを記述する。

## 4. CI/CD Operations
*   **CI:** GitHub Actionsにより、Lint, TypeCheck, Unit Test を自動実行。
*   **CD:** Vercel Integrationにより自動デプロイ。

## 5. Styling Guidelines (Tailwind CSS)
*   **Utility First:** 原則として `className` にTailwindのユーティリティクラスを直接記述する。`@apply` は再利用性が極めて高い場合（ボタン等）に限定する。
*   **No Arbitrary Values:** `w-[350px]` のようなArbitrary Valueの使用は避け、`tailwind.config.ts` で定義されたトークン（Spacing, Colors）を使用する。デザインシステムの一貫性を保つため。
*   **Responsiveness:** **モバイルファースト**で記述する。
    *   **Rule:** プレフィックス無し＝スマホ（全サイズ）。`md:` などのプレフィックス＝そのサイズ以上での上書き（Desktop）。
    *   Example: `className="flex md:block"` → スマホでは `flex`、PCでは `block`。

## 6. Security & Database Guidelines (Supabase)
*   **RLS (Row Level Security):** すべてのテーブルに対して RLS を有効化 (`ENABLE ROW LEVEL SECURITY`) し、ポリシーを明示的に定義する。
*   **No Raw SQL:** SQLインジェクションを防ぐため、Supabase Client SDK (`supabase-js`) のメソッドチェーンのみを使用する。生SQLの実行は禁止。
*   **Secrets:** APIキーや接続文字列は `.env.local` で管理し、リポジトリにはコミットしない。クライアント側に露出させる変数は `NEXT_PUBLIC_` プレフィックスを付けるが、最小限に留める。
