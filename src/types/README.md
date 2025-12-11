# Types Directory Guidelines (Domain Layer)

このディレクトリは **ドメインエンティティ** とインターフェースを定義する場所です。
プロジェクトにおける「共通言語」となります。

## 責務 (Responsibilities)
*   **Entities:** `Score`, `User`, `Composer` などのデータ型。
*   **Interfaces:** `ContentRepository`, `AuthService` などの抽象インターフェース。

## ルール (DOs)
*   **DO** `interface` または `type` 定義を使用する。
*   **DO** 厳格な型定義を行う。

## 禁止事項 (DON'Ts)
*   **DON'T** 実装ロジック（関数の中身）を含めない。型定義のみにする。
*   **DON'T** `src/app` や `src/components` から import しない（UI層への依存禁止）。
