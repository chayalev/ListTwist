// import React, { useState } from "react";
// import { MdOutlineAddTask } from "react-icons/md";
// import { generateSchedule } from "../services/api"
// import "../css/TaskInput.css";

// function TaskInput({ tasks, setTasks }) {
//   const [task, setTask] = useState({
//     name: "",
//     duration: "",
//     time: "",
//     priority: "Medium",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setTask({ ...task, [name]: value });
//   };

//   const addTask = () => {
//     setTasks([...tasks, task]);
//     setTask({ name: "", duration: "", time: "", priority: "Medium" });
//   };

//   const handleGenerateSchedule = async () => {
//     try {
//       const response = await generateSchedule(tasks);
//       // setSchedule(response.schedule);
//       // setTips(response.tips);
//     } catch (error) {
//       console.error("Error generating schedule:", error);
//     }
//   };


//   return (
//     <div className="task-input-container">
//       {/* <h2 className="form-title">Add a Task</h2> */}
//       <div className="form-group">
//         <label>הכנס משימה</label>
//         <input
//           type="text"
//           name="name"
//           // placeholder="הכנס משימה"
//           value={task.name}
//           onChange={handleChange}
//           className="form-input"
//         />
//       </div>
//       <div className="form-group">
//         <label>משך זמן</label>
//         <input
//           type="text"
//           name="duration"
//           // placeholder="Duration (e.g., 1h)"
//           value={task.duration}
//           onChange={handleChange}
//           className="form-input"
//         />
//       </div>
//       <div className="form-group">
//         <label>זמן משוער</label>
//         <input
//           type="text"
//           name="time"
//            placeholder="לא חובה"
//           value={task.time}
//           onChange={handleChange}
//           className="form-input"
//         />
//       </div>
//       <div className="form-group">
//         <label>עדיפות</label>
//         <select
//           name="priority"
//           value={task.priority}
//           onChange={handleChange}
//           className="form-select"
//         >
//           <option value="High">גבוהה</option>
//           <option value="Medium">בינונית </option>
//           <option value="Low">נמוכה</option>
//         </select>
//       </div>
//       <button onClick={addTask} className="add-task-button">
//         <MdOutlineAddTask className="add-task-icon" /> הוספת משימה
//       </button>
//       <button onClick={handleGenerateSchedule} className="generate-button">
//           Generate Schedule
//         </button>
//     </div>
//   );
// }

// export default TaskInput;

import React, { useState } from "react";
import { MdOutlineAddTask } from "react-icons/md";
import { generateSchedule } from "../services/api"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../css/TaskInput.css";

function TaskInput({ tasks, setTasks }) {
  const [task, setTask] = useState({
    name: "",
    duration: "30 minutes",
    time: "",
    priority: "Medium",
    day: new Date(),
  });
  const [showTimeInput, setShowTimeInput] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleDateChange = (date) => {
    setTask({ ...task, day: date });
  };

  const toggleTimeInput = () => {
    setShowTimeInput(!showTimeInput);
    if (!showTimeInput) {
      setTask({ ...task, time: "" }); // Reset time if input is hidden
    }
  };

  const addTask = () => {
    setTasks([...tasks, task]);
    setTask({
      name: "",
      duration: "30 minutes",
      time: "",
      priority: "Medium",
      day: new Date(),
    });
    setShowTimeInput(false); // Reset the time input toggle
  };
  const handleGenerateSchedule = async () => {
    try {
      const response = await generateSchedule(tasks);
      setTasks([]);
      // setSchedule(response.schedule);
      // setTips(response.tips);
    } catch (error) {
      console.error("Error generating schedule:", error);
    }
  };


  return (
    <div className="task-input-container">
      <h2 className="form-title">הוספת משימה</h2>
      <div className="form-group">
        <label>הכנס משימה</label>
        <input
          type="text"
          name="name"
          value={task.name}
          onChange={handleChange}
          className="form-input"
          placeholder="לדוגמה: ללמוד תכנות"
        />
      </div>

      <div className="form-group">
        <label>משך זמן</label>
        <select
          name="duration"
          value={task.duration}
          onChange={handleChange}
          className="form-select"
        >
          <option value="30 minutes">30 דקות</option>
          <option value="1 hour">שעה</option>
          <option value="1.5 hours">שעה וחצי</option>
          <option value="2 hours">שעתיים</option>
        </select>
      </div>

      <div className="form-group">
        <button onClick={toggleTimeInput} className="toggle-time-button">
          יש זמן מיוחד להתחלת המשימה?
        </button>
        {showTimeInput && (
          <input
            type="time"
            name="time"
            value={task.time}
            onChange={handleChange}
            className="form-input"
          />
        )}
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
          <option value="Medium">בינונית</option>
          <option value="Low">נמוכה</option>
        </select>
      </div>

      <div className="form-group">
        <label>בחר יום</label>
        <DatePicker
          selected={task.day}
          onChange={handleDateChange}
          minDate={new Date()} // מונע בחירת ימים שכבר עברו
          dateFormat="yyyy-MM-dd" // פורמט התאריך
          className="form-input"
          placeholderText="בחר תאריך"
        />
      </div>

      <button onClick={addTask} className="add-task-button">
        <MdOutlineAddTask className="add-task-icon" /> הוספת משימה
      </button>
      <button onClick={handleGenerateSchedule} className="generate-button">
        😏?מה הלו"ז שלך
      </button>
    </div>
  );
}

export default TaskInput;

