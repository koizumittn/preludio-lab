# インフラ設計書 & 設定定義

## 概要 (Overview)
「Zero Cost Architecture」に基づき、Vercel と Supabase の Free Tier を活用します。
本ドキュメントは、実際の環境設定値と運用戦略を定義します。

## 1. ホスティング (Vercel)

### プロジェクト設定
- **Project Name:** `preludio-lab`
- **Framework:** Next.js
- **Region (Function):** `Washington, D.C., USA (iad1)` (デフォルト)
  - *理由: Supabase (US East) とのレイテンシを最小化するため。*

### ドメイン設定
- **Production:** `preludiolab.com` (Primary), `www.preludiolab.com`
- **DNS (Cloudflare):**
  - A Record: `76.76.21.21` (Vercel)
  - Proxy Status: `DNS Only` (Vercel側でのSSL管理を推奨)

### 環境変数 (Environment Variables)
| Key | Description | Environment |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anonymous Key (Publishable) | Production, Preview, Development |
| `SUPABASE_DB_PASSWORD` | Database Password (管理者/CI用) | (Optional) Production |

---

## 2. データベース (Supabase)

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

| Environment | Next.js Runtime | Connected Database | Note |
| :--- | :--- | :--- | :--- |
| **Production** | Vercel (Prod) | `preludio-lab` (Prod) | **本番データ (Live Data)** |
| **Preview** | Vercel (Preview) | `preludio-lab` (Prod) | *書き込み操作に注意すること* |
| **Development** | Local (localhost) | `preludio-lab` (Prod) | *書き込み操作に注意すること* |

**リスク管理:**
- `Production` DB を共有しているため、**破壊的な操作 (DROP, DELETE) は極めて慎重に行う必要があります**。
- 将来的な拡張について:
  - Phase 2以降: `preludio-lab-dev` プロジェクトを作成し、Staging環境として分離することを検討します（Free Tierはアクティブプロジェクト2つまで可能）。
  - オフライン開発が必須となる場合は、ローカルで Docker を使用します。

---

## 3. デプロイメントパイプライン

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
