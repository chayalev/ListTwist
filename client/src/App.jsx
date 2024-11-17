import React, { useState } from "react";
import TaskInput from "./components/TaskInput";
import ScheduleView from "./components/ScheduleView";
import BonusTips from "./components/BonusTips";
import { generateSchedule } from "./services/api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [tips, setTips] = useState([]);

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
    <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
      <h1>Daily Assistant</h1>
      <TaskInput tasks={tasks} setTasks={setTasks} />
      <button onClick={handleGenerateSchedule} style={{ margin: "10px 0" }}>
        Generate Schedule
      </button>
      {schedule && <ScheduleView schedule={schedule} />}
      {tips && tips.length > 0 && <BonusTips tips={tips} />}
    </div>
  );
}

export default App;


// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
