# インフラ設計書 & 設定定義

## 概要 (Overview)
「Zero Cost Architecture」に基づき、各種SaaSの Free Tier（無料枠）を最大限活用する構成とします。
本ドキュメントは、実際の環境設定値と運用戦略を定義します。

## 1. 環境定義 (Environment Definitions)
アプリケーション、データベース、AIエージェントの各コンポーネントにおける環境分離戦略を定義します。

| 環境 (Environment) | アプリケーション (App) | データベース (DB) | AIエージェント (Agent Runner) | 用途・特徴 |
| :--- | :--- | :--- | :--- | :--- |
| **Development** | **Local PC**<br>`localhost:3000` | **Supabase (Prod)**<br>*直接接続* | **Local PC**<br>*手動実行* | 機能開発、単体テスト、エージェントの試運転。 |
| **Staging** | **Vercel Preview**<br>`git-branch-url` | **Supabase (Prod)**<br>*直接接続* | **GitHub Actions**<br>*Pull Request Trigger* | ステージング相当。自動デプロイによる動作確認、E2Eテスト。 |
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
- **Backup:** 日次バックアップ（7世代保持）の自動実行を確認。
- **Data API Security:** 不要なスキーマ公開を防ぐため、Public SchemaのみをExpose対象とする。

---

## 6. デプロイメントパイプライン

### CI/CD Flow
1.  Push `feat/*` -> GitHub Actions (Test)
2.  PR -> Vercel Preview (Deploy)
3.  Merge `master` -> Vercel Production (Deploy *Disabled pre-launch*)

### セキュリティ対策 (Security Measures)
- **Branch Protection:** `master` ブランチへの直接Pushを禁止し、必ずPRとCI通過を必須とする（GitHub設定）。
- **Secrets Scanning:** GitHubへの誤ったシークレット混入を防ぐため、ローカルで `git-secrets` 等の導入を推奨。
- **Least Privilege:** CI/CD用のアクセストークンは、必要最小限の権限（Repo Scope等）でのみ発行する。

---

## 7. 可観測性と監視 (Observability & Monitoring)
- **Speed:** Vercel Analytics / Speed Insights
- **Error:** Sentry (Free Tier)
- **DB Health:** Supabase Dashboard

---

## 8. クォータ管理と制限 (Quota & Cost Management) (Free Tier)
- **Vercel:** 100GB Bandwidth, 10s Function Timeout
- **Supabase:** 500MB DB Size, 2 Active Projects
