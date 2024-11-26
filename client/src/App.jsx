import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Ensure you import Routes and Route
import TaskInput from "./components/TaskInput";
import LandingPage from "./components/LandingPage";
import "./css/App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    // Check if user is already authenticated
    const tokens = localStorage.getItem('googleTokens'); // If tokens are saved from a previous session
    if (tokens) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/google/callback/task-input" element={<TaskInput tasks={tasks} setTasks={setTasks} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
