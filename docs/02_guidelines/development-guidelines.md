# Development Guidelines (v1.0)

## 1. Application Architecture (Clean Architecture / Onion)

開発の効率性と保守性を最大化するため、**厳格なクリーンアーキテクチャ（Onion Architecture）**を採用する。
記述量が増える「ボイラープレート」のコストよりも、**「関心事の分離」**と**「依存方向の厳守」**を最優先する。

### 1.1. Core Philosophy
*   **Use Case層の導入:** UIとロジックを完全に切り離し、実装単位（Context）を明確にする。
*   **DIP (Dependency Inversion Principle) の徹底:** `Domain` 層にインターフェースを置き、`Infrastructure` 層がそれを実装する。

### 1.2. Directory Structure

```text
src/
├── app/                      # [UI Layer] Next.js App Router (Pages, Layouts)
│   ├── _actions/             # Server Actions (Controller / Entry Point)
│   └── (routes)/             # 各画面のルーティング
├── components/               # [UI Layer] React Components (Pure View)
│
├── domain/                   # [Domain Layer] ★最重要・外部依存ゼロ
│   ├── entities/             # 型定義・データ構造 (User, Score)
│   ├── services/             # 純粋なドメインロジック (計算・判定)
│   └── repositories/         # リポジトリのインターフェース定義 (IUserRepository)
│
├── application/              # [Use Case Layer] アプリケーションの機能単位
│   ├── use-cases/            # 実処理クラス (RegisterUserUseCase)
│   └── dtos/                 # 入出力データ定義 (RegisterUserInput)
│
├── infrastructure/           # [Infra Layer] 技術的詳細・外部連携
│   ├── database/             # Supabase Client, Prismaなど
│   ├── repositories/         # Domain層IFの実装 (SupabaseUserRepository)
│   └── external/             # 外部APIクライアント (Stripe, Geminiなど)
│
└── lib/                      # [Shared] 汎用ユーティリティ
```

### 1.3. Layers Definition & Responsibilities

#### Domain Layer (`src/domain/`)
*   **役割:** ビジネスの「用語」「ルール」「契約（インターフェース）」を定義する。
*   **ルール:** 他のいかなる層（Application, Infra, UI）にも依存してはならない。
*   **実装のポイント:** 「まずは技術詳細を無視して、TypeScriptの型とInterfaceだけ定義する」

#### Application Layer (`src/application/`)
*   **役割:** ユーザーが「何をしたいか（ユースケース）」を表現する。
*   **構成:**
    *   **Use Case:** ドメイン層のInterfaceを使って処理フローを記述する。具体的なDB操作は知らなくて良い。
    *   **DTO:** UI層とやり取りするための単純なデータ型。
*   **実装のポイント:** 「Repository Interfaceを使って、〇〇を行うビジネスロジックを実装する」

#### Infrastructure Layer (`src/infrastructure/`)
*   **役割:** ドメイン層で定義されたInterfaceを、具体的な技術（Supabase, API）で実装する。
*   **ルール:** ここを変更しても、DomainやApplication層のコードを変えてはならない。
*   **実装のポイント:** 「Supabaseを使って `IUserRepository` の実体クラスを作成する」

#### UI Layer (`src/app/`, `src/components/`)
*   **役割:** データの表示とユーザー入力の受付。
*   **Server Actions:** コントローラーとして機能する。ここで「依存性の注入（DI）」を行い、Use Caseを実行する。

### 1.4. Architecture Diagram & Data Flow
依存の矢印 `-->` は常に **内側（Domain）** に向かう。

```mermaid
graph TD
    %% Layers
    subgraph UI_Layer [UI Layer: src/app]
        Page[Page / View]
        Action[Server Action / Controller]
    end

    subgraph App_Layer [Application Layer: src/application]
        Input[DTO: Input]
        UseCase[Use Case Class]
    end

    subgraph Domain_Layer [Domain Layer: src/domain]
        Entity[Entities]
        RepoIF[Repository Interface]
    end

    subgraph Infra_Layer [Infra Layer: src/infrastructure]
        RepoImpl[Repository Implementation]
        DB[(Supabase / External)]
    end

    %% Flow
    Page -->|1. Submit| Action
    Action -->|2. Instantiate & Call| UseCase
    
    %% Dependency Injection (Manual in Action)
    Action -.->|Inject| RepoImpl
    
    %% Use Case Logic
    UseCase -->|3. Use| RepoIF
    UseCase -->|4. Manipulate| Entity
    
    %% Infra Implementation
    RepoImpl -.->|Implements| RepoIF
    RepoImpl -->|5. Fetch/Save| DB

    %% Styling
    classDef domain fill:#f9f,stroke:#333,stroke-width:2px;
    class Entity,RepoIF domain;
```

### 1.5. Development Workflow
以下の順序で実装を進めることで、依存関係の混乱を防ぐ。

1.  **Phase 1: Domain Definition** (`src/domain` Entity & Interface)
2.  **Phase 2: Use Case Implementation** (`src/application` Business Logic)
3.  **Phase 3: Infrastructure Implementation** (`src/infrastructure` DB/API Adapter)
4.  **Phase 4: UI Connection** (`src/app` Server Action & View)

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
*   **Review:** 最低1名の承認（Approve）を必須とする。
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
