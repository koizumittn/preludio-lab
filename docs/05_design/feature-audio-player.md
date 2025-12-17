# Audio Player Feature Design Specification

**Ref:** `REQ-TECH-AUDIO` (technology-requirements.md) / `REQ-UI-004` (ui-ux-requirements.md)

## 1. Overview
Preludio Labにおける「Audio Player」は、ユーザーが楽譜を閲覧しながら直感的に演奏を確認できる学習支援機能です。
ページ遷移しても再生が途切れない「Persistent Player（常駐型プレイヤー）」として設計されています。

## 2. Architecture Pattern (Headless UI & Wrapper)

実装とUIを完全に分離するため、**Headless UI** パターンと **Wrapper Pattern** を採用しています。

```mermaid
graph TD
    subgraph UI_Layer [UI Layer]
        Context[AudioPlayerContext<br>(Global State)]
        Mini[MiniPlayer<br>(Footer UI)]
        Focus[FocusPlayer<br>(Fullscreen UI)]
    end

    subgraph Feature_Layer [Feature Layer]
        Wrapper[YouTubePlayerClientWrapper<br>(SSR Guard)]
        Renderer[YouTubePlayerRenderer<br>(Logic Implementation)]
    end

    subgraph Infrastructure [Infrastructure]
        Lib[react-youtube]
        API[YouTube IFrame API]
    end

    %% Flow
    Context <-->|Sync State| Mini
    Context <-->|Sync State| Focus
    Context <-->|Control / Events| Renderer
    
    Wrapper --> Renderer
    Renderer --> Lib
    Lib --> API
```

### 2.1. Wrapper Pattern
`react-youtube` などの外部ライブラリは `window` オブジェクトに依存するため、そのままServer Componentで使用するとビルドエラーになります。
これを防ぐため、`YouTubePlayerClientWrapper` で `next/dynamic` (`ssr: false`) を使用し、クライアントサイドでの実行を保証しています。

## 3. State Management (AudioPlayerContext)

アプリケーション全体で単一の「再生状態」を共有します。

| State | Type | Description |
| :--- | :--- | :--- |
| `isPlaying` | `boolean` | 再生中か否か。Contextが真の値を持ち、Player実体はこれに追従します。 |
| `videoId` | `string | null` | 現在ロードされているYouTube動画ID。 |
| `currentTime` | `number` | 現在の再生位置（秒）。Playerからポーリングで更新されます。 |
| `duration` | `number` | 動画の総再生時間（秒）。 |
| `mode` | `'hidden' \| 'mini' \| 'focus'` | プレイヤーの表示モード。 |
| `volume` | `number` | 音量 (0-100)。 |

## 4. Component Specifications

### 4.1. YouTubePlayer (`src/components/features/player/`)
*   **Role:** 音声再生エンジン。画面上は 1px × 1px の不可視領域として存在します。
*   **Behavior:**
    *   `Context.isPlaying` の変化を `useEffect` で監視し、APIに対して `playVideo()` / `pauseVideo()` を発行します。
    *   `setInterval` (500ms) で再生時間をポーリングし、Contextに通知します。
    *   YouTube APIのイベント (`onReady`, `onStateChange`) をフックし、動画のロード完了や終了をContextに伝えます。

### 4.2. MiniPlayer (`src/components/ui/Player/MiniPlayer.tsx`)
*   **Role:** 常駐型の簡易コントローラー。
*   **UI Specs:**
    *   画面下部に固定配置 (`fixed bottom-0`)。
    *   再生/停止ボタン、タイトル、進捗プログレスバーを表示。
    *   タップ/クリックで `Focus Mode` へ展開。
    *   モバイル端末の "Thumb Zone" (親指操作エリア) を意識したレイアウト。

### 4.3. FocusPlayer (`src/components/ui/Player/FocusPlayer.tsx`)
*   **Role:** 詳細操作と没入感のための全画面モード。
*   **UI Specs:**
    *   画面全体を覆うモーダル (`fixed inset-0`)。
    *   シークバー（スライダー）による任意位置へのジャンプ。
    *   「最小化」ボタンで Mini Player に戻る。

## 5. Integration (Root Layout)
ページ遷移による再レンダリング（リセット）を防ぐため、`src/app/[lang]/layout.tsx` の最上位レベルに配置されています。

```tsx
<AppProviders>
    {/* ...Header... */}
    <main>{children}</main>
    {/* ...Footer... */}
    
## 6. User Interaction & UX

ユーザー視点での操作フローと挙動の定義。

### 6.1. 再生開始 (Entry Points)
ユーザーは以下のいずれかのアクションで再生を開始できます。
1.  **楽曲ページ上の再生ボタン:** 記事ヘッダーや、楽譜の特定箇所にある「Play」ボタンをクリック。
    *   *Behavior:* プレイヤーが非表示の場合は `Mini Mode` で下部に出現し、即座に再生を開始します。

### 6.2. プレイヤーの操作 (Controls)
*   **Mini Player (常駐モード):**
    *   **再生/一時停止:** 中央のボタンでトグル操作。
    *   **拡大:** バー領域全体（またはExpandボタン）をクリックすると `Focus Mode` へ遷移。
    *   **表示情報:** 曲名、作曲者名、簡易プログレスバー。
*   **Focus Player (全画面モード):**
    *   **シーク:** プログレスバーをドラッグして任意の位置へ移動。
    *   **最小化:** 「⌄」ボタンで `Mini Mode` へ戻る（再生は継続）。
    *   **表示情報:** 大きなジャケット画像、詳細なタイムスタンプ。

### 6.3. ページ遷移時の挙動 (Persistence)
*   **シームレスな再生:** ユーザーがサイト内を回遊（例: 楽曲ページ → トップページ → Aboutページ）しても、プレイヤーは途切れずに再生を続けます。
*   **状態維持:** プレイヤーのモード（Mini/Focus）や音量は、ページ遷移後も保持されます。

