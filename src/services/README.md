# Services Directory Guidelines (Infrastructure Layer)

このディレクトリは **Repository Pattern (リポジトリパターン)** の実装場所です。
外部システム（API, DB, ファイルシステム）との全ての通信を担当します。

## 設計思想 (Abstraction First)
**「具体的なサービス名（Gemini, YouTube）をディレクトリ名にしない」** ことを推奨します。
サービス層は「ドメインが何をしたいか（What）」で命名し、どのインフラを使うか（How）は隠蔽します。

## ディレクトリ構成
### 1. Repository Interface (Abstraction)
インターフェースは **Domain Layer (`src/types/repositories/`)** に配置することを強く推奨します。

*   **Reason:** クリーンアーキテクチャの「依存性逆転の原則 (DIP)」に従うため。
    *   `src/services/` (Infrastructure) が `src/types/` (Domain) に依存する形を作る。
    *   UI層は `src/types/` だけを知っていればよく、`src/services/` への依存を最小限にできる。

### 2. Implementation (Infrastructure)
具体的な実装クラスのみを本ディレクトリ (`src/services/`) に配置します。
実装クラスは `src/types/repositories/` で定義されたインターフェースを `implements` します。

*   `auth/`: 認証機能。
    *   `index.ts`: `AuthRepository` の実装 (内部でSupabaseを呼ぶ)。
*   `ai/`: AI機能。
    *   `gemini.ts`: Google Generative AI の実装。
*   `video/`: 動画配信機能。
    *   `youtube.ts`: YouTube Data API の実装。
*   `content/`: コンテンツ管理。
    *   `mdx-loader.ts`: ファイルシステムからの読み込み。

## 利用ルール (Usage)
*   UI層 (`src/app/`) からは、極力**「抽象化された機能名（ディレクトリ）」** (`services/ai`) をインポートする。
*   特定のクラウドベンダーに依存した名称を使わないことで、将来的なリプレイス（例: YouTube -> Vimeo, Gemini -> OpenAI）を容易にする。
*   **DO** エラーハンドリングを行い、`src/types/` で定義された型付きの結果を返す。

## 禁止事項 (DON'Ts)
*   **DON'T** 生のSDKクライアント (SupabaseClientなど) をUI層に export しない。
*   **DON'T** UIコンポーネントを返さない。返すのは「データ」のみ。
