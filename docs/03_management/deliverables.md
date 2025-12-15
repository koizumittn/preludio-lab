# Project Deliverables & Definition of Done

このドキュメントでは、各フェーズの「成果物」と、その「完了条件（Definition of Done）」を定義します。

## 1. 成果物一覧 (Deliverables Matrix)

| Phase | Category | Artifact ID | Description | Format | Owner |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **P0.5** | Guidelines | `DEL-GUIDE-001` | 開発・テスト・命名規則ガイドライン一式 | Markdown | PM |
| **P1** | Core Func | `DEL-CORE-SCORE` | 楽譜レンダリングコンポーネント (ScoreRenderer) | React Comp | Dev |
| **P1** | Core Func | `DEL-CORE-MDX` | 多言語MDXブログシステム | Next.js | Dev |
| **P2** | AI Agent | `DEL-AGENT-BACH` | バッハ楽曲分析レポート (Pilot) | MDX | Agt(Music) |
| **P2** | AI Agent | `DEL-AGENT-TRANS` | 上記の多言語翻訳記事 (5言語) | MDX | Agt(Trans) |

## 2. 完了の定義 (Definition of Done)

### コード実装 (Code Implementation)
- [ ] TypeScriptの型エラーがないこと (`Strict: true`)
- [ ] リントエラーがないこと (`ESLint`)
- [ ] ユニットテストが存在し、全てパスしていること (`Vitest`)
- [ ] 関連するドキュメント（JSDoc等）が更新されていること

### 記事コンテンツ (Content Article)
- [ ] 音楽理論的に正しい分析が含まれていること
- [ ] 楽譜（ABC記法）が正しくレンダリングされていること
- [ ] 指定された全言語（EN, ES, FR, DE, IT, ZH）に翻訳されていること
- [ ] OGP画像が設定されていること
- [ ] リンク切れがないこと

### AIエージェント (AI Agent)
- [ ] 指定された入力に対して、期待されるフォーマット（JSON/Markdown）で出力すること
- [ ] エラーハンドリング（API制限、パースエラー）が実装されていること
- [ ] 冪等性（同じ入力ならほぼ同じ結果、または許容範囲内の揺らぎ）が確認されていること
