# Project Handbook: Development Standards & Workflow

## 1. Project Overview
**Project Name:** PreludioLab (プレリュディオラボ)  

### Mission
- The Prelude to a richer life with classical music. (クラシック音楽を通じて人生がより良くなるようなきっかけにしたい)
- **Beyond Listening.** Dive deeper into the classics. （「聴く」の先へ。クラシックの深淵を体験する。）

### Core Philosophy
- **ユーザーへの価値提供:** ユーザーにとっての価値を常に重視する。
- **グローバル対応:** 国や言語を問わず、誰でも楽しめること。
- **全レベル対応:** 初心者から熟練者まで楽しめるような内容にする。
- **マルチモーダル体験:** 文字だけでなく楽譜や音源、参考動画など、マルチモーダルなUIを提供する。
- **多角的なコンテンツ:** 楽曲紹介、音楽の仕組み、作曲家紹介、時代やジャンルの解説、演奏家紹介など多角的にコンテンツを提供する。

### Development Principles
1.  **Zero Cost Architecture:** ドメイン代以外の固定費を完全にゼロにする（Free Tier Only）。
2.  **Docs as Code:** 仕様、タスク、知見をすべてMarkdownでGit管理し、AIのコンテキストとして活用する。
3.  **Spec-Driven:** 仕様書を「唯一の正解」とし、実装と検証の基準とする。

---

## 2. Directory Structure
```text
preludio-lab/
├── .github/                 # CI/CD Workflows
│   └── workflows/
│       ├── agent-runner.yml     # AIエージェントを定期/手動実行するAction
│       └── nextjs-build.yml     # Vercelへのデプロイ（またはVercel連携で代用）
├── agents/                      # 【AI Brain】AIエージェント関連の独立領域
│   ├── src/
│   │   ├── prompts/             # Gemini 3.0へのシステムプロンプト集
│   │   │   ├── musicologist.ts  # 楽曲解説・ABC譜面生成プロンプト
│   │   │   └── translator.ts    # 多言語翻訳プロンプト
│   │   ├── tools/               # 外部ツール連携
│   │   │   └── youtube.ts       # YouTube Data API 検索スクリプト
│   │   └── index.ts             # エージェントのエントリーポイント
│   ├── package.json             # エージェント実行専用の依存管理
│   └── tsconfig.json
├── content/                 # 【Database】記事コンテンツ (MDX)
│   ├── en/                  # 英語
│   │   └── bach-prelude-1.mdx
│   ├── es/                  # スペイン語
│   └── ja/                  # 日本語
├── public/
│   └── search/                  # Pagefindが生成する検索インデックス
├── docs/                    # 【Context】プロジェクト知識ベース
│   ├── 01_specs/            # 仕様書 兼 テスト基準 (Requirements)
│   ├── 02_guidelines/       # 開発規約・ハンドブック (This file)
│   ├── 03_management/       # タスク管理
│   └── 04_adrs/             # 技術選定記録
├── src/                         # 【App】Next.js アプリケーション本体
│   ├── app/
│   │   ├── [lang]/              # 多言語ルーティング
│   │   │   ├── blog/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   └── page.tsx
│   │   ├── api/                 # 必要に応じた内部API
│   │   └── layout.tsx
│   ├── components/
│   │   ├── features/
│   │   │   ├── ScoreRenderer.tsx # react-abc/verovio ラッパー
│   │   │   └── AudioPlayer.tsx   # YouTube IFrame API制御
│   │   └── ui/                  # 共通UIコンポーネント
│   ├── lib/
│   │   ├── mdx/                 # MDX解析・取得ロジック
│   │   └── supabase/            # Authクライアント
│   └── middleware.ts            # 言語判定・リダイレクト処理
├── .env.local                   # ローカル開発用環境変数
├── next.config.mjs
├── package.json                 # フロントエンド用依存管理
└── README.md
```

## 3\. Specification & Verification Workflow

仕様と実装の乖離を防ぎ、最小限の工数で品質を担保するためのフロー。

### 3.1. Traceability (ID Anchor System)

仕様書 (`01_specs/*.md`) とタスク (`03_management/tasks.md`) を、ユニークなIDを用いて紐付ける。

  * **Requirements ID (`REQ-XXX`):**
    仕様書内の各機能要件にIDを付与する。ここには「完了条件（Acceptance Criteria）」を必ず併記する。

    ```markdown
    ### [REQ-SCORE-001] ABC Notation Rendering
    * **Criteria:**
        * [ ] Valid ABC text renders SVG without layout shift.
        * [ ] Invalid text shows error message.
    ```

  * **Task Reference:**
    タスク管理には必ず対応する仕様IDを記載する。

    ```markdown
    - [ ] Implement ScoreRenderer Component (Ref: `REQ-SCORE-001`)
    ```

### 3.2. Verification Process

開発およびAIエージェントによる実装は、以下の手順で検証を行う。

1.  **Define:** 実装前に `01_specs` に要件とCriteria（合格基準）を定義する。
2.  **Implement:** AIまたは人間がコードを実装する。
3.  **Verify (Pull Request):**
      * PRテンプレートを用いて、紐付く仕様ID (`REQ-XXX`) を明記する。
      * 仕様書に定義されたCriteriaに従って動作確認を行い、チェックを入れる。
      * 証拠（スクリーンショット等）を添付してマージする。

-----

## 4\. Technology Stack

本プロジェクトでは、以下の技術スタックと制約を厳守する。

| Category | Technology | Constraint / Policy |
| :--- | :--- | :--- |
| **Frontend** | Next.js (App Router) | TypeScript必須。Vercel Hobby Planで稼働。 |
| **Auth** | Supabase Auth | **SSO Only** (Passwordless). RLSを徹底。 |
| **Database** | None (Git/MDX) | コンテンツはGit管理。ユーザーデータのみSupabase。 |
| **AI Model** | Gemini 3.0 Pro | Google AI Studio API **Free Tier** 内で利用。 |
| **Agent Env** | GitHub Actions | 定期実行やDispatchでエージェントを起動。 |
| **Search** | Pagefind | 静的検索。サーバーレス。 |
| **Media** | react-abc / YouTube | 音源・画像のホスティングは外部に委譲。 |

-----

## 5\. Guidelines for AI Interaction

Antigravity IDE および Agent Script 開発時の指針。

  * **Context Awareness:** AIへの指示には必ず `docs/01_specs` の関連箇所を参照させること。
  * **Throttling:** APIコールを行うスクリプトには、必ずレートリミット（RPM）を考慮したWait処理を入れること。
  * **Safety:** AIエージェントによる `main` ブランチへの直コミットは禁止。必ずPull Requestを作成させる。

