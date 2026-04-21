import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
const API_URL = "http://localhost:3000/api";
function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await axios.get(`${API_URL}/todos`);
      setIsLoading(false);
      setTodos(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const loadTodos = async () => {
      await fetchTodos();
    };
    loadTodos();
  }, []);

  const addTodo = async () => {
    if (!title) return;
    try {
      await axios.post(`${API_URL}/todos`, { title });
      setTitle("");
      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  }


  return <>
    <div>
      <h1>TODO APP</h1>

      <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="add todo" />
      <button onClick={addTodo}>Add</button>
      {isLoading ? (<p>Loading...</p>) :
        (todos.map((todo) => (
          <div key={todo.id}>
            <p>{todo.title}  </p>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>

          </div>
        )))
      }
    </div >
  </>;
}

export default App;
