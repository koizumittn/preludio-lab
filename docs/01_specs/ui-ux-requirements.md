# UI/UX Requirements Definition (v1.0)

## 1. Design Philosophy
**"Timeless & Modern"**
クラシック音楽の普遍的な美しさを尊重しつつ、現代のWeb技術による機能美を追求する。

*   **Content First:** 楽譜と解説テキストが主役。装飾はノイズにならないよう最小限に留める。
*   **Academic but Accessible:** 専門的な信頼感（アカデミック）と、初心者への親しみやすさ（アクセシビリティ）を両立する。
*   **Motion with Meaning:** アニメーションは「文脈の理解」を助ける場合（例：再生位置のハイライト）にのみ使用し、過度な演出は避ける。

## 2. Design System (Tokens)

### [REQ-UI-COLOR] Color Palette
*   **Theme:** ライトモード/ダークモード対応必須。ハイコントラストで読みやすさを重視。
*   **Primary:** `Preludio Black` (墨色) - 重厚感のある黒。
*   **Background:** `Paper White` (生成り色) - 楽譜の紙のような、目に優しい白。
*   **Accent:** `Classic Gold` - リンクや重要アクションに使用。彩度を抑えた上品な金色。
*   **Semantic:** Error (Red), Success (Green) は色覚多様性に配慮した色味を選定する。

### [REQ-UI-TYPO] Typography
*   **Headings:** Serif (e.g., *Noto Serif*, *Playfair Display*) - 格調高さの表現。
*   **Body:** Sans-Serif (e.g., *Inter*, *Noto Sans*) - 長文の読みやすさとスクリーンでの可読性重視。
*   **Score Text:** ABC記法や歌詞には等幅フォントまたは専用フォントを使用。

## 3. Core Component UX

### [REQ-UI-SCORE] Score Renderer (楽譜表示)
*   **Responsive Layout:**
    *   **Desktop:** 記事本文の横（2カラム）または中央配置。
    *   **Mobile:** 画面幅に合わせて自動リフロー、または横スクロール。ピンチズーム対応。
*   **Sync Highlight:** 再生中の小節や音符をリアルタイムでハイライト表示する視覚的フィードバック。

### [REQ-UI-AUDIO] Audio Player (再生機能)
*   **Floating Player:** スクロールしても常にアクセス可能な（または邪魔にならない）フローティングプレイヤー、あるいは最下部固定バー。
*   **Seamless State:** ページ遷移しても再生が途切れない（これはSPA/App Routerの利点を活かす）。

### [REQ-UI-NAV] Navigation
*   **Global Navigation:** 多言語切り替え、検索、カテゴリへのアクセスを容易に。
*   **Table of Contents:** 長文記事のための目次をサイドバーまたは上部に固定表示。

## 4. Accessibility (A11y)
**Target:** WCAG 2.1 Level AA 準拠を目指す。
*   **Keyboard Support:** 全てのインタラクションがキーボードのみで操作可能であること。
*   **Screen Reader:** 楽譜データ（ABC）は読み上げられない可能性があるため、代替テキスト（Alt）や構造化データによる解説を提供すること。
