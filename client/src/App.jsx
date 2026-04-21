import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api/axios";
import "./App.css";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/todos");
      setTodos(res.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      }
      setError("Failed to load todos.");
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async () => {
    if (!title.trim()) return;
    try {
      await api.post("/todos", { title });
      setTitle("");
      fetchTodos();
    } catch (err) {
      setError("Failed to add todo.");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      fetchTodos();
    } catch (err) {
      setError("Failed to delete todo.");
    }
  };

  const startEdit = (todo) => {
    setEditId(todo.id);
    setEditTitle(todo.title);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
  };

  const updateTodo = async (id) => {
    if (!editTitle.trim()) return;
    try {
      await api.put(`/todos/${id}`, { title: editTitle });
      setEditId(null);
      setEditTitle("");
      fetchTodos();
    } catch (err) {
      setError("Failed to update todo.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="app-container">
      <div className="app-card">
        {/* Header */}
        <div className="app-header">
          <div>
            <h1 className="app-title">My Todos</h1>
            {user && <p className="app-welcome">Welcome, {user.name} 👋</p>}
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>

        {/* Error */}
        {error && <div className="app-error" onClick={() => setError("")}>{error} ×</div>}

        {/* Add Todo */}
        <div className="add-todo-row">
          <input
            id="new-todo-input"
            className="todo-input"
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
          <button id="add-todo-btn" className="add-btn" onClick={addTodo}>Add</button>
        </div>

        {/* Todo List */}
        <div className="todo-list">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your todos...</p>
            </div>
          ) : todos.length === 0 ? (
            <div className="empty-state">
              <span>📝</span>
              <p>No todos yet. Add one above!</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div key={todo.id} className="todo-item">
                {editId === todo.id ? (
                  <div className="todo-edit-row">
                    <input
                      className="todo-edit-input"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && updateTodo(todo.id)}
                      autoFocus
                    />
                    <button className="save-btn" onClick={() => updateTodo(todo.id)}>Save</button>
                    <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
                  </div>
                ) : (
                  <div className="todo-display-row">
                    <span className="todo-check">✓</span>
                    <p className="todo-title">{todo.title}</p>
                    <div className="todo-actions">
                      <button className="edit-btn" onClick={() => startEdit(todo)}>Edit</button>
                      <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {todos.length > 0 && (
          <p className="todo-count">{todos.length} task{todos.length !== 1 ? "s" : ""}</p>
        )}
      </div>
    </div>
  );
}
