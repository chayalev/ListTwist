// import React, { useState } from "react";
// import TaskInput from "./components/TaskInput";
// import ScheduleView from "./components/ScheduleView";
// import BonusTips from "./components/BonusTips";
// import LandingPage from "./components/LandingPage";
// import { generateSchedule } from "./services/api";

// // ייבוא קובץ ה-CSS (בהנחה שממוקם בתיקיית src/css)
// import "./css/App.css";

// function App() {
//   const [tasks, setTasks] = useState([]);
//   const [schedule, setSchedule] = useState(null);
//   const [tips, setTips] = useState([]);

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
//     <div className="app-container">
//       {/* <h1>Daily Assistant</h1> */}
//       <LandingPage />
//       <TaskInput tasks={tasks} setTasks={setTasks} />
//       <button onClick={handleGenerateSchedule} className="generate-button">
//         Generate Schedule
//       </button>
//       {schedule && <ScheduleView schedule={schedule} />}
//       {tips && tips.length > 0 && <BonusTips tips={tips} />}
//     </div>
//   );
// }

// export default App;

// // import React, { useState } from "react";
// // import TaskInput from "./components/TaskInput";
// // import ScheduleView from "./components/ScheduleView";
// // import BonusTips from "./components/BonusTips";
// // import { generateSchedule } from "./services/api";
// // import "./App.css";


// // function App() {
// //   const [tasks, setTasks] = useState([]);
// //   const [schedule, setSchedule] = useState(null);
// //   const [tips, setTips] = useState([]);

// //   const handleGenerateSchedule = async () => {
// //     try {
// //       const response = await generateSchedule(tasks);
// //       setSchedule(response.schedule);
// //       setTips(response.tips);
// //     } catch (error) {
// //       console.error("Error generating schedule:", error);
// //     }
// //   };

// //   return (
// //     <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
// //       <h1>Daily Assistant</h1>
// //       <TaskInput tasks={tasks} setTasks={setTasks} />
// //       <button onClick={handleGenerateSchedule} style={{ margin: "10px 0" }}>
// //         Generate Schedule
// //       </button>
// //       {schedule && <ScheduleView schedule={schedule} />}
// //       {tips && tips.length > 0 && <BonusTips tips={tips} />}
// //     </div>
// //   );
// // }

// // export default App;


import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
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
    // אם המשתמש כבר מחובר, ננווט לעמוד הוספת המשימה
    const tokens = localStorage.getItem('googleTokens'); // אם נשמרו טוקנים מקודם
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
    <Router> {/* Wrap your entire component tree in a Router */}
      <div className="app-container">
        {/* <h1>Daily Assistant</h1> */}
        <LandingPage/>
        <button onClick={handleGenerateSchedule} className="generate-button">
          Generate Schedule
        </button>
        {isAuthenticated && <TaskInput tasks={tasks} setTasks={setTasks} />}
        {schedule && <ScheduleView schedule={schedule} />}
        {tips && tips.length > 0 && <BonusTips tips={tips} />}
      </div>
    </Router>
  );
 

  // return (
  //   <div className="app-container">
  //     <Router>
  //       <Routes>
  //         <Route path="/" element={<LandingPage onAuthSuccess={handleGoogleAuthSuccess} />} />
  //         <Route path="/addTask" element={<TaskInput tasks={tasks} setTasks={setTasks} />} />
  //       </Routes>
  //     </Router>
      
  //     {isAuthenticated && (
  //       <>
  //         <button onClick={handleGenerateSchedule} className="generate-button">
  //           Generate Schedule
  //         </button>
  //         {schedule && <ScheduleView schedule={schedule} />}
  //         {tips && tips.length > 0 && <BonusTips tips={tips} />}
  //       </>
  //     )}
  //   </div>
  // );
}

export default App;


