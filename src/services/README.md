# Services Directory Guidelines (Infrastructure Layer)

このディレクトリは **Repository Pattern (リポジトリパターン)** の実装場所です。
外部システム（API, DB, ファイルシステム）との全ての通信を担当します。

## ディレクトリ構造
*   `auth/`: Supabase Auth のラッパー。
*   `content/`: MDX の読み込み・パース処理。
*   `gemini/`: Google AI Studio API との通信。
*   `youtube/`: YouTube Data API との通信。

## ルール (DOs)
*   **DO** 実装詳細を隠蔽（抽象化）する。（例: `fs.readFileSync()` を直接呼ばず、`getPost()` という関数にする）。
*   **DO** エラーハンドリングを行い、`src/types/` で定義された型付きの結果を返す。

## 禁止事項 (DON'Ts)
*   **DON'T** 生のSDKクライアント (SupabaseClientなど) をUI層に export しない。
*   **DON'T** UIコンポーネントを返さない。返すのは「データ」のみ。
