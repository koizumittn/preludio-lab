# Testing Guidelines (v2.0 - Clean Architecture)

開発ガイドラインで定義された「クリーンアーキテクチャ」のレイヤー構造に基づき、各層のテスト戦略を規定する。

## 1. Testing Philosophy (The Test Pyramid)
**「ドメインロジックの純粋性と堅牢性」** を最優先する。
UIやインフラは変わりやすいため、そこに依存しない `Domain` と `Application` 層のテストカバレッジを厚くする。

## 2. Layer-by-Layer Strategy

### 2.1. Domain Layer (`src/domain/`)
**最も重要。ビジネスルールの正しさを保証するため、極めて高いカバレッジを確保する。**

*   **Type:** **Pure Unit Test**
*   **Tool:** `Vitest`
*   **Strategy:**
    *   外部依存やモック（Mock）は一切使用しない。入力に対する出力が正しいかを検証する。
    *   境界値テスト（Boundary Value Analysis）を重点的に行う。
*   **Target:** `Entities`, `Domain Services`
*   **Validation:** Domain層では「ビジネスルールの整合性」をテストする。入力値の形式（フォーマット）チェックはここではなく、Application層の責務とする。

### 2.2. Application Layer (`src/application/`)
**ユースケース（処理の流れ）が正しく構成されているかを確認する。**

*   **Type:** **Unit Test (with Mocks)**
*   **Tool:** `Vitest`
*   **Strategy:**
    *   `src/domain/repositories` のインターフェースを **Mock化** してテストする（Repositoryの挙動は制御下に置く）。
    *   「正常系」だけでなく「リポジトリがエラーを吐いた場合」などの「異常系」もテストする。
*   **Target:** `Use Case` classes, `DTOs`
*   **Validation Rule (Strict):**
    *   **DTO Test:** `zod` スキーマ定義を含む DTO ファイルに対してテストを作成し、境界値や不正なフォーマットの入力が正しくエラー（`ZodError`）になることを検証する。
    *   **Use Case:** バリデーション済みのデータが渡ってくる前提で、ビジネスフローをテストする。

### 2.3. Infrastructure Layer (`src/infrastructure/`)
**外部システム（Supabase, API）との連携が正しく行えるかを確認する。**

*   **Type:** **Integration Test**
*   **Tool:** `Vitest`
*   **Strategy:**
    *   **Scope Limitation:** 実際のDB接続を伴うテストはコストが高いため、Unit Testでは**「データ変換ロジック（Mapper）」の検証**に集中する。
        *   例: Supabaseからのレスポンス(Snake Case)が、正しくEntity(Camel Case)に変換されているか。
    *   **Mocking:** `supabase-js` クライアント自体をモックし、通信発生を回避する。実際の通信テストは手動またはE2Eで行う。

### 2.4. UI Layer (`src/app/`, `src/components/`)
**見た目とユーザーインタラクションを確認する。**

*   **Type:** **Component Test / E2E**
*   **Tools:** `React Testing Library`, `Storybook`, `Playwright`
*   **Strategy:**
    *   **Server Component (`src/app/**/page.tsx`):**
        *   **Rule:** `async` コンポーネントの単体テストは困難（RTL非対応）なため、**Unit Testは作成しない**。
        *   **Alternative:** E2Eテスト (`Playwright`) で表示確認を行う。
    *   **Client Component (`src/components`):**
        *   **Rule:** `React Testing Library (RTL)` を使用し、内部stateではなく「ユーザーから見た振る舞い（ボタンが押せるか、表示が変わったか）」をテストする。
        *   **Wrapper Pattern:**
            *   `[Feature]Renderer.tsx`: テスト対象のメイン。RTLでロジック検証。
            *   `[Feature]ClientWrapper.tsx`: E2Eに任せ、Unit Testはスキップ可。
    *   **Controller (`src/app` - Server Actions):**
        *   **Mocking Strategy:** `next/navigation` (`redirect`) や `next/headers` (`cookies`) を使用している場合は、必ず `vi.mock` でモック化する。
            ```ts
            vi.mock('next/navigation', () => ({ redirect: vi.fn() }));
            ```
        *   **Validation Check:** Zodバリデーションが機能しているか、不正データを渡して検証する。

## 3. Tooling Stack & Configuration

| Category | Tool | Scope |
| :--- | :--- | :--- |
| **Unit / Integration** | **Vitest** | Domain, Application, Infra |
| **Component** | **Storybook** | UI Components (Visual) |
| **E2E** | **Playwright** | Critical User Flows (Smoke Test) |

### 3.1. Scripts & Config
*   **Config File:** `vitest.config.ts` (React/TS対応済み), `vitest.setup.ts` (Global Setup)
*   **Commands:**
    *   `npm test`: 全てのテストを1回実行する。
    *   `npm run test:watch`: ウォッチモードでテストを実行する（変更を検知して再実行）。
    *   `npm run test:coverage`: カバレッジレポートを生成する。
*   **CI Integration:** `ci-check.yml` 内の `Unit Test` ステップで実行される。

## 4. Test Example (Pseudocode)

### Domain Test
```typescript
// Score.test.ts
const score = new Score({ level: 5 });
expect(score.isDifficult()).toBe(true); // 純粋な計算
```

### Application Test
```typescript
// RegisterUserUseCase.test.ts
const mockRepo = { save: vi.fn() }; // Mock
const useCase = new RegisterUserUseCase(mockRepo);
await useCase.execute(input);
expect(mockRepo.save).toHaveBeenCalledWith(expectedUser); // 呼び出し確認
```

## 5. File Location & Naming
テストファイルの配置場所と命名規則を以下の通り規定する。

### 5.1. Unit & Integration Tests (Colocation)
**原則として、テスト対象ファイルと同じディレクトリに配置する（Colocation）。**
ディレクトリを分離すると、ファイルの移動時に追従しづらくなるためである。

*   **Location:** 対象ファイルと同じディレクトリ (`src/...`)
*   **Naming:** `[対象ファイル名].test.ts` (or `.test.tsx`)
*   **Example:**
    *   `src/domain/entities/User.ts`
    *   `src/domain/entities/User.test.ts`

### 5.2. E2E Tests
E2Eテストはアプリケーション全体を外部から叩くテストであるため、ソースコードとは切り離して管理する。

*   **Location:** プロジェクトルート直下の `e2e/` ディレクトリ
*   **Naming:** `[機能名].spec.ts`
*   **Example:**
    *   `e2e/auth-flow.spec.ts`

## 6. Verification Strategy (Non-Functional & Ad-hoc)
自動テストではカバーしきれない非機能要件や、一時的な検証を行う際の戦略。

### 6.1. Performance Verification
定量的な数値目標（Acceptance Criteria）を設けて検証する。

*   **Metrics:** 読み込み時間、レンダリング時間、Lighthouseスコア等。
*   **Method:**
    *   `console.time` / `performance.now()` を一時的に埋め込み計測する（本番ログ自動削除設定の確認必須）。
    *   Chrome DevTools の CPU Throttling を使用し、モバイル環境をシミュレートする。
*   **Evidence:** スクリーンショットやログ出力を記録し、成果物（Walkthrough）に残す。

### 6.2. Ad-hoc Verification Pages
特定のコンポーネントや挙動を隔離して検証するために、一時的なページを作成する場合のルール。

*   **Location:** `src/app/[lang]/_test/` (推奨) または検証専用ブランチを作成する。
    *   **Note:** `src/app/test` のようにルート直下に配置すると、`[lang]` の動的ルーティングやMiddlewareと競合して 404 になる場合があるため注意する。
*   **Cleanup:** 検証完了後は速やかに削除する。Gitにはコミットしない（または検証用ブランチでのみ管理する）。

### 6.3. Negative Testing (Fault Injection)
「正常に動くこと」だけでなく、「異常時に正しく失敗すること（Fail Gracefully）」を検証する。

*   **Verified Error UI:**
    *   開発中（特に `_test` ページ等）に「強制的にエラーを発生させるボタン（Test Error Trigger）」を設置し、エラーハンドラ、Sentry通知、Toaster表示が機能することを目視確認する。
    *   **Reason:** エラーハンドリングコード自体もバグを含む可能性があり、本番で初めて実行される事態を避けるため。
*   **Promise Rejection:**
    *   非同期処理の検証では、意図的に Reject させるケースを必ずテストする。


