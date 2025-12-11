# UI/UX Requirements Definition (v1.0)

## 1. Design Philosophy
**"Timeless & Modern"**
クラシック音楽の普遍的な美しさを尊重しつつ、現代のWeb技術による機能美を追求する。

*   **Content First:** 楽譜と解説テキストが主役。装飾はノイズにならないよう最小限に留める。
*   **Academic but Accessible:** 専門的な信頼感（アカデミック）と、初心者への親しみやすさ（アクセシビリティ）を両立する。
*   **Motion with Meaning:** アニメーションは「文脈の理解」を助ける場合（例：再生位置のハイライト）にのみ使用し、過度な演出は避ける。

## 2. Design System (Tokens)

### [REQ-UI-001] Color Palette (REQ-UI-COLOR)
*   **[REQ-UI-001-01] Theme:** ライトモード/ダークモード対応必須。ハイコントラストで読みやすさを重視。
*   **[REQ-UI-001-02] Primary:** `Preludio Black` (墨色) - 重厚感のある黒。
*   **[REQ-UI-001-03] Background:** `Paper White` (生成り色) - 楽譜の紙のような、目に優しい白。
*   **[REQ-UI-001-04] Accent:** `Classic Gold` - リンクや重要アクションに使用。彩度を抑えた上品な金色。
*   **[REQ-UI-001-05] Semantic:** Error (Red), Success (Green) は色覚多様性に配慮した色味を選定する。

### [REQ-UI-002] Typography (REQ-UI-TYPO)
*   **[REQ-UI-002-01] Headings:** Serif (e.g., *Noto Serif*, *Playfair Display*) - 格調高さの表現。
*   **[REQ-UI-002-02] Body:** Sans-Serif (e.g., *Inter*, *Noto Sans*) - 長文の読みやすさとスクリーンでの可読性重視。
*   **[REQ-UI-002-03] Score Text:** ABC記法や歌詞には等幅フォントまたは専用フォントを使用。

## 3. Core Component UX

### [REQ-UI-003] Score Renderer (楽譜表示)
*   **Responsive Layout:**
    *   **[REQ-UI-003-01] Desktop:** 記事本文の横（2カラム）または中央配置。
    *   **[REQ-UI-003-02] Mobile:** 画面幅に合わせて自動リフロー、または横スクロール。ピンチズーム対応。
*   **[REQ-UI-003-03] Sync Highlight:** 再生中の小節や音符をリアルタイムでハイライト表示する視覚的フィードバック。

### [REQ-UI-004] Audio Player (再生機能)
*   **[REQ-UI-004-01] Floating Player:** スクロールしても常にアクセス可能な（または邪魔にならない）フローティングプレイヤー、あるいは最下部固定バー。
*   **[REQ-UI-004-02] Seamless State:** ページ遷移しても再生が途切れない（これはSPA/App Routerの利点を活かす）。

### [REQ-UI-005] Navigation & Discovery
*   **[REQ-UI-005-01] Global Navigation:**
    *   **Language Switcher:** 1クリックで即座に言語を切り替えるドロップダウンまたはボタン（詳細は`REQ-BIZ-GOAL-003`参照）。
    *   **Search:** 全文検索へのアクセス。
*   **[REQ-UI-005-02] Table of Contents:** 長文記事のための目次をサイドバーまたは上部に固定表示。
*   **[REQ-UI-005-03] Series Navigation:** シリーズ記事の場合、「前へ」「次へ」および「シリーズ目次」への導線を明示する。
*   **[REQ-UI-005-04] Hero Visual:** 記事トップに大きなサムネイル画像（Hero Image）と、重要メタデータ（作曲家、難易度）を配置し、視覚的な第一印象を強化する（`REQ-CONT-SCHEMA`対応）。

### [REQ-UI-006] Utilities & Compliance
*   **[REQ-UI-006-01] Loading State (Skeleton):** 楽譜描画などの重い処理中は、スピナーではなく「スケルトンスクリーン」を表示し、体感速度を向上させる（`REQ-NFR-002-03`対応）。
*   **[REQ-UI-006-02] Privacy Consent:** 初回訪問時、GDPR準拠のCookie同意バナーを表示し、同意されるまでYouTube等のサードパーティスクリプトをブロックする（`REQ-TECH-STACK-014`対応）。

## 4. Accessibility (A11y)
**Target:** WCAG 2.1 Level AA 準拠を目指す。

### [REQ-UI-007] Keyboard & A11y Support
*   **[REQ-UI-007-01] Keyboard Support:** 全てのインタラクションがキーボードのみで操作可能であること。
*   **[REQ-UI-007-02] Screen Reader:** 楽譜データ（ABC）は読み上げられない可能性があるため、代替テキスト（Alt）や構造化データによる解説を提供すること。
