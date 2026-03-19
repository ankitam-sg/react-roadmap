import { useState, useEffect } from "react";
import "./App.css"; // keep your existing CSS

export default function App() {

  // ----------------------------
  // State Management
  // ----------------------------

  // Controlled input for new task
  const [newTask, setNewTask] = useState("");

  // Task list state, persisted in localStorage
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  // Track which task is currently in edit mode
  const [editIndex, setEditIndex] = useState(null);

  // Temporary buffer for editing task text
  const [editValue, setEditValue] = useState("");

  // Persist tasks whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // ----------------------------
  // Handlers
  // ----------------------------

  // Add a new task
  const handleAddTask = () => {
    if (newTask.trim() === "") return;
    setTasks([...tasks, { text: newTask, done: false }]);
    setNewTask("");
  };

  // Delete a task
  const handleDelete = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  // Toggle task done/not done
  const handleToggle = (index) => {
    setTasks(
      tasks.map((task, i) =>
        i === index ? { ...task, done: !task.done } : task
      )
    );
  };

  // Save edited task
  const handleSave = (index) => {
    if (editValue.trim() === "") return;
    setTasks(
      tasks.map((task, i) =>
        i === index ? { ...task, text: editValue } : task
      )
    );
    setEditIndex(null);
    setEditValue("");
  };

  // Cancel editing
  const handleCancel = () => {
    setEditIndex(null);
    setEditValue("");
  };

  // ----------------------------
  // JSX
  // ----------------------------
  return (
    <div className="app-container">

      {/* App title */}
      <h2 className="app-title">☑️ My Todo List</h2>

      {/* Input section */}
      <div className="input-group">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
          title="Type your task here"
        />
        <button
          className="btn-primary"
          onClick={handleAddTask}
          disabled={newTask.trim() === ""}
          title="Add"
        >
          Add
        </button>
      </div>

      {/* Task list */}
      <ul className="task-list">
        {tasks.map((task, i) => (
          <li key={i} className="task-item">

            {/* Left column: checkbox + text */}
            <div className="task-left">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => handleToggle(i)}
                title={task.done ? "Mark as not done" : "Mark as done"}
              />

              {/* Show text or edit input */}
              {editIndex === i ? (
                <input
                  className="task-edit-input"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder="Edit task"
                  title="Editing task"
                />
              ) : (
                <span className={`task-text ${task.done ? "done" : ""}`}>
                  {task.text}
                </span>
              )}
            </div>

            {/* Right column: action buttons */}
            <div className="task-right">

              {/* Edit button */}
              {editIndex !== i && (
                <button
                  className="btn-icon"
                  onClick={() => { setEditIndex(i); setEditValue(task.text); }}
                  disabled={task.done}
                  title="Edit"
                >
                  ✏️
                </button>
              )}

              {/* Save & Cancel buttons appear only in edit mode */}
              {editIndex === i && (
                <>
                  <button
                    className="btn-icon"
                    onClick={() => handleSave(i)}
                    disabled={editValue.trim() === "" || editValue === task.text}
                    title="Save"
                  >
                    📂
                  </button>
                  <button
                    className="btn-icon"
                    onClick={handleCancel}
                    title="Cancel"
                  >
                    ❌
                  </button>
                </>
              )}

              {/* Delete button */}
              <button
                className="btn-icon"
                onClick={() => handleDelete(i)}
                disabled={task.done || editIndex === i}
                title="Delete"
              >
                🗑
              </button>

            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
