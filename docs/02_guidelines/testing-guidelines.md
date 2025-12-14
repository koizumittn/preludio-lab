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
    *   基本的には「モック」を使用するが、重要なパス（Supabaseへの接続など）については、テスト環境やエミュレータを用いた結合テストを行う。
    *   外部APIのアダプターは、レスポンスのパース処理が正しいかをテストする。

### 2.4. UI Layer (`src/app/`, `src/components/`)
**見た目とユーザーインタラクションを確認する。**

*   **Type:** **Component Test / E2E**
*   **Tools:** `React Testing Library`, `Storybook`, `Playwright`
*   **Strategy:**
    *   **Presentation (`src/components`):**
        *   `Storybook` での見た目確認。
        *   `React Testing Library` でのインタラクション（クリック等）確認。
        *   **Wrapper Patternのテスト:**
            *   `[Feature]Renderer.tsx`: テスト対象のメイン（ロジック実装部）。
                *   **Note:** `React Testing Library (RTL)` を使用し、内部stateではなく「ユーザーから見た振る舞い（ボタンが押せるか、表示が変わったか）」をテストする。
            *   `[Feature]ClientWrapper.tsx`: ほぼローディングと動的読み込みのみのため、Unitテストは必須としない（E2Eでカバー）。
    *   **Controller (`src/app` - Server Actions):**
        *   Server Actionsは「関数」としてエクスポートされているため、Unit Test（Integration Test）が可能。
        *   **Validation Check:** Zodバリデーションが機能しているか、不正データを渡して検証する。
        *   **Mock Repositories:** ドメイン層以下をモックして、Action自体の挙動（Cookie設定、リダイレクト等）をテストする。

## 3. Tooling Stack

| Category | Tool | Scope |
| :--- | :--- | :--- |
| **Unit / Integration** | **Vitest** | Domain, Application, Infra |
| **Component** | **Storybook** | UI Components (Visual) |
| **E2E** | **Playwright** | Critical User Flows (Smoke Test) |

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

