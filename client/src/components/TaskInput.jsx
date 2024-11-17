import React, { useState } from "react";

function TaskInput({ tasks, setTasks }) {
  const [task, setTask] = useState({
    name: "",
    duration: "",
    location: "",
    priority: "Medium",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const addTask = () => {
    setTasks([...tasks, task]);
    setTask({ name: "", duration: "", location: "", priority: "Medium" });
  };

  return (
    <div>
      <h2>Add a Task</h2>
      <input
        type="text"
        name="name"
        placeholder="Task Name"
        value={task.name}
        onChange={handleChange}
      />
      <input
        type="text"
        name="duration"
        placeholder="Duration (e.g., 1h)"
        value={task.duration}
        onChange={handleChange}
      />
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={task.location}
        onChange={handleChange}
      />
      <select name="priority" value={task.priority} onChange={handleChange}>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button onClick={addTask}>Add Task</button>
    </div>
  );
}

export default TaskInput;
