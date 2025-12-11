# App Directory Guidelines (UI Layer - Controller)

このディレクトリは MVC における **Controller** に相当します。
ルーティング、データフェッチ、およびレイアウト構築を責務とします。

## 責務 (Responsibilities)
*   **Routing:** Next.js App Router の規約に従ってURL構造を定義する。
*   **Data Fetching:** Server Components 内で `src/services/` からデータを取得する。
*   **Layout:** 共通のUI構造 (`layout.tsx`) を定義する。
*   **Metadata:** SEOメタデータ (`generateMetadata`) を定義する。

## ルール (DOs)
*   **DO** 原則として Server Components を使用する。
*   **DO** データの取得には必ず `src/services/` 配下の関数を使用する。
*   **DO** 取得したデータは Props として `src/components/` に渡す。

## 禁止事項 (DON'Ts)
*   **DON'T** 複雑なビジネスロジックをここに書かない。`src/services/` または `src/lib/` に移動する。
*   **DON'T** 外部API (fetch) を直接呼ばない。`src/services/` を経由する。
*   **DON'T** DBクライアント (Supabase) を直接インポートしない。`src/services/` を経由する。
