# Infrastructure Design & Configuration

## Overview
Based on "Zero Cost Architecture", we utilize Vercel and Supabase Free Tier.
This document defines the actual configuration values and operational strategies.

## 1. Hosting (Vercel)

### Project Settings
- **Project Name:** `preludio-lab`
- **Framework:** Next.js
- **Region (Function):** `Washington, D.C., USA (iad1)` (Default)
  - *Reason: To minimize latency with Supabase (US East).*

### Domains
- **Production:** `preludiolab.com` (Primary), `www.preludiolab.com`
- **DNS (Cloudflare):**
  - A Record: `76.76.21.21` (Vercel)
  - Proxy Status: `DNS Only` (Recommended for SSL handling by Vercel)

### Environment Variables
| Key | Description | Environment |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anonymous Key (Publishable) | Production, Preview, Development |
| `SUPABASE_DB_PASSWORD` | Database Password (for Admin/CI) | (Optional) Production |

---

## 2. Database (Supabase)

### Project Settings
- **Project Name:** `preludio-lab`
- **Region:** `US East (N. Virginia)`
  - *Reason: Best connectivity with Vercel IAD1 and global hub.*
- **Pricing Plan:** Free Tier

### Authentication Strategy
- **Mode:** **SSO Only** (OAuth)
- **Providers:**
  - Email: **Disabled** (Security Risk Mitigation)
  - Phone: **Disabled**
  - Social: Google / GitHub (Optional)
- **Settings:**
  - `Data API`: Enabled (Public Schema)

### Environment Strategy (Single DB)
Currently, we operate with a **Single Database Strategy** for all environments.

| Environment | Next.js Runtime | Connected Database | Note |
| :--- | :--- | :--- | :--- |
| **Production** | Vercel (Prod) | `preludio-lab` (Prod) | **Live Data** |
| **Preview** | Vercel (Preview) | `preludio-lab` (Prod) | *Careful with write operations* |
| **Development** | Local (localhost) | `preludio-lab` (Prod) | *Careful with write operations* |

**Risk Management:**
- Since `Production` DB is shared, **destructive actions (DROP, DELETE) must be performed with extreme caution**.
- For future expansion:
  - Phase 2+: Considered creating `preludio-lab-dev` project for staging (Free Tier allows 2 active projects).
  - Use Docker locally if offline development is strictly required.

---

## 3. Deployment Pipeline

### CI/CD (GitHub Actions & Vercel)
1.  **Push to `feat/*`**:
    -   GitHub Actions: Lint, TypeCheck, Unit Test.
2.  **Pull Request**:
    -   Vercel: Deploys to **Preview Environment**.
3.  **Merge to `master`**:
    -   Vercel: Deploys to **Production Environment**.

### Secrets Management
- **Supabase Credentials:**
  - `anon` key is public (safe for browser).
  - `service_role` key and `DB Password` are **Secrets**.
  - **Storage:** 1Password (Master) + Vercel Env Vars. **Never in Git.**
