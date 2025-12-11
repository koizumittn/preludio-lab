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
| **REQ-TECH-STACK-001** | **Frontend** | **Next.js 15 (App Router)** | パフォーマンス、SEO、Vercelとの親和性を重視。 |
| **REQ-TECH-STACK-002** | **Language** | **TypeScript** | 型安全性により、AIによるコード生成の精度と保守性を向上。 |
| **REQ-TECH-STACK-003** | **Hosting** | **Vercel** | Hobby Plan (Free)。サーバーレス、グローバルCDN。 |
| **REQ-TECH-STACK-004** | **Content Mgt** | **GitHub + MDX** | コンテンツのバージョン管理。**AIエージェントの作業場**として機能する。 |
| **REQ-TECH-STACK-005** | **User DB / Auth** | **Supabase** | **(Free Tier & SSO Only)** メール/パスワード認証は無効化。OAuth連携のみ使用。 |
| **REQ-TECH-STACK-006** | **Search** | **Pagefind** | 静的サイト内検索。サーバーレス・コストゼロ。 |
| **REQ-TECH-STACK-007** | **Media (Score)** | **react-abc / verovio** | テキスト（ABC記法）からSVG楽譜をクライアント描画。 |
| **REQ-TECH-STACK-008** | **Media (Audio)** | **YouTube IFrame API** | 外部プレーヤー制御。コストゼロで音源再生。 |
| **REQ-TECH-STACK-009** | **AI Model** | **Gemini 3.0** | **Google AI Studio API**経由で利用。無料枠（Free Tier）を使用。 |
| **REQ-TECH-STACK-010** | **Agent Runner** | **GitHub Actions** | **(Changed)** AIエージェントの実行環境。Cron定期実行や手動トリガーでスクリプトを起動し、コストゼロで計算リソースを確保。 |
| **REQ-TECH-STACK-011** | **i18n & Fonts** | **next-intl / Google Fonts** | 7言語対応。CJKフォントの最適化読み込み（subsetting）によりCLSを防ぐ。 |
| **REQ-TECH-STACK-012** | **Monitoring** | **Vercel Analytics / GSC** | MAU, 滞在時間, SEO順位の計測。Privacy-friendlyかつ無料枠で利用可能。 |
| **REQ-TECH-STACK-013** | **Originals** | **Bandcamp Embed** | オリジナル曲の配信。販売導線（Bandcamp）との統合が容易。 |
| **REQ-TECH-STACK-014** | **Privacy** | **Cookie Consent** | GDPR準拠。YouTube等のThird-party Cookie読み込みを制御する同意バナー。 |

## 3. AI Agent Infrastructure (Free Tier Architecture)

有料のADK/Vertex基盤の代わりに、**「GitHub Actions上でTypeScriptスクリプト（AIエージェント）を走らせる」**方式を採用する。

### Execution Flow
1.  **[REQ-TECH-AGENT-FLOW-001] Trigger:** プロデューサー（あなた）がGitHub Actionsを手動実行、またはスケジュール（Cron）で起動。
2.  **[REQ-TECH-AGENT-FLOW-002] Process:** GitHubのサーバー上でスクリプトが実行され、Google AI Studio API (Gemini) を呼び出してコンテンツを生成。
3.  **[REQ-TECH-AGENT-FLOW-003] Output:** 生成結果をMDXファイルとして保存し、`Pull Request` を自動作成する。



### Agent Implementation (Custom Scripts)
Google Generative AI SDK for Node.js を使用したカスタムスクリプト群として実装。

1.  **[REQ-TECH-AGENT-002] Orchestrator Script:** タスクの管理。Gemini APIのレートリミット（RPM/TPM）を超えないようにリクエスト間隔を制御する「スロットリング機能」を実装。
2.  **[REQ-TECH-AGENT-003] Musicologist Script:**
    *   楽曲解説生成
    *   ABC記法による楽譜生成
    *   YouTube Data API (Free Quota) を用いた動画検索
3.  **[REQ-TECH-AGENT-004] Translator Script:** (Ref: [REQ-GOAL-003-03])
    *   **Trigger:** `Musicologist` による記事生成PRのマージ（またはドラフト完成）。
    *   **Process:** マスター記事（JA）を読み込み、他6言語（EN/ES/DE/ZH/FR/IT）へ並列翻訳を実行。
    *   **Output:** 各言語ディレクトリにMDXを生成し、一括でPRを作成。人間によるレビューは行わない。
4.  **[REQ-TECH-AGENT-005] Coder Script:** コンポーネント修正、Lint修正など。

## 4. Content & Media Strategy

### Score Strategy (Text-to-Image)
* **[REQ-TECH-STRAT-001] Method:** AIモデルに「ABC記法」を作成させ、MDXに埋め込む。
* **[REQ-TECH-STRAT-002] Rendering:** **レスポンシブ（譜面の折り返し）実現のため**、原則クライアントサイドで描画する。ただし、レンダリング負荷が高い場合はビルド時生成（SSG）とのハイブリッド構成を検討する。

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

### [REQ-SEC-002] Layer 2: App Security (General & OWASP Top 10)
アプリケーション全体、特にSupabase利用時におけるセキュリティリスクへの対策。
* **[REQ-SEC-002-01] Broken Access Control (OWASP #1):**
    *   Supabase RLS (Row Level Security) を全テーブルに適用し、「自分のデータのみ読み書き可能」を強制する。
    *   **Reason:** SupabaseはクライアントからDBへ直接アクセスするアーキテクチャであるため、RLSが唯一のファイアウォールとなる（適用しないと全データが公開状態になるリスクがある）。
    *   管理者機能へのアクセスはRBAC (Role-Based Access Control) で厳格に制御する。
* **[REQ-SEC-002-02] Injection (OWASP #3):**
    *   SQL Injection対策: すべてのDB操作はSupabase JS Client（ORMライク）経由で行い、生のSQLは原則禁止とする。
    *   XSS (Cross Site Scripting)対策: React/Next.jsの標準エスケープとContent Security Policy (CSP) を活用する。
* **[REQ-SEC-002-03] Authentication Failures:**
    *   メール/パスワード認証を無効化し、ソーシャルログイン（OAuth）のみを許可することで、パスワード漏洩リスクをゼロにする。

### [REQ-SEC-003] Layer 3: Infra Security & Continuity
攻撃やコスト爆発からサービスを守り、持続可能性を担保する。
*   **[REQ-SEC-003-01] Anti-DDoS:** Vercel Firewall (Automatic Mitigation) および Cloudflare (DNS) の標準機能を活用し、異常なトラフィックスパイクを防御する。
*   **[REQ-SEC-003-02] Cost Explosion Prevention:**
    *   **API Quota:** Gemini APIのリクエスト数をエージェント側で厳格にカウントし、無料枠（Free Tier）の上限に近づいたら処理を停止するCircuit Breakerを実装する。
    *   **Spend Limits:** Vercel / Supabase などの有料課金が発生しうるサービスにおいて、Spend Cap（課金上限）またはアラートを設定する。
*   **[REQ-SEC-003-03] Secrets Management:** Gemini API Key、Supabase Key等の機密情報は **GitHub Secrets** および **Vercel Environment Variables** にのみ保存。コード内には一切含めない。
*   **[REQ-SEC-003-04] Dependabot:** 依存関係の脆弱性を監視。

## 6. DevOps & QA Architecture

### [REQ-DEVOPS-ENV] Environment Definitions
3層のランドスケープ定義により、品質担保と本番安定性を両立する。

| Env ID | Environment | Infrastructure | Access URL | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **REQ-DEVOPS-ENV-001** | **Development** | **Local PC** | `localhost:3000` | 機能開発、単体テスト、AIエージェントの試運転。 |
| **REQ-DEVOPS-ENV-002** | **Verification** | **Vercel Preview** | `*.vercel.app` | **Staging環境。** PR作成時に自動デプロイ。E2Eテスト、UI確認、Lighthouse計測を行う。 |
| **REQ-DEVOPS-ENV-003** | **Production** | **Vercel Production** | `preludiolab.com` | **本番環境。** `master` ブランチと同期。エンドユーザー向け公開。 |

### [REQ-DEVOPS-FLOW] CI/CD Pipeline & Branch Strategy
GitHub Flowをベースに、Verification環境（Preview Deploy）を組み込んだワークフロー。

*   **[REQ-DEVOPS-FLOW-001] Branch Strategy:**
    *   `master`: 本番用ブランチ（常にProductionと同期）。直接コミット禁止。
    *   `feat/*`, `fix/*`: 作業用ブランチ。`master` から派生し、PRを経て `master` へマージ。
*   **[REQ-DEVOPS-FLOW-002] Workflow A: Pull Request (Verification):**
    *   **Trigger:** `master` へのPR作成/更新。
    *   **CI:** Build check, Lint (ESLint), Format (Prettier), Type check (tsc), Unit Test (Vitest) を実行。
    *   **CD (Preview):** Vercel Preview Deployment を自動作成し、Verification環境のURLをPRにコメント通知。
*   **[REQ-DEVOPS-FLOW-003] Workflow B: Production Release:**
    *   **Trigger:** `master` へのマージ (Push)。
    *   **CD (Production):** Vercel Production Deployment を実行し、本番環境 (`preludiolab.com`) を更新。
*   **[REQ-DEVOPS-FLOW-004] Workflow C: Agent Runner:**
    *   **Trigger:** Schedule / Manual Trigger.
    *   **Action:** AIエージェントを実行し、コンテンツ生成PRを作成 (Workflow Aへ接続)。

### [REQ-DEVOPS-RELEASE] Versioning & Rollback Strategy
迅速なロールバックと効果測定を可能にするリリース管理フロー。

*   **[REQ-DEVOPS-RELEASE-001] Semantic Versioning:** アプリケーションコードの改修時（機能追加・バグ修正）にのみ `vX.Y.Z` タグを付与する。単なる記事コンテンツの追加時はバージョン更新を行わない。
*   **[REQ-DEVOPS-RELEASE-002] GitHub Releases:** タグ付与をトリガーに Release Note を自動生成し、含まれる変更点（PRリンク）と当時のKPI期待値を記録する。
*   **[REQ-DEVOPS-RELEASE-003] Instant Rollback:** 万が一の障害時は、`git revert` ではなく **Vercel Instant Rollback** 機能を使用し、1秒で正常な前バージョンへ切り戻す。
    *   ロールバック後、改めて `hotfix` ブランチで修正を行い、バージョンを上げて再デプロイする。
*   **[REQ-DEVOPS-RELEASE-004] Performance Baseline:** 各リリース（Deployment）に対し、Vercel Analytics の "Deployment Score" (Web Vitals) を記録し、バージョン間の性能劣化を監視する。

### [REQ-DEVOPS-TEST] Testing Strategy
*   **[REQ-DEVOPS-TEST-001] Unit Testing:** `Vitest` を使用。ユーティリティ関数、ABCパーサー等のロジック検証。
*   **[REQ-DEVOPS-TEST-002] Integration Testing:** `React Testing Library` (Optional)。複雑なコンポーネントの挙動確認。
*   **[REQ-DEVOPS-TEST-003] E2E Testing:** `Playwright` (Phase 4以降)。重要導線（閲覧、検索、ログイン）の回帰テストをVerification環境に対して実行。

## 7. Non-Functional Requirements (SaaS Native)
SaaSの標準機能を最大限活用し、追加開発コストをかけずに非機能要件を担保する。

### [REQ-NFR-001] Availability & Scalability
*   **[REQ-NFR-001-01] Uptime:** VercelおよびSupabaseのSLA/SLOに準拠する（目標稼働率 99.9%）。
*   **[REQ-NFR-001-02] Auto Scaling:** スパイクアクセス時はVercel Functionsの自動スケーリングにより処理する。サーバーのプロビジョニングは行わない。

### [REQ-NFR-002] Performance
*   **[REQ-NFR-002-01] Core Web Vitals:** Googleの提唱する指標（LCP, CLS, INP）において、モバイル/デスクトップ共に "Good" (緑) スコアを維持する。
*   **[REQ-NFR-002-02] Edge Caching:** 静的コンテンツ（MDX生成されたHTML、画像、楽譜SVG）はVercel Edge Networkでキャッシュし、オリジン到達を最小化する。
*   **[REQ-NFR-002-03] User Perceived Latency:**
    *   **Page Transition:** ページ遷移ごとの反応速度を 200ms 以内とする（SPA/Soft Navigationの利点を活かす）。
    *   **Score Rendering:** クライアントサイドでの楽譜描画完了時間を **1.5秒以内 (Mobile)** に抑え、待機中はSkeleton UIを表示して離脱を防ぐ。

### [REQ-NFR-003] Data Integrity & Backup
*   **[REQ-NFR-003-01] Content as Code:** 記事、画像のマスターデータは全てGitHubリポジトリで管理し、**「Gitが唯一の正解（Source of Truth）」**となる状態を維持する。これにより、DB障害時の復旧（Disaster Recovery）をgit cloneのみで可能にする。
*   **[REQ-NFR-003-02] User Data (Best Effort):** Supabase Free Tierの標準バックアップ機能（Daily）に依存する。ユーザーデータ（お気に入り等）は「消失してもサービス提供自体は継続可能」な区分とし、過剰な冗長化コストをかけない。

### [REQ-NFR-004] Fault Tolerance
*   **[REQ-NFR-004-01] Graceful Degradation:** 外部API（YouTube, Gemini）の障害時は、エラーページではなく「代替表示（リンク表示やキャッシュ済みデータ）」を行い、サイト全体の停止を防ぐ。

### [REQ-NFR-005] Volume & Limits
想定されるデータ量とアクセス規模に対し、性能劣化を起こさない設計とする。
*   **[REQ-NFR-005-01] Traffic Volume:** ビジネス要件 [REQ-GOAL-001-01] にある **100万人/月 (MAU)** のアクセスに耐えうるアーキテクチャとする（Vercel CDN / Serverless Functionsの自動スケールにより担保）。
*   **[REQ-NFR-005-02] Content Volume:** 記事数が **1,000件** を超えても、以下の性能を維持する。
    *   **Search:** Pagefind インデックス分割により、検索応答速度を一定（100ms以下）に保つ。
    *   **Build:** 増分ビルド（Incremental Static Regeneration）または分割ビルドを活用し、デプロイ時間を15分以内に抑える。
    *   **Navigation:** 記事数増加によるルーティング解決の遅延を発生させない（Dynamic Routes + ISR）。