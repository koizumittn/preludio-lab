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
- [x] **5.1 多言語対応の実装 (i18n UI/UX)**
    - [x] **[準備]** 検証用ダミーデータの用意
        - [x] i18n動作確認用の多言語MDX記事（日・英・他）を作成し配置
    - [x] **[仕様策定]** 多言語ルーティング・辞書スキーマ・**SEO (`hreflang`/JSON-LD)** の定義
        - [x] URL構造（`/[lang]/...`）の決定と、辞書ファイル（JSON）の型定義（TypeScript）
        - [x] 言語切り替えUI (Language Switcher) の配置とインタラクション設計
        - [x] 構造化データ（JSON-LD）の共通スキーマ設計
    - [x] **[実装]** 多言語ルーティングとUIの実装
        - [x] Middlewareによる言語検出とリダイレクトの実装
        - [x] ヘッダーへの `LanguageSwitcher` コンポーネントの実装
        - [x] UI共通パーツ（ナビゲーション、ボタン等）の翻訳対応
    - [x] **[テスト・動作検証]** 言語切り替え時の挙動確認
        - [x] ページ遷移時の言語維持、404ページの多言語対応、メタデータの言語不整合チェック
    - [x] **[リファクタリング]** i18nロジックの共通化
        - [x] `getDictionary` 関数の最適化、翻訳漏れを検知する静的チェックの導入

- [ ] **5.2 オーディオプレイヤーのコンポーネント化 (Player Componentization)**
    - [ ] **[仕様策定]** プレイヤー抽象化レイヤーの定義
        - [ ] `ScoreRenderer` からの分離方針と、`AudioManager` (Context) の設計
        - [ ] Props設計: `src`, `startTime`, `onTimeUpdate` などのインターフェース定義
    - [ ] **[実装]** `AudioPlayer` コンポーネントの独立化
        - [ ] Shared Component への移動 (`src/components/features/player/`)
        - [ ] Mini Player (Footer) との連携ロジックの再実装
    - [ ] **[テスト・動作検証]** 独立再生と同期再生の検証
        - [ ] 楽譜連動モードと、単独再生モード（BGM）の動作確認
    - [ ] **[リファクタリング]** 既存コードへの適用
        - [ ] `ScoreRenderer` 内のプレイヤー呼び出しを新コンポーネントへ置き換え

- [ ] **5.3 ホームページの実装 (Dynamic Homepage)**
    - [ ] **[仕様策定]** データフェッチ戦略とサイドバー構造の定義
        - [ ] "Featured Work" の選定基準とデータ取得範囲
        - [ ] サイドバー（Listening Guide/Player Widget）の配置設計とMDX連携仕様
        - [ ] 各セクションのUIレイアウトおよびスクロール演出（Framer Motion）の設計
    - [ ] **[実装]** 動的コンテンツとサイドバーの実装
        - [ ] `Featured Work` セクションへの最新MDXデータの流し込み
        - [ ] サイドバーウィジェット（Listening Guideプレビュー等）の実装
        - [ ] Discoverカテゴリ（Analysis, Composers等）への遷移ロジック
        - [ ] スクロールアニメーション（Framer Motion等）による没入感の演出
    - [ ] **[テスト・動作検証]** 表示パフォーマンスとレスポンシブの検証
        - [ ] LCP（Largest Contentful Paint）の計測、モバイル実機での「Discover」カードの操作性確認
    - [ ] **[リファクタリング]** ホームページ専用コンポーネントのクリーン化
        - [ ] 巨大になりがちな `page.tsx` の Organisms 単位への分割

- [ ] **5.4 一覧ページの実装 (Works / Composers Index)**
    - [ ] **[仕様策定]** フィルタリング・ソート仕様の策定
        - [ ] 難易度、時代、楽器などのフィルター項目と、URLクエリパラメータとの連動設計
        - [ ] 一覧グリッドおよびフィルターパネルのレスポンシブUI/UX設計
        - [ ] **空状態 (Empty State)** のUI定義（検索ヒット0件時の表示）
        - [ ] **サムネイル自動解決ロジック** の定義（YouTubeサムネのフォールバック仕様）
    - [ ] **[実装]** 一覧ページと自動サムネイル
        - [ ] `Works`/`Composers` 一覧のグリッドレイアウト実装
        - [ ] **Default YouTube Artwork** ロジックの実装（`hqdefault.jpg` 自動適用）
        - [ ] ローディング中のスケルトン表示の実装
    - [ ] **[テスト・動作検証]** 大量データ時の挙動確認
        - [ ] 100件以上の記事がある想定でのスクロール挙動、フィルタリングの正確性検証
    - [ ] **[リファクタリング]** フィルターロジックの分離
        - [ ] 検索・絞り込みロジックを Custom Hook（`useFilter`）へ抽出し、保守性を向上

- [ ] **5.5 検索機能の実装 (Pagefind Integration)**
    - [ ] **[仕様策定]** 検索UI/UXとインデックス範囲の定義
        - [ ] Pagefindの日本語トークナイザー設定、検索対象フィールド（タイトル、本文、タグ）の優先順位付け
        - [ ] 検索モーダル（Cmd+K）の外観と操作フロー（キーボード操作含む）の詳細UI設計
        - [ ] **インデックス更新タイミング** の定義（ビルドフロー内での実行順序）
    - [ ] **[実装]** 検索機能の統合
        - [ ] 検索モーダル（Cmd+K対応）のデザインと実装
        - [ ] `Pagefind` ライブラリのセットアップとGitHub Actionsでのビルド設定
    - [ ] **[テスト・動作検証]** 検索精度の検証
        - [ ] 日本語キーワード（例：「バッハ 前奏曲」）でのヒット率、検索結果の表示速度確認
    - [ ] **[リファクタリング]** 検索結果UIの最適化
        - [ ] 検索結果のハイライト表示（Snippets）のスタイリング、不要なインデックスデータの除外

## Phase 6: AIエージェント開発 ("Brain") & コンテンツ量産
- [ ] **6.1 音楽学者エージェント (Musicologist Agent)**
    - [ ] **[仕様策定]** 分析・生成プロンプトの要件定義
        - [ ] 楽曲構造分析およびABC譜面生成のプロンプト設計要件 (Music Theory & Notation Rules)
    - [ ] **[実装]** プロンプト設計とエージェント実装
        - [ ] Tool実装: `src/tools/youtube.ts` (YouTube Data API 検索)
        - [ ] Orchestrator実装: `agents/src/index.ts` (Gemini API呼び出し制御)
        - [ ] **API Cost Circuit Breaker** の実装 (Quota監視・自動停止機能)
    - [ ] **[テスト・動作検証]** 生成品質の検証
        - [ ] テスト: バッハ「平均律第1番」での生成品質検証 (Ref: `REQ-TECH-AGENT-003`)
    - [ ] **[リファクタリング]** プロンプトとツールの最適化
        - [ ] 生成精度向上に向けたプロンプトチューニングと再利用性の向上

- [ ] **6.2 翻訳エージェント (Translator Agent)**
    - [ ] **[仕様策定]** 翻訳ルールとトーン＆マナーの定義
        - [ ] 多言語翻訳プロンプトの要件 (Tone & Style Guide) および用語集の整備
    - [ ] **[実装]** 翻訳プロンプトとオーケストレーター実装
        - [ ] 翻訳Orchestratorの実装 (Parallel Execution)
    - [ ] **[テスト・動作検証]** 各言語の翻訳品質検証
        - [ ] 英語 (EN) の出力検証
        - [ ] スペイン語 (ES) の出力検証
        - [ ] ドイツ語 (DE) の出力検証
        - [ ] フランス語 (FR) の出力検証
        - [ ] イタリア語 (IT) の出力検証
        - [ ] 中国語 (ZH) の出力検証
    - [ ] **[リファクタリング]** 翻訳精度の向上とプロンプト改善
        - [ ] 文脈維持能力の強化とエラーハンドリングの改善

- [ ] **6.3 コンテンツ量産体制の構築と実行 (Content Operations)**
    - [ ] **[仕様策定]** コンテンツ戦略とパイプライン定義
        - [ ] 初回リリース用コンテンツ選定 (Target: 10-20 articles for Launch)
        - [ ] コンテントマップ作成: Pillar Content (没入感), Guide Content (入門), Niche Content (専門性), Utility Content (実用) のバランス設計
    - [ ] **[実装]** パイロット・バッチ生成の実行
        - [ ] エージェントによるパイロット記事 5本生成
        - [ ] バッチ処理による記事大量生成
        - [ ] 画像・メディアアセットの半自動生成 (OGP, Analysis Diagrams)
    - [ ] **[テスト・動作検証]** 品質レビューと公開前チェック
        - [ ] 人手による品質レビュー (Music Theory, Notation, Translation Checks)
        - [ ] リンク切れ・レイアウト崩れの最終チェック
    - [ ] **[リファクタリング]** プロセス改善とプロンプトチューニング
        - [ ] 修正フィードバックループの確立と次期バッチへの反映

## Phase 7: Pre-Launch Marketing & Growth Foundation (Acquisition - Pre)
- [ ] **7.1 Pre-Launch Asset Creation**
    - [ ] **[実装]** シンプルなランディングページ (Teaser LP) の公開
        - [ ] Vercel + Supabase Auth でメール登録フォーム（Waitlist）のみ機能するLPを作成し、ドメインのエイジングを開始する。
    - [ ] **[実装]** SNS配信用アセットの自動生成パイプライン
        - [ ] `abcjs` で描画された「美しい譜例」を画像化し、SNSでBuild in Publicを行うためのワークフロー整備。

- [ ] **7.2 Viral Mechanics Implementation**
    - [ ] **[実装]** Dynamic OGP Generation (Shareability)
        - [ ] 楽曲タイトル、作曲家、譜例の一部を合成したOGP画像を、各言語ごとに `@vercel/og` を用いて決定論的に自動生成する。
    - [ ] **[実装]** 構造化データ (JSON-LD) の完全実装
        - [ ] `MusicComposition`, `MusicRecording` スキーマを埋め込み、Googleのリッチリザルト表示を狙う。

- [ ] **7.3 Technical SEO Foundation**
    - [ ] **[実装]** sitemap.xml & Robots.txt の構成
    - [ ] **[実装]** リンク切れ監視 (Dead Link Monitor) のセットアップ

## Phase 8: 検証・ローンチ (Launch)
- [ ] **8.1 最終検証**
    - [ ] パイロット記事（Pillar Content）の実機検証
    - [ ] クロスブラウザ確認 & モバイルレスポンシブ確認
    - [ ] **[セキュリティ]** 脆弱性診断 (OWASP Top 10) の実施
- [ ] **8.2 ローンチ実行**
    - [ ] パブリックリリース (Vercel Production Deploy)
    - [ ] Product Hunt, Hacker News, Reddit (r/classicalmusic) へのShowcase投稿

## Phase 9: ローンチ後の成長と収益化 (Post-Launch Growth & Monetization)
- [ ] **9.1 コミュニティ・エンゲージメント (Community Engagement)**
    - [ ] **[実装]** ユーザー機能（いいね / お気に入り / 履歴）の実装
    - [ ] **[実装]** 誤訳報告機能 (Translation Feedback Loop) の実装
- [ ] **9.2 ソーシャル・バイラル施策 (Social Viral Loops)**
    - [ ] **[運用]** "Today's Score" Bot の運用開始（日替わりで名曲の譜例を投稿）
    - [ ] **[実装]** YouTube Shorts/TikTok 用の楽曲解説動画生成フローの検討
- [ ] **9.3 マネタイズ・ビジネス (Monetization & Business)**
    - [ ] **[実装]** アフィリエイトリンク (Score/Audio) のコンテキスト配置
    - [ ] **[実装]** KPIモニタリングダッシュボード (Vercel Analytics / GSC) の構築

## Backlog / Issues (Future Improvements)
- [ ] **Score "Now Playing" Indicator**
    - 楽譜をクリックしてMini Playerを再生した際、クリックした楽譜に「再生中」という状態表示（ボーダーやアイコン変化など）を追加する。

- [ ] **ABC Notation Quality Improvement (MusicXML)**
    - 信頼できる MusicXML リポジトリ（MuseScore, IMSLP等）から ABC記法 への自動変換パイプラインを構築し、手動入力の手間を削減しつつ正確性を担保する。

- [ ] **Automated YouTube Curation Logic**
    - サイトのコンセプト（構造分析に適した演奏、音質、没入感）に合致する動画の選定基準を策定し、YouTube Data API を用いて候補を自動収集・フィルタリングする仕組みを構築する。

- [ ] **Accessibility (A11y) Audit for Score & Player**
    - 視覚障害者ユーザー（Screen Reader利用）が、「楽曲の構造」や「現在再生位置」を把握できるか、WAI-ARIA 属性の適切性を検証・改善する。

- [ ] **Edge Config & Cache Strategy Optimization**
    - Supabaseのデータや翻訳辞書の取得において、Vercel Edge Configや`stale-while-revalidate` (SWR) パターンを適用し、グローバル規模での低遅延アクセス（瞬時の没入体験）を実現する。

- [ ] **Automated Highlight & Timestamp Extraction**
    - AIにより「楽曲の聴きどころ（Highlight）」とYouTube音源の対応するタイムスタンプを自動抽出し、コンテンツ制作（ドラフト）の効率を飛躍的に高める。

- [ ] **Dynamic Language Sorting by Browser Locale**
    - ブラウザ言語による動的な並び替え: 技術スタック（Next.js）を活かし、**「基本はこの順序だが、ユーザーのブラウザ言語を検知して、その言語を最上位にプロモートする」**というロジックを組むと、グローバルな没入感がさらに高まります。
