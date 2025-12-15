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
- **Framework:** Next.js (App Router)
- **Region (Function):** `Washington, D.C., USA (iad1)` (デフォルト)
  - *理由: DB (US East) とのレイテンシを最小化するため。*

### 環境変数 (Environment Variables)
| Key | Description | Environment |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anonymous Key (Publishable) | Production, Preview, Development |
| `SUPABASE_DB_PASSWORD` | Database Password (管理者/CI用) | (Optional) Production |

---

## 3. DNS (Cloudflare)
ドメイン管理およびDNSには **Cloudflare** を使用します。

### ドメイン設定
- **Production:** `preludiolab.com` (Primary), `www.preludiolab.com`
- **Registrar:** (取得元)
- **Name Servers:** Cloudflare Nameservers

### DNSレコード設定
Vercelとの接続には以下のレコードを使用します。

- **A Record:**
  - Name: `@`
  - Content: `76.76.21.21` (Vercel IP)
  - Proxy Status: `DNS Only` (推奨)
- **CNAME Record** (or A Record for www):
  - Name: `www`
  - Content: `76.76.21.21` (Vercel IP)
  - Proxy Status: `DNS Only` (推奨)

*Note: Proxy Statusを `Proxied` (Orange Cloud) にする場合は、Cloudflare側でのSSL設定(Full/Strict)に注意が必要ですが、現在は `DNS Only` でVercelに証明書管理を任せる構成とします。*

---

## 4. CDN (Vercel Edge Network)
コンテンツ配信ネットワーク（CDN）には、ホスティングに付帯する **Vercel Edge Network** を利用します。

- **静的アセット:** 画像、フォント、ビルド済みのJS/CSSは自動的にエッジキャッシュされます。
- **ISR (Incremental Static Regeneration):** 生成されたHTMLページもエッジでキャッシュされ、高速に配信されます。
- **Cache-Control:** Next.js の仕様に従い、適切なヘッダーが自動付与されます。

---

## 5. データベース (Supabase)

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

## 6. デプロイメントパイプライン

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

## 8. セキュリティとバックアップ (Security & Backup)

### データセキュリティ (Supabase)
- **RLS (Row Level Security):**
  - **原則:** すべてのテーブルに対して RLS を有効化 (`ENABLE ROW LEVEL SECURITY`) する。
  - **ポリシー:** 認証済みユーザー、または特定の条件下（公開データ等）でのみ読み書きを許可するポリシーを厳格に適用する。
- **Backup Strategy:**
  - **Automated Backup:** Supabase Free Tier 標準の **日次バックアップ** を利用（保持期間: 7日間）。
  - **Disaster Recovery:** 重大なデータ損失時は、Supabaseサポートへの連絡またはPITR（Pro Plan以上）が必要となる点を留意する。

### ネットワークセキュリティ
- **Cloudflare / Vercel:** 標準のWAFおよびDDoS保護を利用。
- **SSL/TLS:** Vercelによる自動証明書発行とHTTPS強制により、通信経路を暗号化。

---

## 9. クォータ管理と制限 (Quota & Cost Management)
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
