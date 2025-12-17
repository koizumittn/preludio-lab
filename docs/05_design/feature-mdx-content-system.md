# 多言語MDXコンテンツシステム設計書 (v1.0)

## 1. 概要
本システムは、音楽理論解説記事（テキスト、楽譜、音声）を多言語で効率的に管理・配信するための基盤です。
MDX (Markdown JSX) を採用することで、記事コンテンツ内にReactコンポーネント（楽譜レンダラーやプレイヤー）を直接埋め込むことを可能にします。
また、ビルド時に静的生成 (SSG) を行い、コストゼロかつ高速な配信を実現します。

## 2. アーキテクチャ

### Tech Stack
*   **Content Format:** MDX (Markdown + JSX)
*   **Parser:** `next-mdx-remote` (Server Components対応)
*   **Validation:** `zod` (Frontmatterの型安全性を担保)
*   **Search:** `Pagefind` (静的サイト向け全文検索エンジン)
*   **Rendering:** Server Side Generation `generateStaticParams`

### Data Flow
1.  **Authoring (AI/Human):** `content/[lang]/` 配下にMDXを作成。
2.  **Build Time:**
    *   Next.jsがファイルシステムからMDXを読み込み。
    *   Frontmatterを検証し、メタデータを抽出。
    *   `src/app/[lang]/works/[slug]/page.tsx` が各記事をHTMLとして静的生成。
    *   `src/lib/mdx.ts` がプラグイン (`rehype-slug`) を適用し、見出しIDを付与。
    *   ビルド完了後、`postbuild` スクリプトが `Pagefind` を実行し、生成されたHTMLから検索インデックスを作成。
3.  **Run Time:**
    *   ユーザーはCDNから静的HTML（キャッシュ）を取得。
    *   楽譜はクライアントサイド (`ScoreRenderer`) でSVGとして描画。
    *   検索はブラウザ上で `pagefind.js` をロードし、WASMを使用して静的インデックスを検索。

## 3. ディレクトリ構成

### Content Repository
コンテンツは言語コードごとのディレクトリに配置され、ディレクトリ階層がそのままURLパスとなります。

```
content/
├── en/
│   └── works/
│       ├── bach/               # Composer Directory
│       │   └── prelude-1.mdx   # -> /en/works/bach/prelude-1
│       └── mozart/
│           └── k545.mdx
├── ja/
│   └── works/
│       └── bach/
│           └── prelude-1.mdx
└── [lang]/
    └── [category]/
        └── [...slug].mdx       # Catch-all pattern
```

### Frontmatter Schema
記事のメタデータは厳格に型定義 (`src/lib/mdx.ts`) されています。

```yaml
---
title: "Prelude in C Major"        # 記事タイトル
composer: "Johann Sebastian Bach"  # 作曲家名
work: "The Well-Tempered Clavier"  # 作品名（コレクション名）
key: "C Major"                     # 調性
difficulty: "Intermediate"         # 難易度 (Beginner/Intermediate/Advanced)
tags: ["Baroque", "Piano"]         # タグ
ogp_excerpt: "X:1..."              # OGP画像生成用のABC譜面スニペット
date: "2025-12-18"                 # 作成日
---
```

## 4. コアコンポーネント

### `ScoreRenderer` (Client)
*   **役割:** ABC記法テキストを受け取り、SVG楽譜をレンダリングします。
*   **統合:** MDX内で ` ```abc ` というコードブロックを使用すると、カスタムコンポーネントとしてこのレンダラーに置換されます。

### `TableOfContents` (Client)
*   **役割:** 記事内の見出し (`h2`, `h3`) を抽出し、サイドバーに目次を表示します。
*   **実装:** `rehype-slug` によりHTMLヘッダーにIDが付与され、それを元にリンクを生成します。

### `SeriesNavigation` (Server)
*   **役割:** 同一カテゴリ内の記事リストから、前後の記事へのリンクを生成します。
*   **ロジック:** 現状はタイトル順、将来的には作品番号順などでソート可能とします。

### `SearchBox` (Client)
*   **役割:** サイト内全文検索を提供します。
*   **実装:** `window.pagefind` を動的にロードし、入力されたクエリに対して結果をリアルタイム表示します。
*   **特徴:** サーバーサイドAPIを持たず、完全にクライアントサイドで完結するため、運用コストがゼロです。

## 5. 多言語ルーティング戦略

### URL構造
`preludiolab.com/[lang]/works/[[...slug]]`
(Catch-all Segmentにより、`works/bach/prelude-1` のような深い階層に対応)

### Static Generation
`generateStaticParams` 関数により、サポートされている全言語（7言語）× 全記事の組み合わせを事前に計算し、ビルド時にHTML化します。
存在しない言語やスラッグへのアクセスは `404 Not Found` となります。

## 6. 今後の拡張性
*   **MP3/Audio File Support:** 現在はYouTubeのみですが、ローカル音声ファイルへの対応もFrontmatterの拡張で可能です。
*   **Dynamic OGP:** `ogp_excerpt` を使用したビルド時のOGP画像生成（`vercel/og` 利用）を予定しています。
