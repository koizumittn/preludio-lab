# Prompt Engineering Standards (v1.0)

## 1. File Structure
`agents/src/prompts/*.ts` に配置するプロンプトファイルの構成。

```typescript
export const MUSICOLOGIST_PROMPT_V1 = `
# ROLE
You are...

# CONTEXT
...

# INSTRUCTIONS
...

# CONSTRAINTS
...

# OUTPUT FORMAT
...
`;
```

## 2. Prompt Components Strategy (RCICO)
プロンプトは以下の5要素（RCICO）を含まなければならない。

1.  **Role (役割):** 誰になりきるか。「あなたは世界的な音楽学者であり、教育者です。」
2.  **Context (背景):** 何のためのタスクか。「Webサイト PreludioLab の記事を作成しています。」
3.  **Instruction (指示):** 具体的に何をするか。「以下の楽曲について、構造分析を行ってください。」
4.  **Constraint (制約):** やってはいけないこと。「ハルシネーション（嘘）を出力しないこと。不明な点は不明と答えること。」
5.  **Output (形式):** JSONやMarkdownの厳格なスキーマ。「必ず以下のJSON形式で返答すること。」

## 3. Versioning
*   プロンプトの変更は、コードと同様にバージョン管理する。
*   大幅な変更時は変数名末尾の `_V1` を `_V2` にインクリメントし、比較検証可能にする。
