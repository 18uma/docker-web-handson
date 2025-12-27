# Step 3: データベースを追加する

## 🎯 このステップの目標

MySQLコンテナを追加して、本格的な3層構成を完成させましょう！

## 📝 課題

### 課題1: `database/init.sql` を作成してください

`database/init.sql` を作成して、テーブル作成と初期データ投入を行ってください：

```sql
-- データベースの作成
-- ヒント: CREATE DATABASE IF NOT EXISTS taskdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- ヒント: USE taskdb;

-- tasksテーブルの作成
-- ヒント: CREATE TABLE IF NOT EXISTS tasks (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   title VARCHAR(255) NOT NULL,
--   completed BOOLEAN DEFAULT FALSE,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- サンプルデータの挿入
-- ヒント: INSERT INTO tasks (title, completed) VALUES
-- ('Learn Docker Basics', true),
-- ('Create Dockerfile', true),
-- ('Use Docker Compose', false),
-- ('Add Database Container', false),
-- ('Complete the Application', false);

-- 確認用クエリ
-- ヒント: SELECT 'Database initialized successfully' as message;
-- ヒント: SELECT COUNT(*) as task_count FROM tasks;
```

### 課題2: `docker-compose.yml` にデータベースを追加してください

既存の `docker-compose.yml` のコメントアウト部分を参考に、以下を追加してください：

1. **backend サービス**に環境変数を追加
2. **database サービス**を追加
3. **volumes セクション**を追加

### 課題3: アプリケーションを起動してください

```bash
# 既存のコンテナを停止（もしあれば）
docker compose down

# 全サービスを起動
docker compose up --build
```

### 課題4: 動作確認してください

1. **データベースの初期化確認**
   ```bash
   docker compose logs database | grep "Database initialized successfully"
   ```

2. **バックエンドのデータベース接続確認**
   ```bash
   docker compose logs backend | grep "Database connected successfully"
   ```

3. **フロントエンドでの動作確認**
   - http://localhost:3000 にアクセス
   - 初期データとして5つのタスクが表示されることを確認

### 課題5: データ永続化の確認

1. 新しいタスクを追加
2. `docker compose down` で停止
3. `docker compose up -d` で再起動
4. 追加したタスクが残っていることを確認

## 🎉 成功の証拠

- 5つの初期タスクが表示される
- 新しいタスクを追加できる
- タスクの完了/未完了を切り替えできる
- 再起動後もデータが残っている

## 📚 詳細な説明

詳しい手順は [docs/step3-database.md](docs/step3-database.md) を参照してください。

## 🎉 完成おめでとうございます！

これで本格的なWebアプリケーションの開発環境が完成しました！

Docker / Docker Compose を使った3層構成のアプリケーションを構築できるようになりました。