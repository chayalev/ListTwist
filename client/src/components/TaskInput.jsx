import React, { useState } from "react";
import { MdOutlineAddTask } from "react-icons/md";
import { generateSchedule } from "../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../css/TaskInput.css";

const MySwal = withReactContent(Swal);

function TaskInput({ tasks, setTasks }) {
  const [task, setTask] = useState({
    name: "",
    duration: "30 minutes",
    time: "",
    priority: "Medium",
    day: new Date(),
  });
  const [showTimeInput, setShowTimeInput] = useState(false);
  const [personalInfo, setPersonalInfo] = useState(null);

  const showPersonalInfoAlert = async () => {
    const { value: formValues } = await MySwal.fire({
      title: "פרטים אישיים",
      html:
        '<label for="hobbies" style="float: right;">תחביבים:</label>' +
        '<input id="hobbies" type="text" class="swal2-input" placeholder="הכנס תחביבים, מופרדים בפסיק" style="text-align: right;" />' +
        '<label for="age" style="float: right;">גיל:</label>' +
        '<input id="age" type="number" class="swal2-input" placeholder="הכנס גיל" style="text-align: right;" />',
      focusConfirm: false,
      preConfirm: () => {
        const hobbiesInput = document.getElementById("hobbies").value;
        const age = document.getElementById("age").value;

        if (!hobbiesInput || !age) {
          Swal.showValidationMessage("יש למלא את כל השדות");
          return null;
        }

        // אם רוצים לפצל את התחביבים למערך
        const hobbiesArray = hobbiesInput.split(",").map(hobby => hobby.trim());

        // שינוי שם משתנה לשלוח את `hobbiesInput` ולא `hobbiesArray`
        return { hobbiesInput: hobbiesArray.join(", "), age }; // שלח את התחביבים כמערך שמפולל מחדש
      },
      confirmButtonText: "אישור",
      confirmButtonColor: "#0088cc",
      showCancelButton: false,
      allowOutsideClick: false,
    });

    if (formValues) {
      setPersonalInfo(formValues); // מאחסן את המידע (כולל את התחביבים כמערך ואת הגיל)
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value); // בדוק את הערכים שנכנסים
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
      if (!personalInfo) {
        console.error("פרטים אישיים לא הוזנו");
        Swal.fire("נא להזין פרטים אישיים לפני יצירת לוח זמנים!");
        return;
      }

      const response = await generateSchedule(tasks, personalInfo);
      setTasks([]);
      console.log("Schedule generated:", response);
    } catch (error) {
      console.error("Error generating schedule:", error);
    }
  };

  return (
    <div className="task-input-container">
      {/* תראה את ההודעה הקופצת רק אם לא הוזנו פרטים אישיים */}
      {!personalInfo && (
        <div className="personal-info-container">
          <button onClick={showPersonalInfoAlert} className="start-button">
            התחל להזין פרטים אישיים
          </button>
        </div>
      )}

      {personalInfo && (
        <div>
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
      )}
    </div>
  );
}

export default TaskInput;
