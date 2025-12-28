# Step 2: Docker Composeを使う

このステップでは、Docker Composeを使って複数のコンテナ（フロントエンド・バックエンド）を同時に管理します。

## 🎯 このステップの目標

- Docker Composeの基本的な使い方を理解する
- docker-compose.ymlの書き方を学ぶ
- 複数コンテナを同時に起動・停止できる
- コンテナ間通信を理解する
- フロントエンドとバックエンドが連携したWebアプリを動かす

---

## 📋 前提条件

- Step 1を完了している
- `exercise/step-2` ブランチをチェックアウト済み

```bash
git checkout exercise/step-2
```

---

## 🏗️ 今回の構成

```
[ ブラウザ ] ← http://localhost:3000
     ↓
[ フロントエンド コンテナ ]
  - React + TypeScript
  - ポート: 3000
     ↓ API通信（コンテナ間通信）
[ バックエンド コンテナ ]
  - Node.js + Express  
  - ポート: 8000
```

**注意**: この段階でもデータベースは使用せず、バックエンドはダミーデータで動作します。

---

## 🤔 Docker Composeとは

### 従来の方法（Step 1）の問題点

```bash
# バックエンドを起動
cd backend
docker build -t task-api .
docker run -p 8000:8000 task-api

# 別のターミナルでフロントエンドを起動
cd frontend  
docker build -t task-frontend .
docker run -p 3000:3000 task-frontend
```

**問題:**
- 複数のコマンドを実行する必要がある
- コンテナ間の依存関係を管理できない
- 停止・再起動が面倒

### Docker Composeの解決策

```bash
# 一つのコマンドで全て起動
docker compose up

# 一つのコマンドで全て停止
docker compose down
```

**メリット:**
- 複数コンテナを一括管理
- 設定ファイル（docker-compose.yml）で構成を定義
- コンテナ間通信が自動で設定される

---

## 📝 課題1: docker-compose.ymlを作成する

プロジェクトルートに `docker-compose.yml` を作成してください。

### ヒント（コメントを参考に作成してください）

```yaml
version: '3.8'

services:
  # フロントエンド (React)
  frontend:
    # ヒント: build: ./frontend
    # ヒント: ports: - "3000:3000"
    # ヒント: environment: - REACT_APP_API_URL=http://localhost:8000
    # ヒント: depends_on: - backend

  # バックエンド (Node.js + Express)  
  backend:
    # ヒント: build: ./backend
    # ヒント: ports: - "8000:8000"
```

### 🤔 よくある失敗ポイント

**失敗例1: インデントが間違っている**
```yaml
# ❌ 間違い
services:
frontend:
  build: ./frontend
```

**正解:**
```yaml
# ✅ 正しい
services:
  frontend:
    build: ./frontend
```

**失敗例2: ポート番号が文字列になっていない**
```yaml
# ❌ 間違い
ports:
  - 3000:3000
```

**正解:**
```yaml
# ✅ 正しい
ports:
  - "3000:3000"
```

---

## 📝 課題2: フロントエンドのDockerfileを作成する

`frontend/Dockerfile` を作成してください。

### ヒント

```dockerfile
# ベースイメージを指定
FROM node:18-alpine

# 作業ディレクトリを設定
# ヒント: WORKDIR /app

# package.jsonをコピーして依存関係をインストール
# ヒント: COPY package*.json ./
# ヒント: RUN npm install

# ソースコードをコピー
# ヒント: COPY . .

# ポート3000を公開
# ヒント: EXPOSE 3000

# 開発サーバーを起動
# ヒント: CMD ["npm", "start"]
```

---

## 📝 課題3: アプリケーションを起動する

Docker Composeを使ってアプリケーション全体を起動してください。

```bash
# プロジェクトルートで実行
docker compose up --build
```

### 🔍 確認方法

1. **フロントエンド**: http://localhost:3000
2. **バックエンド**: http://localhost:8000

### 期待される結果

- フロントエンドでタスク管理画面が表示される
- 初期データとして2つのサンプルタスクが表示される
- 新しいタスクを追加できる（ダミーデータとして保存される）

---

## 🔧 コンテナ間通信の理解

### 重要な概念

Docker Composeでは、各サービス（コンテナ）は**サービス名**で相互に通信できます。

```yaml
services:
  frontend:
    # フロントエンドから見ると...
    environment:
      # ブラウザからは localhost:8000 でアクセス
      - REACT_APP_API_URL=http://localhost:8000
  
  backend:
    # バックエンドのサービス名は "backend"
    # 他のコンテナからは "backend:8000" でアクセス可能
```

### ネットワークの仕組み

```
ホスト環境（あなたのPC）
├── localhost:3000 → frontend コンテナ
├── localhost:8000 → backend コンテナ
└── Docker内部ネットワーク
    ├── frontend ←→ backend（サービス名で通信）
    └── 自動で作成される
```

---

## 📝 課題4: 動作確認とテスト

### 基本動作の確認

1. **フロントエンド画面の確認**
   - http://localhost:3000 にアクセス
   - タスク管理画面が表示されることを確認

2. **API通信の確認**
   - 新しいタスクを追加してみる
   - タスクの完了/未完了を切り替えてみる

3. **バックエンドAPIの直接確認**
   - http://localhost:8000/tasks にアクセス
   - JSONデータが返されることを確認

### ログの確認

```bash
# 全サービスのログを確認
docker compose logs

# 特定サービスのログを確認
docker compose logs frontend
docker compose logs backend

# リアルタイムでログを確認
docker compose logs -f
```

---

## 🔧 便利なDocker Composeコマンド

### 基本操作

```bash
# バックグラウンドで起動
docker compose up -d

# 停止
docker compose down

# 再ビルドして起動
docker compose up --build

# 特定サービスのみ起動
docker compose up frontend
```

### 状態確認

```bash
# 実行中のサービス確認
docker compose ps

# サービスの状態確認
docker compose top
```

### 個別操作

```bash
# 特定サービスを再起動
docker compose restart backend

# 特定サービスでコマンド実行
docker compose exec frontend sh
```

---

## 🤔 よくある失敗とその対処法

### 失敗1: フロントエンドがAPIに接続できない

**症状**: フロントエンドは表示されるが、タスクデータが取得できない

**原因**: 
- バックエンドが起動していない
- ポート設定が間違っている
- 環境変数の設定が間違っている
- **depends_onが設定されていない**

**対処法**:
```bash
# バックエンドの状態を確認
docker compose logs backend

# 環境変数を確認
docker compose config

# depends_onが設定されているか確認
```

**depends_onの重要性:**
- なし: フロントエンドが先に起動し、APIエラー発生
- あり: バックエンドの起動後にフロントエンドが起動

### 失敗2: ポートが使用中エラー

**症状**: `port is already allocated` エラー

**原因**: 他のプロセスが同じポートを使用している

**対処法**:
```bash
# ポートを使用しているプロセスを確認
lsof -i :3000
lsof -i :8000

# 必要に応じてプロセスを停止
kill -9 <PID>
```

### 失敗3: イメージのビルドエラー

**症状**: `docker compose up` でビルドが失敗する

**対処法**:
```bash
# キャッシュをクリアして再ビルド
docker compose build --no-cache

# 個別にビルドしてエラーを特定
docker compose build frontend
docker compose build backend
```

---

## 🎓 このステップで学んだこと

✅ **Docker Composeの基本**
- docker-compose.ymlの書き方
- 複数コンテナの一括管理

✅ **コンテナ間通信**
- サービス名による通信
- 内部ネットワークの仕組み

✅ **環境変数の設定**
- コンテナ間での設定の受け渡し

✅ **依存関係の管理**
- depends_onによる起動順序制御

---

## 🚀 次のステップ

複数コンテナの管理ができるようになりました！

次は [Step 3: データベースを追加する](step3-database.md) で、MySQLコンテナを追加して本格的な3層構成を完成させましょう。

データの永続化とボリュームの概念も学習します。