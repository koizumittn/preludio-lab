# Naming Conventions & Guidelines (v1.0)

## 1. General Principles
*   **English Basis:** ファイル名、変数名、コードコメントは英語を使用する。
*   **Japanese Commits:** コミットログは「日本語」を使用する（Prefixは英語）。
*   **Descriptive:** 省略形（`usr`, `ctx` など）を避け、意味が通じる名前をつける。
*   **Case Sensitivity:** ファイルシステムの一貫性を保つため、大文字小文字の使い分けを厳守する。

## 2. File & Directory Naming

### Code Files
| Type | Rule | Example | Note |
| :--- | :--- | :--- | :--- |
| **Directories** | `kebab-case` | `components/ui` | 小文字ハイフン繋ぎ。 |
| **React Components** | `PascalCase` | `ScoreRenderer.tsx` | コンポーネント名と一致させる。 |
| **Hooks** | `camelCase` (usePrefix) | `useAudioPlayer.ts` | 必ず `use` で始める。 |
| **Utilities / Libs** | `kebab-case` | `date-formatter.ts` | 関数ライブラリなど。 |
| **Next.js Routes** | `kebab-case` | `app/blog/[slug]/page.tsx` | URLの一部になるため小文字。 |

### Content Files (MDX) (Ref: `content-requirements.md`)
記事MDXファイルの配置と命名は、カテゴリ (`REQ-CONT-TAX`) に従う。

*   **Root Directory:** `content/[lang]/`
*   **Categories & Patterns:**
    *   **Introduction (楽曲):** `works/{composer-slug}/{work-slug}.mdx`
        *   Example: `works/bach/prelude-in-c.mdx`
    *   **Composer (作曲家):** `composers/{composer-slug}.mdx`
        *   Example: `composers/bach.mdx`
    *   **Theory (理論):** `theory/{topic-slug}.mdx`
        *   Example: `theory/sonata-form.mdx`
    *   **Era, Instrument, Performer:** それぞれ `eras/`, `instruments/`, `performers/` 配下。
    *   **Column:** `columns/{year}/{slug}.mdx`
        *   Example: `columns/2025/music-in-movies.mdx`
*   **Slug Rules:** 英語小文字、ハイフン繋ぎ (`kebab-case`)。冠詞 (the, a) は省略推奨。

## 3. Code Identifiers
*   **Variables / Functions:** `camelCase` (e.g., `isValid`, `fetchData`)
*   **Types / Interfaces:** `PascalCase` (e.g., `ScoreData`, `UserProps`)
*   **Constants:** `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_COUNT`)

## 4. Git Naming
*   **Branches:** `type/description-slug`
    *   `feat/score-renderer`
    *   `fix/typo-in-handbook`
    *   `docs/update-naming-rules`
### Commits
    *   **Prefix List:**
        *   `feat`: 機能開発 (New features for the application code). ※業界標準は `feat` (featureの略) です。
        *   `content`: **[New]** コンテンツの追加・修正 (MDX files, images).
        *   `fix`: バグ修正 (Bug fixes).
        *   `docs`: ドキュメントのみの変更 (Documentation).
        *   `refactor`: バグ修正も機能追加も行わないコード変更 (Refactoring).
        *   `chore`: 雑務・保守 (Builds, Dependencies). ソースコードやテストの変更を含まない、ビルド設定やライブラリ更新など。
    *   **Examples:**
        *   `feat: 楽譜レンダラーの実装`
        *   `content: バッハ「前奏曲」の記事を追加`
        *   `docs: 命名規則ガイドラインの更新`

## 5. Requirement IDs
要件定義書で使用するIDの命名規則。

| Pattern | Category | Example | Reference |
| :--- | :--- | :--- | :--- |
| **REQ-BIZ-XXX** | Business Goals | `REQ-BIZ-GOAL-001` | `business-requirements.md` |
| **REQ-USER-XXX** | User / Persona | `REQ-USER-001` | `business-requirements.md` |
| **REQ-TECH-STACK-XXX** | Tech Stack | `REQ-TECH-STACK-001` | `technology-requirements.md` |
| **REQ-TECH-AGENT-XXX** | AI Agent | `REQ-TECH-AGENT-001` | `technology-requirements.md` |
| **REQ-UI-XXX** | UI/UX | `REQ-UI-001` | `ui-ux-requirements.md` |
| **REQ-CONT-XXX** | Content | `REQ-CONT-TAX-001` | `content-requirements.md` |
