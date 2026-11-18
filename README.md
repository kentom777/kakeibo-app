# わたしの家計簿 — AIエージェント開発の練習

## 準備
Node.js 22.12+ または24系LTSをインストールしてください。

```bash
npm install
npx playwright install chromium
npm run dev
```

http://127.0.0.1:5173 で開きます。

## 自動検証
```bash
npm run lint
npm run test
npm run build
npm run test:e2e
```

`npm run check` ですべてのチェックを実行できます。

## AIへの作業指示
AGENTS.mdを読み、計算ロジックと画面を分けた構造を維持してください。
AIコーディングツール（Codex / Claude Code / Cursorなど）のプロジェクトとして開き、`npm run check` を実行するよう依頼してください。

注意：データはlocalStorageに保存されます。端末間同期も銀行連携もありません。機密情報や実データの公開は避けてください。
