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

## 2. ホスティング (Application)

### プロジェクト設定
- **Project Name:** `preludio-lab`
- **Framework:** Next.js
- **Region (Function):** `Washington, D.C., USA (iad1)` (デフォルト)
  - *理由: DB (US East) とのレイテンシを最小化するため。*

### ドメイン設定
- **Production:** `preludiolab.com` (Primary), `www.preludiolab.com`
- **DNS (Cloudflare):**
  - A Record: `VercelのIPアドレス` (公式ドキュメント参照)
  - Proxy Status: `DNS Only` (Vercel側でのSSL管理を推奨)

### 環境変数 (Environment Variables)
| Key | Description | Environment |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anonymous Key (Publishable) | Production, Preview, Development |
| `SUPABASE_DB_PASSWORD` | Database Password (管理者/CI用) | (Optional) Production |

---

## 3. データベース (Database)

### プロジェクト設定
- **Project Name:** `preludio-lab`
- **Region:** `US East (N. Virginia)`
  - *理由: Vercel IAD1 との接続性が最良であり、グローバルハブとしても最適。*
- **Pricing Plan:** Free Tier

### 認証戦略 (Authentication Strategy)
- **Mode:** **SSO Only** (OAuth)
- **Providers:**
  - Email: **Disabled** (無効 - セキュリティリスク低減のため)
  - Phone: **Disabled** (無効)
  - Social: Google / GitHub (任意 - Optional)
- **Settings:**
  - `Data API`: Enabled (Public Schema)

### 環境戦略 (Single DB Strategy)
現在、全環境で **単一のデータベース (Single Database)** を使用して運用しています。

**リスク管理:**
- `Production` DB を共有しているため、**破壊的な操作 (DROP, DELETE) は極めて慎重に行う必要があります**。
- 将来的な拡張について:
  - Phase 2以降: `preludio-lab-dev` プロジェクトを作成し、Staging環境として分離することを検討します（Free Tierはアクティブプロジェクト2つまで可能）。
  - オフライン開発が必須となる場合は、ローカルで Docker を使用します。

---

## 4. デプロイメントパイプライン

### CI/CD (GitHub Actions & Vercel)
1.  **Push to `feat/*`**:
    -   GitHub Actions: Lint, TypeCheck, Unit Test を実行。
2.  **Pull Request**:
    -   Vercel: **Preview Environment** へ自動デプロイ。
3.  **Merge to `master`**:
    -   Vercel: **Production Environment** へ自動デプロイ。

### シークレット管理 (Secrets Management)
- **Supabase Credentials:**
  - `anon` key は公開情報です（ブラウザで使用しても安全）。
  - `service_role` key および `DB Password` は **機密情報 (Secrets)** です。
  - **保管場所:** 1Password (マスター) + Vercel Env Vars。**Gitには絶対にコミットしません。**
