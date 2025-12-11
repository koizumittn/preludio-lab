# Application Layer Guidelines (src/application)

**ユーザーの意図（ユースケース）を表現するレイヤー。**
Domain層とUI層/Infra層の橋渡しを行う。

## ディレクトリ構成
*   `use-cases/`: 特定の操作を実行するクラス (e.g. `RegisterUserUseCase`)。
*   `dtos/`: 入出力データの定義 (Input/Output)。

## ルール
*   **Orchestration:** ここでは「処理の流れ」だけを記述する。具体的な計算はDomain層へ、DB操作はRepositoryへ委譲する。
*   **Clean:** 特定のWebフレームワーク(Next.js)やDB技術(Supabase)に依存しない形が望ましい。
