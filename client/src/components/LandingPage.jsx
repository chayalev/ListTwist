import React from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import "../css/LandingPage.css";
import logo from "../images/ListTwistLogo.jpg";

const LandingPage = () => {
    const navigate = useNavigate(); // Create the navigate function

    const handleLoginSuccess = () => {
        // נווט לעמוד הוספת המשימה אחרי ההתחברות
        navigate("/task-input");
    };

    return (
        <div className="container">
            <header className="header">
                <h1 className="title">😁 ברוכים הבאים </h1>
                <div className="welcome-message">
                    <p>
                        <strong>?גם אתם תמיד חלמתם על גמד חכם שיסדר לכם את הלו"ז בצורה אופטימלית</strong><br />
                        !הכירו את המערכת שתגרום לכל המשימות שלכם להתיישב במקום המושלם<br />
                        <strong>!Don’t lose your לו"ז</strong><br />
                        .פשוט הזינו את המשימות, ואנחנו נדאג לשאר<br />
                        <span className="highlight">!כי אצלנו, כל דקה חשובה</span>
                    </p>
                </div>
            </header>

            <div className="logo-container">
                <img src={logo} alt="Logo" className="animated-logo" />
            </div>

            <div className="google-button-container">
                <button
                    className="google-button"
                    onClick={() => {
                        window.location.href = 'http://localhost:3000/auth/google';
                    }}
                >
                    התחברי עם Google
                </button>
            </div>
        </div>
    );
};

export default LandingPage;
