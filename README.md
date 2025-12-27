# Step 2: Docker Composeを使う

## 🎯 このステップの目標

Docker Composeを使って、フロントエンドとバックエンドを同時に管理しましょう！

## 📝 課題

### 課題1: `docker-compose.yml` を作成してください

プロジェクトルートに `docker-compose.yml` を作成してください：

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

### 課題2: `frontend/Dockerfile` を作成してください

```dockerfile
# ベースイメージを指定
# ヒント: FROM node:18-alpine

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

### 課題3: アプリケーションを起動してください

```bash
docker compose up --build
```

### 課題4: 動作確認してください

ブラウザで以下にアクセス：
- **フロントエンド**: http://localhost:3000
- **バックエンド**: http://localhost:8000

## 🎉 成功の証拠

- フロントエンドでタスク管理画面が表示される
- 初期データとして2つのサンプルタスクが表示される
- 新しいタスクを追加できる（ダミーデータとして保存される）

## 📚 詳細な説明

詳しい手順は [docs/step2-compose.md](docs/step2-compose.md) を参照してください。

## 🚀 次のステップ

完了したら以下のコマンドで次のステップに進んでください：

```bash
git checkout exercise/step-3
```