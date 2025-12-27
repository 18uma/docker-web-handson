const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 8000;

// ミドルウェア
app.use(cors());
app.use(express.json());

// Content-Typeのcharsetを明示的に設定
app.use((req, res, next) => {
  res.set('Content-Type', 'application/json; charset=utf-8');
  next();
});

// データベース接続設定
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'taskdb',
  port: process.env.DB_PORT || 3306,
  charset: 'utf8mb4'
};

// データベース接続
let db;
async function connectDB() {
  try {
    db = await mysql.createConnection({
      ...dbConfig,
      charset: 'utf8mb4'
    });
    // 文字セットを明示的に設定
    await db.execute('SET NAMES utf8mb4');
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    // DBなしでも起動できるようにする（Step1用）
    console.log('⚠️  Running without database connection');
  }
}

// ルート
app.get('/', (req, res) => {
  res.json({ 
    message: 'Task API is running!', 
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /tasks - Get all tasks',
      'POST /tasks - Create new task',
      'PUT /tasks/:id - Update task'
    ]
  });
});

// タスク一覧取得
app.get('/tasks', async (req, res) => {
  try {
    if (!db) {
      // DBなしの場合はダミーデータを返す
      return res.json([
        { id: 1, title: 'Learn Docker Basics', completed: false, created_at: new Date() },
        { id: 2, title: 'Create Dockerfile', completed: true, created_at: new Date() }
      ]);
    }
    
    const [rows] = await db.execute('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// タスク作成
app.post('/tasks', async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!db) {
      // DBなしの場合はダミーレスポンス
      return res.status(201).json({
        id: Date.now(),
        title,
        completed: false,
        created_at: new Date()
      });
    }

    const [result] = await db.execute(
      'INSERT INTO tasks (title, completed) VALUES (?, ?)',
      [title, false]
    );
    
    const newTask = {
      id: result.insertId,
      title,
      completed: false,
      created_at: new Date()
    };
    
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// タスク更新
app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    if (!db) {
      // DBなしの場合はダミーレスポンス
      return res.json({
        id: parseInt(id),
        title: 'Sample Task',
        completed: !!completed,
        created_at: new Date()
      });
    }

    await db.execute(
      'UPDATE tasks SET completed = ? WHERE id = ?',
      [completed, id]
    );
    
    const [rows] = await db.execute('SELECT * FROM tasks WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// サーバー起動
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  await connectDB();
});