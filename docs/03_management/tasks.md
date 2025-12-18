# PreludioLab タスクリスト

Status: `[/]` 進行中

## Phase 1: 要件定義・設計 (Requirements & Design)
- [x] **1.1 要件定義の精緻化**
    - [x] `01_specs/business-requirements.md` をブラッシュアップし、要件ID (`REQ-BIZ-XXX`) を付与
    - [x] `01_specs/technology-requirements.md` をブラッシュアップし、要件ID (`REQ-TECH-XXX`) を付与
    - [x] `01_specs/ui-ux-requirements.md` をブラッシュアップし、要件ID (`REQ-UI-XXX`) を付与
    - [x] `01_specs/content-requirements.md` をブラッシュアップし、要件ID (`REQ-CONT-XXX`) を付与
    - [x] 各要件に対する「完了条件（Acceptance Criteria）」の記述
    - [x] **[Update]** AIデザインプロセス (`REQ-UI-PROCESS`) の追加
    - [x] **[Update]** Designer Agent (`REQ-TECH-AGENT-007`) の追加
- [x] **1.2 基本設計**
    - [x] **ルーティング設計:** `app/[lang]/` 配下のURL構造とページ遷移の定義
    - [x] **コンテンツデータ設計:** MDX Frontmatterのスキーマ定義 (Title, Composer, Difficulty, Tags...)
    - [x] **コンポーネント設計:** UIパーツ（Atoms/Molecules）と機能コンポーネント（Organisms）のリストアップ
    - [x] **デザイン仕様策定:** `docs/05_design/ui-design.md` (Tokens, Changeability) の作成
    - [x] **エージェント設計:** AIエージェント（Musicologist, Translator, *Designer*）の出力フォーマットとインターフェース定義

## Phase 2: 環境構築 (Environment Setup)
- [x] **2.1 ガイドライン策定**
    - [x] `docs/02_guidelines/naming-conventions.md` (命名規則)
    - [x] `docs/02_guidelines/score-notation-guidelines.md` (楽譜表記)
    - [x] `docs/02_guidelines/localization-guidelines.md` (翻訳・ローカライズ)
    - [x] `docs/02_guidelines/prompt-engineering-standard.md` (AIプロンプト)
    - [x] `docs/02_guidelines/development-guidelines.md` (開発)
    - [x] `docs/02_guidelines/testing-guidelines.md` (テスト)
    - [x] **[Final Review]** Ensure all guidelines are consistent (Clean Architecture).
- [x] **2.2 プロジェクトセットアップ**
    - [x] GitHubリポジトリの作成とRemote設定
    - [x] Next.js アプリの初期化 (App Router, TypeScript)
    - [x] Tailwind CSS & デザインシステムの実装 (Variables in `globals.css`, Fonts in `layout.tsx`)
    - [x] ESLint & Prettier の設定
- [x] **2.3 インフラ構築**
    - [x] Vercel プロジェクトのセットアップ
    - [x] Supabase プロジェクトのセットアップ (Auth: SSO Only)
    - [ ] **Local DB Setup:** Docker Compose & Supabase CLI Setup (for Dev Isolation) <!-- Postponed due to Docker version issue -->
    - [x] **ドメイン設定:** `preludiolab.com` の取得とVercelへの紐付け
- [x] **2.4 DevOps & QA基盤構築**
    - [x] GitHub Actions Workflow作成: `ci-check.yml` (Lint / TypeCheck / Unit Test)
    - [x] Vitest テスト環境のセットアップ
- [x] **2.5 AIエージェント環境構築 (AI Env)**
    - [x] `agents/` ディレクトリの初期化 (package.json, tsconfig.json)
    - [x] Google Generative AI SDK (Gemini) のインストール
    - [x] GitHub Actions Workflow作成: `agent-runner.yml` (Manual/Schedule Trigger)

## Phase 3: MVP / プロトタイプ開発 (Prototype)
- [x] **3.1 静的モックの実装**
    - [x] トップページのデザイン・実装 (Hardcoded + Design Tokens)
    - [x] 記事詳細ページのレイアウト確認 (Dummy Data + Skeleton)
    - [x] 楽譜・プレイヤーのプレースホルダー配置
- [x] **3.2 デプロイ・動作確認**
    - [x] Vercelへの初回デプロイ (Framework Preset, Pino Config Fixed)
    - [x] サーバーサイドログ (Pino) の復旧と確認
    - [x] レスポンシブ挙動の確認

## Phase 4: コア機能開発 ("Lab" Components)
- [x] **4.1 楽譜レンダリングエンジン** (Ref: `REQ-TECH-SCORE`)
    - [x] 要件と完了条件（Acceptance Criteria）の定義
    - [x] `ScoreRenderer` コンポーネントの実装 (`abcjs`)
    - [x] SVGレンダリングパフォーマンスの検証
    - [x] スケルトン表示 (Loading State) の実装 (Ref: `REQ-UI-006-01`)
- [x] **4.2 オーディオプレイヤー統合** (Ref: `REQ-TECH-AUDIO`)
    - [x] 要件と完了条件の定義
    - [x] `AudioPlayer` コンポーネントの実装 (YouTube IFrame API)
    - [x] UIモード実装: Mini Player (Footer) & Focus Mode (Ref: `REQ-UI-004-02`)
    - [x] 楽譜との同期ロジックの実装（Click to Play / StartTime指定の実装）
- [x] **4.3 多言語MDXシステム & コンテンツフロー**
    - [x] MDXディレクトリ構成の設計 (`content/[lang]/...`)
    - [x] MDX Loader / Parser の実装
    - [x] Pagefind 検索の実装 (Ref: `technology-requirements`)
    - [x] 目次 (TOC) 自動生成機能の実装 (Ref: `REQ-UI-005-02`)
    - [x] シリーズナビゲーション (Previous/Next/Index) の実装 (Ref: `REQ-CONT-SERIES`)
    - [x] コンテンツパイプラインの定義: Agent出力(MDX) -> Git PR -> Deployの流れを検証 (Manual Build Verified)

## Phase 5: アプリケーション機能実装と詳細化 (Web Application Implementation)
- [ ] **5.1 多言語対応の実装 (i18n UI/UX)**
    - [ ] **[準備]** 検証用ダミーデータの用意
        - [ ] i18n動作確認用の多言語MDX記事（日・英・他）を作成し配置
    - [ ] **[仕様策定]** 多言語ルーティング・辞書スキーマの定義
        - [ ] URL構造（`/[lang]/...`）の決定と、辞書ファイル（JSON）の型定義（TypeScript）
    - [ ] **多言語ルーティングとUIの実装**
        - [ ] Middlewareによる言語検出とリダイレクトの実装
        - [ ] ヘッダーへの `LanguageSwitcher` コンポーネントの実装
        - [ ] UI共通パーツ（ナビゲーション、ボタン等）の翻訳対応
    - [ ] **[テスト・動作検証]** 言語切り替え時の挙動確認
        - [ ] ページ遷移時の言語維持、404ページの多言語対応、メタデータの言語不整合チェック
    - [ ] **[リファクタリング]** フィルターロジックの分離
        - [ ] `getDictionary` 関数の最適化、翻訳漏れを検知する静的チェックの導入

- [ ] **5.2 ホームページの実装 (Dynamic Homepage)**
    - [ ] **[仕様策定]** ホームページ・データフェッチ戦略の策定
        - [ ] "Featured Work" の選定基準（Frontmatterのフラグ）と、各セクションのデータ取得範囲の定義
    - [ ] **動的コンテンツの実装**
        - [ ] `Featured Work` セクションへの最新MDXデータの流し込み
        - [ ] Discoverカテゴリ（Analysis, Composers等）への遷移ロジック
        - [ ] スクロールアニメーション（Framer Motion等）による没入感の演出
    - [ ] **[テスト・動作検証]** 表示パフォーマンスとレスポンシブの検証
        - [ ] LCP（Largest Contentful Paint）の計測、モバイル実機での「Discover」カードの操作性確認
    - [ ] **[リファクタリング]** ホームページ専用コンポーネントのクリーン化
        - [ ] 巨大になりがちな `page.tsx` の Organisms 単位への分割

- [ ] **5.3 一覧ページの実装 (Works / Composers Index)**
    - [ ] **[仕様策定]** フィルタリング・ソート仕様の策定
        - [ ] 難易度、時代、楽器などのフィルター項目と、URLクエリパラメータとの連動設計
    - [ ] **一覧ページの実装**
        - [ ] `Works` 一覧：グリッドレイアウトとフィルタリング機能
        - [ ] `Composers` 一覧：アルファベット/時代別ソート機能
        - [ ] ローディング中のスケルトン表示の実装
    - [ ] **[テスト・動作検証]** 大量データ時の挙動確認
        - [ ] 100件以上の記事がある想定でのスクロール挙動、フィルタリングの正確性検証
    - [ ] **[リファクタリング]** フィルターロジックの分離
        - [ ] 検索・絞り込みロジックを Custom Hook（`useFilter`）へ抽出し、保守性を向上

- [ ] **5.4 検索機能の実装 (Pagefind Integration)**
    - [ ] **[仕様策定]** 検索UI/UXとインデックス範囲の定義
        - [ ] Pagefindの日本語トークナイザー設定、検索対象フィールド（タイトル、本文、タグ）の優先順位付け
    - [ ] **検索機能の統合**
        - [ ] 検索モーダル（Cmd+K対応）のデザインと実装
        - [ ] `Pagefind` ライブラリのセットアップとGitHub Actionsでのビルド設定
    - [ ] **[テスト・動作検証]** 検索精度の検証
        - [ ] 日本語キーワード（例：「バッハ 前奏曲」）でのヒット率、検索結果の表示速度確認
    - [ ] **[リファクタリング]** 検索結果UIの最適化
        - [ ] 検索結果のハイライト表示（Snippets）のスタイリング、不要なインデックスデータの除外

## Phase 6: AIエージェント開発 ("Brain") & コンテンツ量産
- [ ] **6.1 音楽学者エージェント (Musicologist Agent)**
    - [ ] **Prompt Design:**
        - [ ] 楽曲構造分析プロンプトの設計 (Music Theory)
        - [ ] ABC譜面生成プロンプトの設計 (Notation Rules)
    - [ ] **Implementation:**
        - [ ] Tool実装: `src/tools/youtube.ts` (YouTube Data API 検索)
        - [ ] Orchestrator実装: `agents/src/index.ts` (Gemini API呼び出し制御)
    - [ ] **Verification:**
        - [ ] テスト: バッハ「平均律第1番」での生成品質検証 (Ref: `REQ-TECH-AGENT-003`)

- [ ] **6.2 翻訳エージェント (Translator Agent)**
    - [ ] **Prompt Design:**
        - [ ] 多言語翻訳プロンプトの設計 (Tone & Style Guide)
    - [ ] **Implementation (Core):**
        - [ ] 翻訳Orchestratorの実装 (Parallel Execution)
    - [ ] **Implementation & Verification (Per Language):**
        - [ ] 英語 (EN) の出力検証
        - [ ] スペイン語 (ES) の出力検証
        - [ ] ドイツ語 (DE) の出力検証
        - [ ] フランス語 (FR) の出力検証
        - [ ] イタリア語 (IT) の出力検証
        - [ ] 中国語 (ZH) の出力検証

- [ ] **6.3 コンテンツ量産体制の構築と実行 (Content Operations)**
    - [ ] **Strategy:**
        - [ ] 初回リリース用コンテンツ選定 (Target: 10-20 articles for Launch)
        - [ ] コンテントマップ作成 (Composers / Genres / Difficulty Matrix)
    - [ ] **Execution (Pilot):**
        - [ ] エージェントによるパイロット記事 5本生成
        - [ ] 人手による品質レビュー (Music Theory, Notation, Translation Checks)
        - [ ] 修正フィードバックループの確立 (Prompt Tuning based on feedback)
    - [ ] **Execution (Batch):**
        - [ ] バッチ処理による記事大量生成
        - [ ] 画像・メディアアセットの半自動生成 (OGP, Analysis Diagrams)
    - [ ] **QA & Publication:**
        - [ ] リンク切れ・レイアウト崩れの最終チェック
        - [ ] 公開スケジュール策定

## Phase 7: ビジネス・成長施策 (Ref: `business-requirements.md`)
- [ ] **7.1 SEO最適化** (Ref: `REQ-GOAL-001`)
    - [ ] 動的メタデータ生成の実装
    - [ ] サイトマップ & Robots.txt の生成
    - [ ] RSSフィードの生成 (Ref: `REQ-TECH-SEO-001`)
- [ ] **7.2 コンプライアンス**
    - [x] Cookie同意バナー (GDPR Consent) の実装 (Ref: `REQ-UI-006-02`)
- [ ] **7.3 マネタイズ実装**
    - [ ] 楽譜アフィリエイトリンクの実装 (Ref: `REQ-BIZ-001`)
    - [ ] 寄付/スポンサーボタンの実装 (Ref: `REQ-BIZ-002`)
    - [ ] オリジナルコンテンツへの誘導実装 (Ref: `REQ-BIZ-003`)

## Phase 8: 検証・ローンチ
- [ ] **8.1 コンテンツ検証**
    - [ ] パイロット記事（バッハの前奏曲など）3〜5本での検証
    - [ ] クロスブラウザ確認
    - [ ] モバイルレスポンシブ確認
- [ ] **8.2 ローンチ**
    - [ ] パブリックリリース

## Backlog / Issues (Future Improvements)
- [ ] **Score "Now Playing" Indicator**
    - 楽譜をクリックしてMini Playerを再生した際、クリックした楽譜に「再生中」という状態表示（ボーダーやアイコン変化など）を追加する。
- [ ] **Default YouTube Artwork**
    - `artworkSrc` が未定義かつ `platformType=youtube` の場合、`https://img.youtube.com/vi/<video-id>/hqdefault.jpg` を自動的にデフォルト値として使用する。
- [ ] **Sidebar Widget Implementation**
    - 現在モックであるサイドバーの右側機能（YouTube Player, Listening Guide）を本実装する。
    - Listening Guideのデータ構造設計とMDXへの統合を含む。
