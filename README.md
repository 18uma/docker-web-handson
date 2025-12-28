# Step 1: バックエンドをDockerで動かす

## 🎯 このステップの目標

Node.js + Express のバックエンドAPIをDockerコンテナで動かしましょう！

## 📝 課題

### 課題1: `backend/Dockerfile` を作成してください

以下のヒントを参考に、`backend/Dockerfile` を作成してください：

```dockerfile
# ベースイメージを指定（Node.js 18のAlpine版を使用）
# ヒント: FROM node:18-alpine

# 作業ディレクトリを設定
# ヒント: WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
# ヒント: COPY package*.json ./

# 依存関係をインストール
# ヒント: RUN npm install

# アプリケーションのソースコードをコピー
# ヒント: COPY . .

# ポート8000を公開
# EXPOSEは「このコンテナは8000番ポートを使用します」という情報を記録するコマンド
# ❗ 注意: EXPOSEだけではホストからアクセスできません！
# 実際のポート公開は docker run の -p オプションで行います
EXPOSE 8000

# アプリケーションを起動
# ヒント: CMD ["npm", "start"]
```

### 課題2: イメージをビルドしてください

**「イメージ」とは？**
Dockerイメージは、アプリケーションとその実行環境をパッケージ化したテンプレートです。
- 📦 **イメージ** = アプリ + 実行環境のテンプレート（設計図）
- 🏃 **コンテナ** = イメージから作られた実行中のインスタンス

```bash
# backend ディレクトリに移動
cd backend

# Dockerfileからイメージを作成
# -t task-api: イメージに「task-api」という名前を付ける
# . : 現在のディレクトリ（backend）をビルドコンテキストとして使用
docker build -t task-api .
```

**ビルド中に何が起こっているか：**
1. Node.js 18のベースイメージをダウンロード
2. /app ディレクトリを作成
3. package.json をコピーして npm install を実行
4. アプリケーションコードをコピー
5. 最終的なイメージを作成

### 課題3: コンテナを起動してください

```bash
# コンテナを起動（ポート8000を公開）
# -p 8000:8000 の意味:
#   ホストの8000番:コンテナの8000番 を接続
docker run -p 8000:8000 task-api
```

**ポートフォワーディングの仕組み:**
```
あなたのPC（ホスト）     Dockerコンテナ
┌─────────────────┐     ┌─────────────────┐
│ localhost:8000 │ →→→ │ アプリ:8000    │
└─────────────────┘     └─────────────────┘
```

### 😨 ポートが使用中の場合の対処法

**エラー例:** `port is already allocated` または `address already in use`

**原因:** 他のアプリケーションが既に8000番ポートを使用中

**対処法:**

1. **使用中のプロセスを確認**
   ```bash
   # macOS/Linux
   lsof -i :8000
   
   # Windows
   netstat -ano | findstr :8000
   ```

2. **別のポートを使用**
   ```bash
   # ホスト側を8001番に変更
   docker run -p 8001:8000 task-api
   
   # アクセス先: http://localhost:8001
   ```

3. **使用中のプロセスを停止（注意して実行）**
   ```bash
   # PIDを確認してから停止
   kill -9 <PID>
   ```

### 課題4: 動作確認してください

ブラウザで以下にアクセス：
- http://localhost:8000
- http://localhost:8000/tasks

## 🎉 成功の証拠

以下のJSONが表示されれば成功です：

**http://localhost:8000/tasks**
```json
[
  {
    "id": 1,
    "title": "Learn Docker Basics",
    "completed": false,
    "created_at": "..."
  },
  {
    "id": 2,
    "title": "Create Dockerfile", 
    "completed": true,
    "created_at": "..."
  }
]
```

## 📚 詳細な説明

詳しい手順は [docs/step1-backend.md](docs/step1-backend.md) を参照してください。

## 🚀 次のステップ

完了したら以下のコマンドで次のステップに進んでください：

```bash
git checkout exercise/step-2
```