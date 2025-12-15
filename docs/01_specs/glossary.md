# Glossary (用語集)

PreludioLabプロジェクトにおける「ユビキタス言語（Ubiquitous Language）」を定義します。
開発者、PM、AIエージェント間で、言葉の定義を統一するために使用します。

## Domain: Content & Music (音楽・コンテンツ)

| Term (En) | Term (Ja) | Description | Context / Usage |
| :--- | :--- | :--- | :--- |
| **Work** | 作品 | 楽曲そのもの（例：平均律クラヴィーア曲集 第1巻）。 | Metadata (Title, Op) |
| **Movement** | 楽章/曲 | 作品の中の個別の曲（例：プレリュード）。 | `work_id` vs `movement_id` |
| **Score** | 楽譜 | 視覚化された音符情報。ABC記法で記述される。 | `<ScoreRenderer />` |
| **Analysis** | 分析 | 楽曲構造や理論的背景の解説テキスト。 | Agent Output |

## Domain: System & Architecture (システム)

| Term (En) | Term (Ja) | Description | Context / Usage |
| :--- | :--- | :--- | :--- |
| **Frontmatter** | -- | MDXファイルの先頭にあるメタデータ領域。 | Blog Post |
| **Agent** | エージェント | 特定の役割（音楽学者、翻訳者）を持つAIプログラム。 | `agents/` |
| **Artifact** | 成果物 | エージェントが出力する最終ファイル（記事、画像）。 | `public/`, `content/` |
