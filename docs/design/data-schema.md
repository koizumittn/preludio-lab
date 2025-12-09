# Data Schema Design (MDX & Taxonomy)

## 1. Frontmatter Schema (Zod Definition)

All MDX content must adhere to this schema.

```typescript
const ContentSchema = z.object({
  // Metadata
  title: z.string().min(1),
  description: z.string().optional(), // for SEO meta description
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  updatedAt: z.string().optional(),

  // Taxonomy
  category: z.enum([
    'work-analysis',
    'composer',
    'theory',
    'era',
    'instrument',
    'performer',
    'terminology',
    'column',
    'originals'
  ]),
  tags: z.array(z.string()).optional(),
  
  // Series (Optional)
  series: z.string().optional(), // Slug of the series
  seriesOrder: z.number().optional(), // Order within the series

  // Music Specific (for Work Analysis)
  composer: z.string().optional(), // e.g. "Johann Sebastian Bach"
  workId: z.string().optional(),   // e.g. "BWV 846"
  key: z.string().optional(),      // e.g. "C Major"
  difficulty: z.number().min(1).max(5).optional(), // 1:Beginner, 5:Virtuoso

  // Media
  youtubeId: z.string().optional(), // Main video ID
});
```

## 2. File Organization
`content/[category]/[slug]/index.mdx` (Colocated assets)
OR
`content/[category]/[slug].mdx`

**Decision:** `content/[lang]/[category]/[slug].mdx` to support simple file-based routing and localization co-location.

Example:
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

## 3. Taxonomy
Ref: `content-requirements.md` [REQ-CONT-TAX-XXX]
