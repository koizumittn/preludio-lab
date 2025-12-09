# Agent Design (AI Infrastructure)

## 1. Agent Architecture
Ref: `technology-requirements.md` [REQ-TECH-010]
Running on GitHub Actions.

## 2. Agent List

### [AGENT-MUSIC] Musicologist (音楽学者)
*   **Role:** Expert in music theory and structural analysis.
*   **Input:**
    *   `work_name`: "Prelude in C Major BWV 846"
    *   `composer`: "Bach"
*   **Output (Artifact):**
    *   `content/ja/works/[slug].mdx`: Full article with Frontmatter.
*   **Capabilities:**
    *   Extract key motifs and generate ABC notation.
    *   Search YouTube for the best performance (using Data API).
    *   Explain harmony and form in plain Japanese.

### [AGENT-TRANS] Translator (翻訳者)
*   **Role:** Localization specialist.
*   **Input:**
    *   `source_file`: `content/ja/works/[slug].mdx`
    *   `target_lang`: `en` or `es`
*   **Output:**
    *   `content/[target_lang]/works/[slug].mdx`
*   **Strategy:**
    *   Translate text content but **keep ABC notation and Frontmatter keys intact**.
    *   Translate Frontmatter *values* (e.g. title, description), but not keys.

## 3. Prompt Structure (RCICO)
Ref: `prompt-engineering-standard.md`

All prompts must follow the **RCICO** pattern:
1.  **R**ole (役割)
2.  **C**ontext (背景)
3.  **I**nstruction (指示)
4.  **C**onstraint (制約)
5.  **O**utput (出力形式)
