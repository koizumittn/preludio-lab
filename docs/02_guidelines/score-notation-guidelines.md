# Score Notation Guidelines (ABC Notation) (v1.0)

## 1. Syntax Standard
プロジェクト内で使用するABC記法 (`react-abc` / `verovio`) の標準仕様。

*   **Version:** ABC 2.1 Standard 準拠。
*   **Header Required:** `X:`, `T:`, `M:`, `L:`, `K:` は必須。
    *   `X:1` (Reference Number, always 1 for snippet)
    *   `T:` (Title, can be empty if not needed)

## 2. Layout & Styling (`%%` Directives)
可読性を高めるためのディレクティブ定義。

*   `%%score_system_on`: 譜表の連結を明示する。
*   `%%staffwidth 100%`: 横幅いっぱいに広げる。
*   `%%scale 0.7`: モバイル端末での視認性を考慮し、標準スケールを `0.7` に設定。

## 3. Musical Elements

### Chords (コードネーム)
*   **Position:** 音符の上に二重引用符 `"..."` で記述。
*   **Format:** Jazz Standard Style (e.g., `"Cm7"`, `"G7/B"`, `"F#dim"`).
*   **Avoid:** 難解なクラシック和声記号（I, V6, etc.）は本文で解説し、譜面上は一般的なコードネームを併記することを推奨。

### Dynamics & Expressions
*   **Dynamics:** `!p!`, `!ff!`, `!crescendo!` などの標準マクロを使用する。テキストで `"p"` と書かない。
*   **Slurs:** `( ... )` を使用。フレーズ感を明確にするため、積極的に記述する。

## 4. Example (Snippet)

```abc
X:1
T: Theme from Example
M: 4/4
L: 1/8
K: C
%%staffwidth 500
"C" c2 e2 g2 c'2 | "F" (a2 f2) c2 A2 | "G7" B2 d2 f2 g2 | "C" c4 z4 |]
```
