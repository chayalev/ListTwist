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
        <label>הכנס משימה</label>
        <input
          type="text"
          name="name"
          // placeholder="הכנס משימה"
          value={task.name}
          onChange={handleChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>משך זמן</label>
        <input
          type="text"
          name="duration"
          // placeholder="Duration (e.g., 1h)"
          value={task.duration}
          onChange={handleChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>זמן משוער</label>
        <input
          type="text"
          name="time"
           placeholder="לא חובה"
          value={task.time}
          onChange={handleChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>עדיפות</label>
        <select
          name="priority"
          value={task.priority}
          onChange={handleChange}
          className="form-select"
        >
          <option value="High">גבוהה</option>
          <option value="Medium">בינונית </option>
          <option value="Low">נמוכה</option>
        </select>
      </div>
      <button onClick={addTask} className="add-task-button">
        <MdOutlineAddTask className="add-task-icon" /> הוספת משימה
      </button>
    </div>
  );
}

export default TaskInput;
