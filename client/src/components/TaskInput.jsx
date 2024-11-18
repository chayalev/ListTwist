import React, { useState } from "react";
import { MdOutlineAddTask } from "react-icons/md";
import "../css/TaskInput.css";

function TaskInput({ tasks, setTasks }) {
  const [task, setTask] = useState({
    name: "",
    duration: "",
    time: "",
    priority: "Medium",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const addTask = () => {
    setTasks([...tasks, task]);
    setTask({ name: "", duration: "", time: "", priority: "Medium" });
  };

  return (
    <div className="task-input-container">
      {/* <h2 className="form-title">Add a Task</h2> */}
      <div className="form-group">
        <label>Task Name:</label>
        <input
          type="text"
          name="name"
          placeholder="Enter task name"
          value={task.name}
          onChange={handleChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Duration:</label>
        <input
          type="text"
          name="duration"
          placeholder="Duration (e.g., 1h)"
          value={task.duration}
          onChange={handleChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Time:</label>
        <input
          type="text"
          name="time"
          placeholder="Time (e.g., 9:00 AM)"
          value={task.time}
          onChange={handleChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Priority:</label>
        <select
          name="priority"
          value={task.priority}
          onChange={handleChange}
          className="form-select"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      <button onClick={addTask} className="add-task-button">
        <MdOutlineAddTask className="add-task-icon" /> Add Task
      </button>
    </div>
  );
}

export default TaskInput;
