# Content Quality & Structure Requirements (v1.0)

## 1. Content Mission
**"The Gold Standard of Digital Program Notes"**
コンサートのプログラムノートよりも深く、専門書よりは読みやすい。
音楽の「構造」を理解することで、聴く喜びを倍増させる記事を目指す。

## 2. Article Structure Standard
全ての楽曲分析記事は、以下の構成に従うこと。

### [REQ-CONT-STR-001] Introduction (導入)
*   読者の興味を惹く「フック」を用意する（例：「なぜこの曲は"革命"と呼ばれるのか？」）。
*   楽曲の基本情報（調性、形式、作曲年）を簡潔に提示する。

### [REQ-CONT-STR-002] Historical Context (背景)
*   作曲家の人生における位置づけ。
*   初演時のエピソードや、当時の社会的背景。

### [REQ-CONT-STR-003] Structural Analysis (構造分析) - **CORE VALUE**
*   **Must:** 抽象的な感想ではなく、具体的な「小節数（Measure）」と「音楽用語」を用いて解説する。
*   **Must:** 重要なテーマや動機（Motif）については、必ず **ABC記法による譜面** を挿入する。
*   **Must (Audio Sync):** 譜面には、そのフレーズのYouTube再生時間（Start/End）をメタデータとして付与し、クリック再生可能にする。
*   **Level:** 専門用語（「ドミナント」「展開部」「偽終止」など）は使用するが、文脈から意味が推測できるように書く。

### [REQ-CONT-STR-005] File Naming Convention
*   **Rule:** コンテンツのファイル名は、別途定義する「命名規則ガイドライン」に厳格に従うこと。URL（Slug）とファイル名は一致させる。

### [REQ-CONT-STR-004] Listening Guide (聴きどころ)
*   理論がわからなくても楽しめる、直感的なポイント。
*   YouTube動画の具体的なタイムスタンプ（例: `03:45`）を提示し、プレーヤーと連動させる。

## 3. Editorial Guidelines

### Tone of Voice
*   **Enthusiastic but Objective:** 情熱的でありながら、事実に忠実であること。
*   **Global Neutral:** 特定の文化に依存しすぎる比喩は避け、翻訳しやすい平易なロジックで記述する。

### Multilingual Policy
*   **Source Language:** 原則として「日本語」をマスターデータとし、他言語へ展開する。
*   **Proper Nouns:** 人名・曲名は、各言語の一般的な表記に従う（例: Bach -> バッハ）。

## 4. Content Taxonomy
サイト内のコンテンツを以下のカテゴリに分類する。

*   **Work Analysis (楽曲解説):** 個別の楽曲の詳細分析。コアコンテンツ。
*   **Composer (作曲家):** 作曲家の生涯、スタイル、代表作の紹介。 (例: バッハ、ベートーヴェン)
*   **Theory (音楽の仕組み):** 形式（ソナタ形式など）、和声、記譜法などの理論解説。
*   **Era (時代様式):** 各時代（バロック、古典派、ロマン派など）の歴史的背景と様式の特徴。
*   **Instrument (楽器):** 楽器の歴史、構造、代表的なレパートリー。
*   **Performer (演奏家):** 指揮者、ソリスト、オーケストラのエピソードと名盤紹介。
*   **Terminology (用語集):** 独自辞書。楽語（Andante, Crescendoなど）の意味と演奏上の解釈。
*   **Column (コラム):** エッセイ、ニュース、特集記事（「映画の中のクラシック」など）。
*   **Originals (オリジナル作品):** 管理人（あなた）による自作曲の紹介と解説。PreludioLabだけの限定コンテンツ。

## 5. Series / Collections
複数のコンテンツを特定のテーマでグルーピングする機能。
*   **例:** 「ピアノ協奏曲名曲選」「バッハのオルガン作品全集」「初心者向け音楽理論コース」
*   **構造:** 1つのシリーズ記事が、複数の子記事（分析記事など）へのリンクを持つ目次的な役割を果たす。

## 6. Data Schema (MDX Frontmatter)

記事のメタデータは厳格に型定義する。

```yaml
---
title: "Prelude in C Major, BWV 846"
category: "Analysis" # Analysis, Composer, Theory, Instrument, Performer
series: "well-tempered-clavier-book1" # Optional: Series Slug
composer: "Johann Sebastian Bach"
work_id: "BWV 846"
key: "C Major"
difficulty: 2  # 1 (Beginner) to 5 (Virtuoso)
tags: ["Baroque", "Keyboard"]
date: "2025-12-09"
---
```
