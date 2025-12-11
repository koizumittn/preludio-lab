# PreludioLab タスクリスト

Status: `[/]` 進行中

## Phase 0: 要件定義・設計 (Requirements & Design)
- [x] **要件定義の精緻化**
    - [x] `01_specs/business-requirements.md` をブラッシュアップし、要件ID (`REQ-BIZ-XXX`) を付与
    - [x] `01_specs/technology-requirements.md` をブラッシュアップし、要件ID (`REQ-TECH-XXX`) を付与
    - [x] `01_specs/ui-ux-requirements.md` をブラッシュアップし、要件ID (`REQ-UI-XXX`) を付与
    - [x] `01_specs/content-requirements.md` をブラッシュアップし、要件ID (`REQ-CONT-XXX`) を付与
    - [x] 各要件に対する「完了条件（Acceptance Criteria）」の記述
- [x] **基本設計**
    - [x] **ルーティング設計:** `app/[lang]/` 配下のURL構造とページ遷移の定義
    - [x] **コンテンツデータ設計:** MDX Frontmatterのスキーマ定義 (Title, Composer, Difficulty, Tags...)
    - [x] **コンポーネント設計:** UIパーツ（Atoms/Molecules）と機能コンポーネント（Organisms）のリストアップ
    - [x] **エージェント設計:** AIエージェント（Musicologist, Translator）の出力フォーマットとインターフェース定義

## Phase 0.5: 環境構築 (Environment Setup)
- [x] **ガイドライン策定**
    - [x] `docs/02_guidelines/naming-conventions.md` (命名規則)
    - [x] `docs/02_guidelines/score-notation-guidelines.md` (楽譜表記)
    - [x] `docs/02_guidelines/localization-guidelines.md` (翻訳・ローカライズ)
    - [x] `docs/02_guidelines/prompt-engineering-standard.md` (AIプロンプト)
    - [x] `docs/02_guidelines/development-guidelines.md` (開発)
    - [x] `docs/02_guidelines/testing-guidelines.md` (テスト)
    - [x] **[Final Review]** Ensure all guidelines are consistent (Clean Architecture).
- [ ] **プロジェクトセットアップ**
    - [x] Next.js アプリの初期化 (App Router, TypeScript)
    - [x] Tailwind CSS & デザインシステムの設定 (Fonts, Colors)
    - [x] ESLint & Prettier の設定
- [ ] **インフラ構築**
    - [ ] Vercel プロジェクトのセットアップ
    - [ ] Supabase プロジェクトのセットアップ (Auth: SSO Only)
    - [ ] **ドメイン設定:** `preludiolab.com` の取得とVercelへの紐付け
- [ ] **DevOps & QA基盤構築**
    - [ ] GitHub Actions Workflow作成: `ci-check.yml` (Lint / TypeCheck / Unit Test)
    - [ ] Vitest テスト環境のセットアップ
- [ ] **AIエージェント環境構築 (AI Env)**
    - [ ] `agents/` ディレクトリの初期化 (package.json, tsconfig.json)
    - [ ] Google Generative AI SDK (Gemini) のインストール
    - [ ] GitHub Actions Workflow作成: `agent-runner.yml` (Manual/Schedule Trigger)

## Phase 0.8: MVP / プロトタイプ開発 (Prototype)
- [ ] **静的モックの実装**
    - [x] トップページのデザイン・実装 (Hardcoded)
    - [x] 記事詳細ページのレイアウト確認 (Dummy Data)
    - [x] 楽譜・プレイヤーのプレースホルダー配置
- [ ] **デプロイ・動作確認**
    - [ ] Vercelへの初回デプロイ
    - [ ] レスポンシブ挙動の確認

## Phase 1: コア機能開発 ("Lab" Components)
- [ ] **楽譜レンダリングエンジン** (Ref: `REQ-TECH-SCORE` TBD)
    - [ ] 要件と完了条件（Acceptance Criteria）の定義
    - [ ] `ScoreRenderer` コンポーネントの実装 (`react-abc` / `verovio`)
    - [ ] SVGレンダリングパフォーマンスの検証
    - [ ] **[New]** スケルトン表示 (Loading State) の実装 (Ref: `REQ-UI-006-01`)
- [ ] **オーディオプレイヤー統合** (Ref: `REQ-TECH-AUDIO`)
    - [ ] 要件と完了条件の定義
    - [ ] `AudioPlayer` コンポーネントの実装 (YouTube IFrame API)
    - [ ] **[New]** UIモード実装: Mini Player (Footer) & Focus Mode (Ref: `REQ-UI-004-02`)
    - [ ] 楽譜との同期ロジックの実装（任意/将来対応）
- [ ] **多言語MDXシステム & コンテンツフロー**
    - [ ] MDXディレクトリ構成の設計 (`content/[lang]/...`)
    - [ ] MDX Loader / Parser の実装
    - [ ] Pagefind 検索の実装 (Ref: `technology-requirements`)
    - [ ] **[New]** 目次 (TOC) 自動生成機能の実装 (Ref: `REQ-UI-005-02`)
    - [ ] **[New]** シリーズナビゲーション (Previous/Next/Index) の実装 (Ref: `REQ-CONT-SERIES`)
    - [ ] **[New]** コンテンツパイプラインの定義: Agent出力(MDX) -> Git PR -> Deployの流れを検証

## Phase 2: AIエージェント開発 ("Brain") & コンテンツ量産
- [ ] **音楽学者エージェント (Musicologist Agent)**
    - [ ] Script実装: `src/prompts/musicologist.ts` (楽曲分析・ABC譜面生成)
    - [ ] Tool実装: `src/tools/youtube.ts` (YouTube Data API 検索)
    - [ ] Orchestrator実装: `agents/src/index.ts` (Gemini API呼び出し制御)
    - [ ] テスト: バッハ「平均律第1番」での生成品質検証 (Ref: `REQ-TECH-AGENT-003`)
- [ ] **翻訳エージェント (Translator Agent)**
    - [ ] Script実装: `src/prompts/translator.ts` (多言語展開)
    - [ ] テスト: 7言語への並列翻訳と正当性検証 (Ref: `REQ-TECH-AGENT-004`)

## Phase 3: ビジネス・成長施策 (Ref: `business-requirements.md`)
- [ ] **SEO最適化** (Ref: `REQ-GOAL-001`)
    - [ ] 動的メタデータ生成の実装
    - [ ] サイトマップ & Robots.txt の生成
    - [ ] **[New]** RSSフィードの生成 (Ref: `REQ-TECH-SEO-001`)
- [ ] **コンプライアンス & マネタイズ**
    - [ ] **[New]** Cookie同意バナー (GDPR Consent) の実装 (Ref: `REQ-UI-006-02`)
    - [ ] 楽譜アフィリエイトリンクの実装 (Ref: `REQ-BIZ-001`)
    - [ ] 寄付/スポンサーボタンの実装 (Ref: `REQ-BIZ-002`)
    - [ ] オリジナルコンテンツへの誘導実装 (Ref: `REQ-BIZ-003`)

## Phase 4: 検証・ローンチ
- [ ] **コンテンツ検証**
    - [ ] パイロット記事（バッハの前奏曲など）3〜5本での検証
    - [ ] クロスブラウザ確認
    - [ ] モバイルレスポンシブ確認
- [ ] **ローンチ**
    - [ ] パブリックリリース
