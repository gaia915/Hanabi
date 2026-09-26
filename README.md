# 🎆 HANABI ARCHIVE（花火アーカイブ）

YouTube（通常動画・Shorts）やTikTokで公開されている日本全国の花火動画を自動収集・整理し、定期的に最新情報へと自動更新するキュレーションWebアプリケーションです。

---

## 🌟 主な機能と特徴

1. **マルチプラットフォーム自動収集**
   - **YouTube公式RSS**: APIキー不要＆レートリミットなし。公式チャンネル（長岡花火等）の最新動画を100%確実に取得。
   - **YouTube 4K検索 (yt-dlp)**: 「花火大会 4K」「大曲の花火」「隅田川花火」などの最新高画質映像を自動探索。ゲームや音楽カバーなどのノイズを自動除外するスマートフィルター搭載。
   - **TikTok連携**: TikTok公式 oEmbed API により、タイトル・投稿者・サムネイル・埋め込みプレーヤー情報を取得。
2. **洗練された花火＆ナイトスカイUI**
   - 夜空をイメージしたダークネイビー基調のモダンデザイン
   - カテゴリ別タブ（長岡まつり、大曲の花火、隅田川花火大会、全国大会など）
   - プラットフォーム絞り込み（YouTube / Shorts / TikTok）
   - タグフィルター（#4K, #フェニックス, #正三尺玉, #Shortsなど）
   - リアルタイムキーワード検索
   - お気に入り（ブックマーク）機能（ブラウザのLocalStorageに保存）
   - インライン＆モーダル動画再生（YouTube 埋め込み / TikTok 埋め込み）
3. **完全自動更新 (GitHub Actions Cron)**
   - サーバー維持費 **完全無料 (0円)**
   - 毎日自動で最新動画を巡回・取得し、リポジトリにコミット＆自動再デプロイ

---

## 🚀 クイックスタート (ローカルでの実行)

### 1. 依存ライブラリのインストール
```bash
# Node.js 依存関係
npm install

# Python 依存関係 (動画収集スクリプト用)
pip install -r scripts/requirements.txt
```

### 2. 最新花火動画の収集・更新
```bash
npm run update-data
# または: python scripts/update_videos.py
```
実行すると `data/sources.json` に基づき最新動画が収集され、`data/videos.json` および `src/data/videos.json` が更新されます。

### 3. ローカル開発サーバー起動
```bash
npm run dev
```
ブラウザで `http://localhost:5173/` にアクセスします。

---

## ⚙️ チャンネルや動画の追加・カスタマイズ

`data/sources.json` を編集することで、自由に収集対象を追加・変更できます。
Webサイト右上の「**ソース追加**」ボタンを押すと、入力フォームから設定JSONを自動生成できます。

```json
{
  "youtube_channels": [
    {
      "name": "長岡花火公式 (一般財団法人長岡花火財団)",
      "channel_id": "UCt7QSdNITWlwCqmBm99lQtw",
      "default_category": "長岡まつり大花火大会",
      "default_region": "新潟県"
    }
  ],
  "youtube_search_queries": [
    {
      "query": "花火大会 4K 絶景",
      "default_category": "全国有名花火大会",
      "max_results": 8
    }
  ],
  "tiktok_videos": [
    {
      "url": "https://www.tiktok.com/@fireworks_japan/video/7257912440156376322",
      "category": "全国有名花火大会",
      "region": "日本",
      "author_name": "Japan Fireworks"
    }
  ]
}
```

---

## ☁️ 無料公開・自動更新の設定手順 (GitHub Pages)

### ステップ 1: GitHubにリポジトリを作成してプッシュ
```bash
git init
git add .
git commit -m "feat: 初期コミット - 花火動画アーカイブ"
git branch -M main
git remote add origin https://github.com/<あなたのユーザー名>/<リポジトリ名>.git
git push -u origin main
```

### ステップ 2: GitHub Pages の設定
1. GitHubのリポジトリページを開き、「**Settings**」>「**Pages**」をクリック。
2. 「**Build and deployment**」の「Source」を **GitHub Actions** に設定。

### ステップ 3: 自動更新の確認
- リポジトリ内の `.github/workflows/auto_update.yml` により、毎日（00:00, 12:00 UTC）自動で最新動画が収集・コミットされます。
- GitHubの「**Actions**」タブから「**自動動画収集・最新情報更新**」を選び、「**Run workflow**」を押すことで、いつでも手動で即時更新することも可能です。

---

## 📁 ディレクトリ構成

```
Hanabi/
├── .github/workflows/
│   ├── auto_update.yml       # 定期更新 GitHub Actions (Cron & 自動コミット)
│   └── deploy.yml            # GitHub Pages 自動デプロイ
├── data/
│   ├── sources.json          # 収集ソース設定 (チャンネル、検索語、TikTok)
│   ├── videos.json           # 収集された全動画データベース
│   └── stats.json            # 集計統計データ (動画数、カテゴリ別内訳)
├── scripts/
│   ├── update_videos.py      # 動画収集・自動更新スクリプト
│   └── requirements.txt      # Python依存関係
├── src/
│   ├── components/           # UIコンポーネント (Header, Card, Modal, Filter等)
│   ├── data/                 # フロントエンド用データキャッシュ
│   ├── App.tsx               # メインアプリケーション
│   └── types.ts              # 型定義
├── index.html
├── package.json
└── vite.config.ts
```
