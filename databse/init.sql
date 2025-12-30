-- データベースの作成
CREATE DATABASE IF NOT EXISTS taskdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE taskdb;

-- tasksテーブルの作成
CREATE TABLE IF NOT EXISTS tasks (
id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(255) NOT NULL,
completed BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- サンプルデータの挿入
INSERT INTO tasks (title, completed) VALUES
('Learn Docker Basics', true),
('Create Dockerfile', true),
('Use Docker Compose', false),
('Add Database Container', false),
('Complete the Application', false);

-- 確認用クエリ
SELECT 'Database initialized successfully' as message;
SELECT COUNT(*) as task_count FROM tasks;