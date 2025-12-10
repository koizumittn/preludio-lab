# Project Technical Requirements Definition (v1.5)

**Status:** Draft (Free Tier Edition). 
**Date:** December 2025.  

## 1. Core Philosophy
* **Zero Cost Architecture:** ドメイン代以外の固定費を**完全にゼロ**にする。
* **Serverless & Stateless:** 常時稼働するサーバーや有料のマネージドサービス（Vertex AI Agent Builder等）は使用しない。
* **API Free Tier Strategy:** AIの頭脳には **Google AI Studio (Gemini API)** の無料枠を活用し、レートリミット（回数制限）内で稼働する設計とする。
* **Google Native:** Googleのエコシステム（Gemini, YouTube, Search）を最大活用する。

## 2. Technology Stack

| Requirement ID | Category | Technology | Selection Reason / Policy |
| :--- | :--- | :--- | :--- |
| **REQ-TECH-001** | **Frontend** | **Next.js 15 (App Router)** | パフォーマンス、SEO、Vercelとの親和性を重視。 |
| **REQ-TECH-002** | **Language** | **TypeScript** | 型安全性により、AIによるコード生成の精度と保守性を向上。 |
| **REQ-TECH-003** | **Hosting** | **Vercel** | Hobby Plan (Free)。サーバーレス、グローバルCDN。 |
| **REQ-TECH-004** | **Content Mgt** | **GitHub + MDX** | コンテンツのバージョン管理。**AIエージェントの作業場**として機能する。 |
| **REQ-TECH-005** | **User DB / Auth** | **Supabase** | **(Free Tier & SSO Only)** メール/パスワード認証は無効化。OAuth連携のみ使用。 |
| **REQ-TECH-006** | **Search** | **Pagefind** | 静的サイト内検索。サーバーレス・コストゼロ。 |
| **REQ-TECH-007** | **Media (Score)** | **react-abc / verovio** | テキスト（ABC記法）からSVG楽譜をクライアント描画。 |
| **REQ-TECH-008** | **Media (Audio)** | **YouTube IFrame API** | 外部プレーヤー制御。コストゼロで音源再生。 |
| **REQ-TECH-009** | **AI Model** | **Gemini 3.0** | **Google AI Studio API**経由で利用。無料枠（Free Tier）を使用。 |
| **REQ-TECH-010** | **Agent Runner** | **GitHub Actions** | **(Changed)** AIエージェントの実行環境。Cron定期実行や手動トリガーでスクリプトを起動し、コストゼロで計算リソースを確保。 |
| **REQ-TECH-011** | **i18n & Fonts** | **next-intl / Google Fonts** | 7言語対応。CJKフォントの最適化読み込み（subsetting）によりCLSを防ぐ。 |
| **REQ-TECH-012** | **Monitoring** | **Vercel Analytics / GSC** | MAU, 滞在時間, SEO順位の計測。Privacy-friendlyかつ無料枠で利用可能。 |
| **REQ-TECH-013** | **Originals** | **Bandcamp Embed** | オリジナル曲の配信。販売導線（Bandcamp）との統合が容易。 |

## 3. AI Agent Infrastructure (Free Tier Architecture)

有料のADK/Vertex基盤の代わりに、**「GitHub Actions上でTypeScriptスクリプト（AIエージェント）を走らせる」**方式を採用する。

### Execution Flow
1.  **Trigger:** プロデューサー（あなた）がGitHub Actionsを手動実行、またはスケジュール（Cron）で起動。
2.  **Process:** GitHubのサーバー上でスクリプトが実行され、Google AI Studio API (Gemini) を呼び出してコンテンツを生成。
3.  **[REQ-TECH-AGENT-001] Output:** 生成結果をMDXファイルとして保存し、`Pull Request` を自動作成する。



### Agent Implementation (Custom Scripts)
Google Generative AI SDK for Node.js を使用したカスタムスクリプト群として実装。

1.  **[REQ-TECH-AGENT-002] Orchestrator Script:** タスクの管理。Gemini APIのレートリミット（RPM/TPM）を超えないようにリクエスト間隔を制御する「スロットリング機能」を実装。
2.  **[REQ-TECH-AGENT-003] Musicologist Script:**
    *   楽曲解説生成 / ABC記法による楽譜生成
    *   YouTube Data API (Free Quota) を用いた動画検索
3.  **[REQ-TECH-AGENT-004] Translator Script:** (Ref: [REQ-GOAL-003-03])
    *   **Trigger:** `Musicologist` による記事生成PRのマージ（またはドラフト完成）。
    *   **Process:** マスター記事（JA）を読み込み、他6言語（EN/ES/DE/ZH/FR/IT）へ並列翻訳を実行。
    *   **Output:** 各言語ディレクトリにMDXを生成し、一括でPRを作成。人間によるレビューは行わない。
4.  **[REQ-TECH-AGENT-005] Coder Script:** コンポーネント修正、Lint修正など。

## 4. Content & Media Strategy

### Score Strategy (Text-to-Image)
* **[REQ-TECH-STRAT-001] Method:** Geminiに「ABC記法」を作成させ、MDXに埋め込む。
* **[REQ-TECH-STRAT-002] Rendering:** クライアントサイドでSVG変換。版面権の問題をクリア。

### Audio Strategy (YouTube Embed)
* **[REQ-TECH-STRAT-003] Method:** 公式チャンネルの動画IDと開始時間を指定。
* **[REQ-TECH-STRAT-004] Ad Policy:** 広告リスクを許容し、UI（スキップボタン等）でUXを緩和。
* **[REQ-TECH-STRAT-005] Compliance:** YouTube利用規約に準拠。

### Originals Strategy (Portfolio)
* **[REQ-TECH-STRAT-006] Method:** Bandcamp埋め込み、またはSoundCloud埋め込みを利用。
* **[REQ-TECH-STRAT-007] Hosting:** 音源ファイル自体は外部プラットフォームにホストし、サイト負荷を回避する。

## 5. Security Architecture

### [REQ-SEC-001] Layer 1: AI Safety & Cost Control
* **[REQ-SEC-001-01] Rate Limiting:** 無料枠の制限を超えないよう、スクリプト側でWait処理を入れる。
* **[REQ-SEC-001-02] Human Verification:** AIは必ず `Pull Request` を作成する。`master` ブランチへの直コミットは禁止。

### [REQ-SEC-002] Layer 2: App Security (Supabase)
* **[REQ-SEC-002-01] SSO Only:** パスワードを持たない。
* **[REQ-SEC-002-02] RLS:** Row Level Securityでデータアクセスを厳格化。

### [REQ-SEC-003] Layer 3: Infra Security
*   **[REQ-SEC-003-01] Secrets Management:** Gemini API Key、Supabase Key等の機密情報は **GitHub Secrets** および **Vercel Environment Variables** にのみ保存。コード内には一切含めない。
*   **[REQ-SEC-003-02] Dependabot:** 依存関係の脆弱性を監視。

## 6. DevOps & QA Architecture

### CI/CD Pipeline (GitHub Actions & Vercel)
開発プロセスと品質担保の自動化。

*   **Workflow A: Pull Request Checks (GitHub Actions)**
    *   `main` へのPR作成時に発火。
    *   **Lint:** ESLint / Prettier
    *   **Type Check:** TypeScript (`tsc --noEmit`)
    *   **Unit Test:** Vitest (Logic / Utils)
*   **Workflow B: Agent Runner (GitHub Actions)**
    *   Schedule / Manual Trigger で発火。
    *   AIエージェントを実行し、コンテンツ生成PRを作成。
*   **Workflow C: Deployment (Vercel)**
    *   `main` へのマージ時に発火。
    *   Production環境へ自動デプロイ。

### Testing Strategy
*   **Unit Testing:** `Vitest` を使用。
    *   ユーティリティ関数（ロジック）、ABC記法パーサー等のテスト。
*   **Integration Testing:** `React Testing Library` (Optional)。
    *   複雑なコンポーネントの挙動確認。
*   **E2E Testing:** `Playwright` (Phase 4以降)。
    *   重要導線（記事閲覧、検索、ログイン）の回帰テスト。