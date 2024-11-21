import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Ensure you import Routes and Route
import TaskInput from "./components/TaskInput";
import ScheduleView from "./components/ScheduleView";
import BonusTips from "./components/BonusTips";
import LandingPage from "./components/LandingPage";
import { generateSchedule } from "./services/api";
import "./css/App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [tips, setTips] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    // Check if user is already authenticated
    const tokens = localStorage.getItem('googleTokens'); // If tokens are saved from a previous session
    if (tokens) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleGenerateSchedule = async () => {
    try {
      const response = await generateSchedule(tasks);
      setSchedule(response.schedule);
      setTips(response.tips);
    } catch (error) {
      console.error("Error generating schedule:", error);
    }
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/google/callback/task-input" element={<TaskInput tasks={tasks} setTasks={setTasks} />} />
          {/* <Route path="/task-input" element={isAuthenticated ? <TaskInput tasks={tasks} setTasks={setTasks} /> : <LandingPage />} /> */}
          <Route path="/schedule" element={schedule && <ScheduleView schedule={schedule} />} />
          <Route path="/tips" element={tips && tips.length > 0 && <BonusTips tips={tips} />} />
        </Routes>

        <button onClick={handleGenerateSchedule} className="generate-button">
          Generate Schedule
        </button>
      </div>
    </Router>
  );
}

export default App;


// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
// import TaskInput from "./components/TaskInput";
// import ScheduleView from "./components/ScheduleView";
// import BonusTips from "./components/BonusTips";
// import LandingPage from "./components/LandingPage";
// import { generateSchedule } from "./services/api";
// import "./css/App.css";

// function App() {
//   const [tasks, setTasks] = useState([]);
//   const [schedule, setSchedule] = useState(null);
//   const [tips, setTips] = useState([]);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const navigate = useNavigate(); // הוספת useNavigate עבור ניווט

//   useEffect(() => {
//     // אם המשתמש כבר מחובר, ננווט לעמוד הוספת המשימה
//     const tokens = localStorage.getItem('googleTokens'); // אם נשמרו טוקנים מקודם
//     if (tokens) {
//       setIsAuthenticated(true);
//       navigate("/task-input");  // ניווט אוטומטי לדף ה-task-input אם המשתמש מחובר
//     }
//   }, [navigate]);

//   const handleGenerateSchedule = async () => {
//     try {
//       const response = await generateSchedule(tasks);
//       setSchedule(response.schedule);
//       setTips(response.tips);
//     } catch (error) {
//       console.error("Error generating schedule:", error);
//     }
//   };

//   return (
//     <Router>
//       <div className="app-container">
//         <Routes>
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/task-input" element={isAuthenticated ? <TaskInput tasks={tasks} setTasks={setTasks} /> : <LandingPage />} />
//           <Route path="/schedule" element={<ScheduleView schedule={schedule} />} />
//           <Route path="/bonus-tips" element={<BonusTips tips={tips} />} />
//         </Routes>

//         {isAuthenticated && (
//           <button onClick={handleGenerateSchedule} className="generate-button">
//             Generate Schedule
//           </button>
//         )}
//       </div>
//     </Router>
//   );
// }

// export default App;
