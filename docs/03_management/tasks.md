# PreludioLab タスクリスト

Status: `[/]` 進行中

## Phase 0: 要件定義・設計 (Requirements & Design)
- [ ] **要件定義の精緻化**
    - [ ] `01_specs/business-requirements.md` に要件ID (`REQ-BIZ-XXX`) を付与
    - [ ] `01_specs/technology-requirements.md` に要件ID (`REQ-TECH-XXX`) を付与
    - [ ] `01_specs/ui-ux-requirements.md` に要件ID (`REQ-UI-XXX`) を付与
    - [ ] 各要件に対する「完了条件（Acceptance Criteria）」の記述
- [ ] **基本設計**
    - [ ] **ルーティング設計:** `app/[lang]/` 配下のURL構造とページ遷移の定義
    - [ ] **コンテンツデータ設計:** MDX Frontmatterのスキーマ定義 (Title, Composer, Difficulty, Tags...)
    - [ ] **コンポーネント設計:** UIパーツ（Atoms/Molecules）と機能コンポーネント（Organisms）のリストアップ
    - [ ] **エージェント設計:** AIエージェント（Musicologist, Translator）の出力フォーマットとインターフェース定義

## Phase 0.5: 環境構築 (Environment Setup)
- [ ] **プロジェクトセットアップ**
    - [ ] Next.js アプリの初期化 (App Router, TypeScript)
    - [ ] Tailwind CSS & デザインシステムの設定 (Fonts, Colors)
    - [ ] ESLint & Prettier の設定
- [ ] **インフラ構築**
    - [ ] Vercel プロジェクトのセットアップ
    - [ ] Supabase プロジェクトのセットアップ (Auth: SSO Only)
    - [ ] **ドメイン設定:** `preludiolab.com` の取得とVercelへの紐付け
- [ ] **DevOps & QA基盤構築**
    - [ ] GitHub Actions Workflow作成: `ci-check.yml` (Lint / TypeCheck / Unit Test)
    - [ ] Vitest テスト環境のセットアップ

## Phase 0.8: MVP / プロトタイプ開発 (Prototype)
- [ ] **静的モックの実装**
    - [ ] トップページのデザイン・実装 (Hardcoded)
    - [ ] 記事詳細ページのレイアウト確認 (Dummy Data)
    - [ ] 楽譜・プレイヤーのプレースホルダー配置
- [ ] **デプロイ・動作確認**
    - [ ] Vercelへの初回デプロイ
    - [ ] レスポンシブ挙動の確認

## Phase 1: コア機能開発 ("Lab" Components)
- [ ] **楽譜レンダリングエンジン** (Ref: `REQ-TECH-SCORE` TBD)
    - [ ] 要件と完了条件（Acceptance Criteria）の定義
    - [ ] `ScoreRenderer` コンポーネントの実装 (`react-abc` / `verovio`)
    - [ ] SVGレンダリングパフォーマンスの検証
- [ ] **オーディオプレイヤー統合** (Ref: `REQ-TECH-AUDIO` TBD)
    - [ ] 要件と完了条件の定義
    - [ ] `AudioPlayer` コンポーネントの実装 (YouTube IFrame API)
    - [ ] 楽譜との同期ロジックの実装（任意/将来対応）
- [ ] **多言語MDXシステム**
    - [ ] MDXディレクトリ構成の設計 (`content/[lang]/...`)
    - [ ] MDX Loader / Parser の実装
    - [ ] Pagefind 検索の実装 (Ref: `technology-requirements`)

## Phase 2: AIエージェント開発 ("Brain")
- [ ] **エージェント実行環境の構築**
    - [ ] `agents/` ディレクトリ構成の作成
    - [ ] `agents/package.json` & TypeScript 設定
    - [ ] GitHub Actions の設定 (`agent-runner.yml`)
- [ ] **音楽学者エージェント (Musicologist Agent)**
    - [ ] プロンプト開発: 楽曲構造分析 (Music Theory)
    - [ ] プロンプト開発: ABC譜面生成
    - [ ] YouTube Data API 検索ツールの実装
    - [ ] Gemini 3.0 Pro での生成品質テスト
- [ ] **翻訳エージェント (Translator Agent)**
    - [ ] プロンプト開発: 多言語翻訳 (EN/ES/JA)

## Phase 3: ビジネス・成長施策 (Ref: `business-requirements.md`)
- [ ] **SEO最適化** (Ref: `REQ-GOAL-001`)
    - [ ] 動的メタデータ生成の実装
    - [ ] サイトマップ & Robots.txt の生成
- [ ] **マネタイズ実装**
    - [ ] 楽譜アフィリエイトリンクの実装 (Ref: `REQ-BIZ-001`)
    - [ ] 寄付/スポンサーボタンの実装 (Ref: `REQ-BIZ-002`)
    - [ ] (将来構想) 有料リクエストシステムの実装 (Ref: `REQ-BIZ-003`)

## Phase 4: 検証・ローンチ
- [ ] **コンテンツ検証**
    - [ ] パイロット記事（バッハの前奏曲など）3〜5本での検証
    - [ ] クロスブラウザ確認
    - [ ] モバイルレスポンシブ確認
- [ ] **ローンチ**
    - [ ] パブリックリリース
