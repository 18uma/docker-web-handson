# Step 1: バックエンドをDockerで動かす

このステップでは、Node.js + Express のバックエンドAPIをDockerコンテナで動かします。

## 🎯 このステップの目標

- Dockerfileの書き方を理解する
- `docker build` でイメージを作成できる
- `docker run` でコンテナを起動できる
- ポートフォワーディングを理解する
- ブラウザからAPIにアクセスできる

---

## 📋 前提条件

- Docker Desktop がインストール済み
- このリポジトリをクローン済み
- `exercise/step-1` ブランチをチェックアウト済み

```bash
git checkout exercise/step-1
```

---

## 🏗️ 今回の構成

```
[ ブラウザ ] ← http://localhost:8000
     ↓
[ バックエンド コンテナ ]
  - Node.js + Express
  - ポート: 8000
```

**注意**: この段階ではデータベースは使用せず、ダミーデータで動作します。

---

## 📝 課題1: Dockerfileを作成する

`backend/Dockerfile` を作成してください。

### ヒント（コメントを参考に作成してください）

```dockerfile
# ベースイメージを指定（Node.js 18のAlpine版を使用）
FROM node:18-alpine

# 作業ディレクトリを設定
# ヒント: WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
# ヒント: COPY package*.json ./

# 依存関係をインストール
# ヒント: RUN npm install

# アプリケーションのソースコードをコピー
# ヒント: COPY . .

# ポート8000を公開
# ヒント: EXPOSE 8000

# アプリケーションを起動
# ヒント: CMD ["npm", "start"]
```

### 🤔 よくある失敗ポイント

**失敗例1: COPYの順序が間違っている**
```dockerfile
# ❌ 間違い
COPY . .
RUN npm install
```

**正解:**
```dockerfile
# ✅ 正しい
COPY package*.json ./
RUN npm install
COPY . .
```

**理由**: package.jsonを先にコピーすることで、ソースコード変更時にnpm installをスキップできます（Dockerのレイヤーキャッシュ）。

---

## 📝 課題2: Dockerイメージをビルドする

Dockerfileからイメージを作成してください。

```bash
# backend ディレクトリに移動
cd backend

# イメージをビルド
docker build -t task-api .
```

### 🔍 確認方法

```bash
# イメージが作成されたか確認
docker images | grep task-api
```

### 🤔 よくある失敗ポイント

**失敗例: ビルドコンテキストが間違っている**
```bash
# ❌ 間違い（プロジェクトルートから実行）
docker build -t task-api backend/
```

**正解:**
```bash
# ✅ 正しい（backendディレクトリから実行）
cd backend
docker build -t task-api .
```

---

## 📝 課題3: コンテナを起動する

作成したイメージからコンテナを起動してください。

```bash
# コンテナを起動（ポート8000を公開）
docker run -p 8000:8000 task-api
```

### 🔍 確認方法

別のターミナルで以下を実行：

```bash
# APIの動作確認
curl http://localhost:8000

# タスク一覧の確認（ダミーデータが返される）
curl http://localhost:8000/tasks
```

### 🤔 よくある失敗ポイント

**失敗例1: ポートを公開していない**
```bash
# ❌ 間違い
docker run task-api
```
→ ブラウザからアクセスできない

**失敗例2: ポートマッピングが間違っている**
```bash
# ❌ 間違い
docker run -p 3000:8000 task-api
```
→ http://localhost:3000 でアクセスしてしまう

**失敗例3: ポートが使用中エラー**
```bash
# エラー: port is already allocated
docker run -p 8000:8000 task-api
```
→ 他のアプリが8000番ポートを使用中

**正解:**
```bash
# ✅ 正しい
docker run -p 8000:8000 task-api
# またはポート競合時は
docker run -p 8001:8000 task-api
```

---

## 📝 課題4: ブラウザで動作確認

ブラウザで以下のURLにアクセスして動作を確認してください：

1. **API情報**: http://localhost:8000
2. **タスク一覧**: http://localhost:8000/tasks

### 期待される結果

**http://localhost:8000**
```json
{
  "message": "Task API is running!",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "endpoints": [
    "GET /tasks - Get all tasks",
    "POST /tasks - Create new task", 
    "PUT /tasks/:id - Update task"
  ]
}
```

**http://localhost:8000/tasks**
```json
[
  {
    "id": 1,
    "title": "Sample Task 1",
    "completed": false,
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "title": "Sample Task 2", 
    "completed": true,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## 🔧 便利なDockerコマンド

### コンテナの管理

```bash
# 実行中のコンテナを確認
docker ps

# 全てのコンテナを確認（停止中も含む）
docker ps -a

# コンテナを停止
docker stop <コンテナID>

# コンテナを削除
docker rm <コンテナID>
```

### イメージの管理

```bash
# イメージ一覧を確認
docker images

# イメージを削除
docker rmi <イメージID>
```

### ログの確認

```bash
# コンテナのログを確認
docker logs <コンテナID>

# リアルタイムでログを確認
docker logs -f <コンテナID>
```

---

## 🎓 このステップで学んだこと

✅ **Dockerfileの基本的な書き方**
- FROM, WORKDIR, COPY, RUN, EXPOSE, CMD の使い方

✅ **docker build コマンド**
- Dockerfileからイメージを作成する方法

✅ **docker run コマンド**
- イメージからコンテナを起動する方法
- ポートフォワーディング（-p オプション）

✅ **コンテナとホストの違い**
- コンテナ内のアプリケーションにアクセスするにはポート公開が必要

---

## 🚀 次のステップ

単一コンテナでの基本操作ができるようになりました！

次は [Step 2: Docker Composeを使う](step2-compose.md) で、複数のコンテナを管理する方法を学びましょう。

フロントエンドとバックエンドを同時に起動して、本格的なWebアプリケーションを構築していきます。