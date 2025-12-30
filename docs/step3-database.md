# Step 3: データベースを追加する

このステップでは、MySQLコンテナを追加して本格的な3層構成を完成させます。データの永続化についても学習します。

## 🎯 このステップの目標

- MySQLコンテナを追加できる
- ボリュームによるデータ永続化を理解する
- 3層構成（フロント・バック・DB）を完成させる
- 初期データの投入方法を学ぶ
- 再起動後もデータが残ることを確認する

---

## 📋 前提条件

- Step 2を完了している
- `exercise/step-3` ブランチをチェックアウト済み

```bash
git checkout exercise/step-3
```

---

## 🏗️ 今回の構成

```
[ ブラウザ ] ← http://localhost:3000
     ↓
[ フロントエンド コンテナ ]
  - React + TypeScript
  - ポート: 3000
     ↓ API通信
[ バックエンド コンテナ ]
  - Node.js + Express
  - ポート: 8000
     ↓ データベース接続
[ データベース コンテナ ]
  - MySQL 8.0
  - ポート: 3306
  - ボリューム: mysql_data
```

**重要**: この段階で初めて**本物のデータベース**を使用します！

---

## 📝 課題1: docker-compose.ymlにデータベースを追加

既存の `docker-compose.yml` にMySQLサービスを追加してください。

### ヒント（コメントを参考に作成してください）

```yaml
version: '3.8'

services:
  # フロントエンド (React)
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8000
    depends_on:
      - backend

  # バックエンド (Node.js + Express)
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    # ヒント: environment でデータベース接続情報を設定
    # - DB_HOST=database
    # - DB_USER=root
    # - DB_PASSWORD=password
    # - DB_NAME=taskdb
    # ヒント: depends_on でデータベースへの依存を設定

  # データベース (MySQL)
  # ヒント: database サービスを追加
  # - image: mysql:8.0
  # - ports: "3306:3306"
  # - environment: MYSQL_ROOT_PASSWORD, MYSQL_DATABASE
  # - volumes: データ永続化とinit.sqlマウント

# ヒント: volumes セクションでmysql_dataボリュームを定義
```

### 🤔 よくある失敗ポイント

**失敗例1: サービス名とDB_HOSTが一致していない**
```yaml
# ❌ 間違い
services:
  mysql:  # サービス名
    image: mysql:8.0
  backend:
    environment:
      - DB_HOST=database  # 違うホスト名
```

**正解:**
```yaml
# ✅ 正しい
services:
  database:  # サービス名
    image: mysql:8.0
  backend:
    environment:
      - DB_HOST=database  # サービス名と一致
```

---

## 📝 課題2: データベース初期化ファイルを作成

`database/init.sql` を作成して、テーブル作成と初期データ投入を行ってください。

### ヒント

```sql
-- データベースの作成
-- ヒント: CREATE DATABASE IF NOT EXISTS taskdb;
-- ヒント: USE taskdb;

-- tasksテーブルの作成
-- ヒント: CREATE TABLE tasks (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   title VARCHAR(255) NOT NULL,
--   completed BOOLEAN DEFAULT FALSE,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- サンプルデータの挿入
-- ヒント: INSERT INTO tasks (title, completed) VALUES
-- ('Dockerの基本を学ぶ', true),
-- ('Dockerfileを作成する', true),
-- ('Docker Composeを使う', false),
-- ('データベースを追加する', false),
-- ('アプリケーションを完成させる', false);
```

---

## 📝 課題3: バックエンドのデータベース接続を有効化

`backend/server.js` で、データベース接続部分のコメントアウトを解除してください。

### 確認ポイント

```javascript
// データベース接続設定
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'taskdb',
  port: process.env.DB_PORT || 3306
};

// この部分のコメントアウトを解除
// const db = await mysql.createConnection(dbConfig);
```

---

## 📝 課題4: アプリケーションを起動して動作確認

### 起動手順

```bash
# 既存のコンテナを停止（もしあれば）
docker compose down

# 全サービスを起動
docker compose up --build
```

### 🔍 確認方法

1. **データベースの初期化確認**
   ```bash
   # データベースのログを確認
   docker compose logs database
   
   # 「Database initialized successfully」が表示されることを確認
   ```

2. **バックエンドのデータベース接続確認**
   ```bash
   # バックエンドのログを確認
   docker compose logs backend
   
   # 「✅ Database connected successfully」が表示されることを確認
   ```

3. **フロントエンドでの動作確認**
   - http://localhost:3000 にアクセス
   - 初期データとして5つのタスクが表示されることを確認
   - 新しいタスクを追加できることを確認
   - タスクの完了/未完了を切り替えできることを確認

---

## 📝 課題5: データ永続化の確認

データベースのデータが永続化されているか確認してください。

### テスト手順

1. **新しいタスクを追加**
   - フロントエンドで「テスト用タスク」を追加

2. **アプリケーションを停止・再起動**
   ```bash
   docker compose down
   docker compose up -d
   ```

3. **データが残っているか確認**
   - http://localhost:3000 にアクセス
   - 追加した「テスト用タスク」が残っていることを確認

### 🎉 成功の証拠

再起動後も追加したタスクが表示されれば、データ永続化が正常に動作しています！

---

## 🔧 ボリュームとデータ永続化の理解

### ボリュームなしの場合

```
コンテナ停止 → データ消失 😱
```

### ボリュームありの場合

```
コンテナ停止 → データ保持 🎉
```

### ボリュームの仕組み

```yaml
services:
  database:
    volumes:
      # 名前付きボリューム（データ永続化）
      - mysql_data:/var/lib/mysql
      # バインドマウント（初期化ファイル）
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  mysql_data:  # Docker管理の永続ボリューム
```

---

## 🤔 よくある失敗とその対処法

### 失敗1: データベース接続エラー

**症状**: `Database connection failed: connect ECONNREFUSED`

**原因**: 
- データベースの起動が完了する前にバックエンドが接続を試行
- 接続情報（ホスト名、パスワードなど）が間違っている

**対処法**:
```bash
# データベースが完全に起動するまで待つ
docker compose logs database | grep "ready for connections"

# バックエンドを再起動
docker compose restart backend
```

### 失敗2: 初期データが投入されない

**症状**: テーブルは作成されるが、サンプルデータが入らない

**原因**: 
- init.sqlファイルのパスが間違っている
- SQLの構文エラー
- **ボリュームマウントが正しく設定されていない**

**対処法**:
```bash
# ボリュームを削除して完全に再作成
docker compose down -v
docker compose up --build

# init.sqlのパスを確認
# 正: ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
# 誤: ./init.sql:/docker-entrypoint-initdb.d/init.sql
```

### 失敗3: ボリューム関連エラー

**症状**: `volume "mysql_data" not found` エラー

**原因**: volumesセクションが定義されていない

**対処法**:
```yaml
# docker-compose.ymlの最後に追加
volumes:
  mysql_data:  # この定義が必要！
```

**ボリュームのデバッグコマンド:**
```bash
# ボリューム一覧確認
docker volume ls

# ボリュームの詳細確認
docker volume inspect docker-web-handson_mysql_data

# ボリュームを削除（データも削除される）
docker compose down -v
```

### 失敗3: ポート競合エラー

**症状**: `port 3306 is already allocated`

**原因**: ローカルのMySQLが既に3306ポートを使用している

**対処法**:
```bash
# ローカルMySQLを停止
sudo service mysql stop

# または、docker-compose.ymlでポートを変更
ports:
  - "3307:3306"  # ホスト側を3307に変更
```

---

## 🔧 便利なデータベース操作コマンド

### データベースに直接接続

```bash
# MySQLコンテナに接続
docker compose exec database mysql -u root -p

# パスワード入力後、SQLを実行可能
mysql> USE taskdb;
mysql> SELECT * FROM tasks;
mysql> exit
```

### データベースの状態確認

```bash
# データベースのログ確認
docker compose logs database

# データベースプロセス確認
docker compose exec database ps aux
```

### ボリュームの管理

```bash
# ボリューム一覧確認
docker volume ls

# ボリュームの詳細確認
docker volume inspect docker-web-handson_mysql_data

# ボリュームを削除（データも削除される）
docker compose down -v
```

---

## 🎓 このステップで学んだこと

✅ **3層構成の完成**
- フロントエンド、バックエンド、データベースの連携

✅ **データベースコンテナの管理**
- MySQLイメージの使用方法
- 環境変数による設定

✅ **データ永続化**
- ボリュームの概念と使い方
- 名前付きボリュームとバインドマウントの違い

✅ **初期データの投入**
- init.sqlによる自動初期化

✅ **サービス間の依存関係**
- depends_onによる起動順序制御

---

## 🎉 完成！おめでとうございます！

これで本格的なWebアプリケーションの開発環境が完成しました！

### 🚀 できるようになったこと

✅ **Docker / Docker Compose を使ってローカル開発環境を構築できる**
✅ **複数コンテナ（フロントエンド・バックエンド・DB）を連携させて起動できる**
✅ **Dockerfile と docker-compose.yml の役割を説明できる**
✅ **コンテナとホスト環境の違いを理解して説明できる**
✅ **「なぜDockerを使うのか」を自分の言葉で説明できる**

### 🎯 次のステップ（発展学習）

- **本番環境への展開**: AWS、GCP、Azureでの運用
- **CI/CD**: GitHub ActionsやJenkinsとの連携
- **監視・ログ**: Prometheus、Grafana、ELKスタック
- **セキュリティ**: イメージの脆弱性スキャン、シークレット管理
- **オーケストレーション**: Kubernetes入門

---

## 📚 参考資料

- [Docker公式ドキュメント](https://docs.docker.com/)
- [Docker Compose公式ドキュメント](https://docs.docker.com/compose/)
- [MySQL公式Dockerイメージ](https://hub.docker.com/_/mysql)

**🎉 Docker学習お疲れさまでした！実際のプロジェクトでもぜひ活用してください！**