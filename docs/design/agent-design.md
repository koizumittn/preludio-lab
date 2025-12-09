# エージェント設計 (AI Agent Design)

## 1. エージェントアーキテクチャ (Agent Architecture)
Ref: `technology-requirements.md` [REQ-TECH-010]
GitHub Actions上で動作する。

## 2. エージェント一覧 (Agent List)

### [AGENT-MUSIC] Musicologist (音楽学者)
*   **Role (役割):** 音楽理論と楽曲構造分析のエキスパート。
*   **Input (入力):**
    *   `work_name`: "Prelude in C Major BWV 846"
    *   `composer`: "Bach"
*   **Output (出力成果物):**
    *   `content/ja/works/[slug].mdx`: Frontmatterを含む完全な記事ファイル。
*   **Capabilities (能力):**
    *   主要なモチーフの抽出とABC記法による楽譜生成。
    *   YouTube Data APIを使用した最適な演奏動画の検索。
    *   和声や形式を平易な日本語で解説する。

### [AGENT-TRANS] Translator (翻訳者)
*   **Role (役割):** ローカライゼーションのスペシャリスト。
*   **Input (入力):**
    *   `source_file`: `content/ja/works/[slug].mdx`
    *   `target_lang`: `en` または `es`
*   **Output (出力):**
    *   `content/[target_lang]/works/[slug].mdx`
*   **Strategy (戦略):**
    *   テキスト本文は翻訳するが、**ABC記法とFrontmatterのキーは保持する**。
    *   Frontmatterの*値*（タイトル、説明文など）は翻訳する。

## 3. プロンプト構造 (RCICO)
Ref: `prompt-engineering-standard.md`

全てのプロンプトは **RCICO** パターンに従うこと：
1.  **R**ole (役割)
2.  **C**ontext (背景)
3.  **I**nstruction (指示)
4.  **C**onstraint (制約)
5.  **O**utput (出力形式)
