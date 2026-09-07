import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const API_URL = import.meta.env.VITE_API_URL || "";

function App() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("Loading...");
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/tasks`)
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
        setStatus("Backend Connected");
      })
      .catch(() => {
        setStatus("Backend Connection Failed");
      });
  }, []);

  return (
    <div style={{
      fontFamily: "Arial",
      maxWidth: "800px",
      margin: "50px auto",
      padding: "20px"
    }}>
      <h1>Task 10 CI/CD Application</h1>

      <p>
        Backend Status: <strong>{status}</strong>
      </p>

      <input
        type="text"
        placeholder="Enter task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button style={{ marginLeft: "10px" }}>
        Add Task
      </button>

      <h2>Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              {task.title} — {task.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
