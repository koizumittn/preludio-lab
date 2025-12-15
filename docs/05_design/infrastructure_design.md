# インフラ設計書 & 設定定義

## 概要 (Overview)
「Zero Cost Architecture」に基づき、各種SaaSの Free Tier（無料枠）を最大限活用する構成とします。
本ドキュメントは、実際の環境設定値と運用戦略を定義します。

## 1. 環境定義 (Environment Definitions)
アプリケーション、データベース、AIエージェントの各コンポーネントにおける環境分離戦略を定義します。

| 環境 (Environment) | アプリケーション (App) | データベース (DB) | AIエージェント (Agent Runner) | 用途・特徴 |
| :--- | :--- | :--- | :--- | :--- |
| **Development** | **Local PC**<br>`localhost:3000` | **Local Supabase (Docker)**<br>*完全分離 / オフライン* | **Local PC**<br>*手動実行* | 機能開発、単体テスト、エージェントの試運転。**本番データ破壊リスクなし**。 |
| **Staging** | **Vercel Preview**<br>`git-branch-url` | **Supabase (Prod)**<br>*直接接続 (要注意)* | **GitHub Actions**<br>*Pull Request Trigger* | ステージング相当。本番DBを参照するため、**書き込みテストは厳禁**。 |
| **Production** | **Vercel Production**<br>`preludiolab.com` | **Supabase (Prod)**<br>*本番データ* | **GitHub Actions**<br>*Schedule / API Trigger* | 本番稼働環境。エンドユーザー向け公開。 |

---

## 2. ホスティング (Vercel)
アプリケーション（Next.js）のホスティングには **Vercel** を使用します。

### プロジェクト設定
- **Platform:** Vercel (Hobby Plan)
- **Project Name:** `preludio-lab`
- **Region (Function):** `Washington, D.C., USA (iad1)`

### 環境変数 (Environment Variables)
- `NEXT_PUBLIC_SUPABASE_URL` / `ANON_KEY`
- `SUPABASE_DB_PASSWORD` (Prod Only)

### セキュリティ対策 (Security Measures)
- **DDoS Protection:** Vercel標準のDDoS緩和措置を利用。
- **HTTPS Enforcement:** 常時SSL/TLS化（HSTS自動適用）。
- **Environment Variables:** 機密情報はVercel Dashboardで暗号化保管し、コードには含めない。

---

### 環境戦略 (Environment Strategy)
| Environment | Next.js Runtime | Connected Database | Note |
| :--- | :--- | :--- | :--- |
| **Development** | Local | **Local Supabase (Docker)** | 安全。何を壊しても本番に影響なし。 |
| **Staging** | Vercel (Preview) | **Supabase (Cloud)** | 本番と同じDBを参照（※コストゼロでの妥協点。書込禁止） |
| **Production** | Vercel (Prod) | **Supabase (Cloud)** | 本番運用。 |

**リスク管理 (Seed Data Strategy):**
- **Master Data as Code:** 重要なマスタデータ（カテゴリ定義など）はDBのみに持たせず、コードベース（Seedファイル）で管理する。
- **Reconstruction:** 万が一DBが消失しても、Seed実行によりアプリが動作する最低限の状態へ復旧可能にする。

---

## 3. DNS (Cloudflare)
ドメイン管理およびDNSには **Cloudflare** を使用します。

### 設定
- **Production Domain:** `preludiolab.com`
- **DNS Records:** A/CNAME to `Vercel IP` (Proxy Status: `DNS Only`)

### セキュリティ対策 (Security Measures)
- **Account Security:** Cloudflareアカウントへの **2要素認証 (2FA)** を必須化。
- **DNSSEC:** ドメインレジストラ側でDNSSECを有効化し、DNSキャッシュポイズニングを防止（必要に応じて）。

---

## 4. CDN (Vercel Edge Network)
コンテンツ配信ネットワーク（CDN）には、ホスティングに付帯する **Vercel Edge Network** を利用します。

### 設定
- **Cache Policy:** 静的アセットおよびISRページのキャッシュ。

### セキュリティ対策 (Security Measures)
- **End-to-End Encryption:** クライアント⇔エッジ⇔オリジン間の全経路暗号化。
- **Security Headers:** Next.jsの設定により `X-Content-Type-Options`, `X-Frame-Options` 等を付与し、ブラウザベースの攻撃（XSS/Clickjacking）を軽減。

---

## 5. データベース (Supabase)

### 設定
- **Region:** `US East (N. Virginia)`
- **Auth Mode:** **SSO Only** (Email/Password Disabled)
- **Environment:** Single DB (Prod)

### セキュリティ対策 (Security Measures)
- **RLS (Row Level Security):** 全テーブルでRLSを有効化し、認証に基づいた厳格なアクセス制御を行う（**最重要**）。
- **Data API Security:** 不要なスキーマ公開を防ぐため、Public SchemaのみをExpose対象とする。
- **Backup Strategy (Free Tier Limitation):**
  - **Limitation:** Supabase Free Tierには、任意の時点に戻せるPITRや、UIからの簡単リストア機能は**含まれない**（運営への依頼が必要、日数もかかる）。
  - **Self-Managed Backup:**
      1.  **Seed Data:** 復旧可能なマスタデータはGit管理する。
      2.  **pg_dump:** (Option) GitHub Actions定期実行により、主要データをダンプして外部ストレージ（Artifacts等）に退避するフローを検討する。

---

## 6. デプロイメントパイプライン

### CI/CD Flow
1.  Push `feat/*` -> GitHub Actions (Test)
2.  PR -> Vercel Preview (Deploy)
3.  Merge `master` -> Vercel Production (Deploy *Disabled pre-launch*)
    -   *Note: ローンチ前は Vercel 設定 (`Settings > Git`) で Production への Auto-Deploy を無効化し、手動デプロイで運用します。*

### セキュリティ対策 (Security Measures)
- **Branch Protection:** `master` ブランチへの直接Pushを禁止し、必ずPRとCI通過を必須とする（GitHub設定）。
- **Secrets Scanning:** GitHubへの誤ったシークレット混入を防ぐため、ローカルで `git-secrets` 等の導入を推奨。
- **Least Privilege:** CI/CD用のアクセストークンは、必要最小限の権限（Repo Scope等）でのみ発行する。

---

## 7. 可観測性と監視 (Observability & Monitoring)
アプリケーションの健全性とエラーをプロアクティブに監視します（[REQ-TECH-STACK-012]準拠）。

### 監視ツールスタック
- **Access / Speed:** **Vercel Analytics** & **Speed Insights**
  - Web Vitals (LCP, CLS, INP) の継続的な計測。
  - リアルタイムのアクセス解析（Privacy-friendly）。
- **Error Tracking:** **Sentry** (Free Tier)
  - フロントエンドおよびAPIルートでの未処理例外（Exception）の捕捉。
  - リリースごとの不具合発生率の可視化。
- **Database Health:** **Supabase Dashboard**
  - CPU/RAM使用率、ディスク容量、スロークエリの監視。

---

## 8. クォータ管理と制限 (Quota & Cost Management) (Free Tier)
Hobby Plan (Free Tier) の制限内で運用するための管理指針です。

### Vercel (Hobby Plan)
- **Bandwidth:** 100GB / month
- **Serverless Function:** 10s timeout / 1,000,000 invocations
  - *対策:* 重い処理は Edge Functions または GitHub Actions (Agent) へオフロードする。

### Supabase (Free Tier)
- **Database Size:** 500MB
  - *対策:* 画像などのバイナリはDBに入れず、必ず Object Storage または外部ホスティング（YouTube等）を利用する。
- **Active Projects:** 2 projects maximum
  - *対策:* Prod/Devの2環境構成までとし、それ以上はDockerを利用する。
- **Pausing:** 1週間アクセスがないと一時停止される。
  - *対策:* 定期的なCronジョブまたはアクセスにより稼働を維持する。
