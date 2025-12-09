# データスキーマ設計 (Data Schema Design)

## 1. Frontmatterスキーマ定義 (MDX)
全てのMDXコンテンツは、以下のZodスキーマ定義に従う必要がある。

```typescript
const ContentSchema = z.object({
  // Metadata (メタデータ)
  title: z.string().min(1),
  description: z.string().optional(), // SEO用メタディスクリプション
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  updatedAt: z.string().optional(),

  // Taxonomy (分類)
  category: z.enum([
    'work-analysis', // 楽曲解説
    'composer',      // 作曲家
    'theory',        // 音楽理論
    'era',           // 時代様式
    'instrument',    // 楽器
    'performer',     // 演奏家
    'terminology',   // 用語集
    'column',        // コラム
    'originals'      // オリジナル
  ]),
  tags: z.array(z.string()).optional(),
  
  // Series (Optional: シリーズ機能)
  series: z.string().optional(), // シリーズのSlug
  seriesOrder: z.number().optional(), // シリーズ内での順序

  // Music Specific (楽曲解説用の拡張フィールド)
  composer: z.string().optional(), // 例: "Johann Sebastian Bach"
  workId: z.string().optional(),   // 例: "BWV 846"
  key: z.string().optional(),      // 例: "C Major"
  difficulty: z.number().min(1).max(5).optional(), // 1:初級 〜 5:超絶技巧

  // Media (メディア連携)
  youtubeId: z.string().optional(), // メイン動画ID
});
```

## 2. ファイル構成 (File Organization)
採用案： `content/[lang]/[category]/[slug].mdx`
ファイルベースルーティングとローカライゼーションの管理を容易にするため、言語ディレクトリを最上位に置く。

ディレクトリ構成例:
```
content/
  ja/
    works/
      prelude-c-major.mdx
    composers/
      bach.mdx
  en/
    works/
      prelude-c-major.mdx
```

## 3. Taxonomy (分類)
詳細は `content-requirements.md` の [REQ-CONT-TAX-XXX] を参照。
