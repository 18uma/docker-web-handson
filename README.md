# Docker学習ハンズオン教材

Docker初心者向けの実践的な学習教材です。
実際に動くWebアプリケーションを通して、Dockerの基本概念と使い方を学びます。

## 🎯 学習目標

この教材を完了すると、以下ができるようになります：

- Docker / Docker Compose を使ってローカル開発環境を構築できる
- 複数コンテナ（フロントエンド・バックエンド・DB）を連携させて起動できる
- Dockerfile と docker-compose.yml の役割を説明できる
- コンテナとホスト環境の違いを理解して説明できる
- 「なぜDockerを使うのか」を自分の言葉で説明できる

## 🏗️ 構築するシステム

シンプルなタスク管理アプリケーションを構築します：

```
[ Browser ]
     ↓
[ Frontend (React + TypeScript) ]  ← ポート 3000
     ↓
[ Backend (Node.js + Express) ]    ← ポート 8000
     ↓
[ Database (MySQL) ]               ← ポート 3306
```

## 📚 学習ステップ

### [Step 0: 事前知識](docs/step0-overview.md)
- Dockerとは何か
- コンテナとホスト環境の違い
- 今回構築するシステムの全体像

### [Step 1: バックエンドをDockerで動かす](docs/step1-backend.md)
- Node.js用のDockerfileを作成
- `docker build` / `docker run` でコンテナ起動
- ブラウザからAPIにアクセス確認

### [Step 2: Docker Composeを使う](docs/step2-compose.md)
- docker-compose.ymlを作成
- フロントエンドとバックエンドを同時起動
- コンテナ間通信の設定

### [Step 3: データベースを追加する](docs/step3-database.md)
- MySQLコンテナを追加
- ボリュームでデータ永続化
- 3層構成の完成

## 🚀 クイックスタート（完成版）

```bash
# リポジトリをクローン
git clone <repository-url>
cd docker-web-handson

# 全サービスを起動
docker compose up -d

# ブラウザでアクセス
open http://localhost:3000
```

## 📋 前提条件

- Docker Desktop がインストール済み
- Git がインストール済み
- ブラウザ（Chrome, Firefox, Safari など）

## 🔧 各ステップでの学習方法

1. 対応するブランチをチェックアウト
   ```bash
   git checkout exercise/step-1
   ```

2. ステップのドキュメントを読む
   ```bash
   open docs/step1-backend.md
   ```

3. 課題に取り組む（ヒントはコメントに記載）

4. 動作確認を行う

## 🆘 トラブルシューティング

### よくある問題

- **ポートが使用中**: `docker compose down` で停止してから再実行
- **イメージが古い**: `docker compose build --no-cache` で再ビルド
- **データが消えた**: ボリューム設定を確認

### 完全リセット

```bash
# 全コンテナ・イメージ・ボリュームを削除
docker compose down -v
docker system prune -a
```

## 📖 参考資料

- [Docker公式ドキュメント](https://docs.docker.com/)
- [Docker Compose公式ドキュメント](https://docs.docker.com/compose/)

---

**🎉 楽しく学習して、Dockerマスターを目指しましょう！**