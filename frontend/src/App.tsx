import React, { useState, useEffect } from 'react';
import './App.css';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // タスク一覧を取得
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
      setError('');
    } catch (err) {
      setError('タスクの取得に失敗しました');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // タスクを作成
  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTaskTitle }),
      });
      
      if (!response.ok) throw new Error('Failed to create task');
      
      setNewTaskTitle('');
      fetchTasks(); // 一覧を再取得
    } catch (err) {
      setError('タスクの作成に失敗しました');
      console.error('Error creating task:', err);
    }
  };

  // タスクの完了状態を切り替え
  const toggleTask = async (id: number, completed: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }),
      });
      
      if (!response.ok) throw new Error('Failed to update task');
      
      fetchTasks(); // 一覧を再取得
    } catch (err) {
      setError('タスクの更新に失敗しました');
      console.error('Error updating task:', err);
    }
  };

  // 初回読み込み
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🐳 Docker学習 - タスク管理アプリ</h1>
        <p>Dockerで動いているWebアプリケーションです！</p>
      </header>

      <main className="App-main">
        {/* エラー表示 */}
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {/* タスク作成フォーム */}
        <form onSubmit={createTask} className="task-form">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="新しいタスクを入力..."
            className="task-input"
          />
          <button type="submit" className="add-button">
            追加
          </button>
        </form>

        {/* ローディング表示 */}
        {loading && <div className="loading">読み込み中...</div>}

        {/* タスク一覧 */}
        <div className="task-list">
          {tasks.length === 0 && !loading ? (
            <p className="no-tasks">タスクがありません。上のフォームから追加してください。</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id, task.completed)}
                  className="task-checkbox"
                />
                <span className="task-title">{task.title}</span>
                <span className="task-date">
                  {new Date(task.created_at).toLocaleDateString('ja-JP')}
                </span>
              </div>
            ))
          )}
        </div>

        {/* 接続状態表示 */}
        <div className="connection-status">
          <p>🔗 API接続先: {API_BASE_URL}</p>
          <p>📊 タスク数: {tasks.length}</p>
        </div>
      </main>
    </div>
  );
}

export default App;