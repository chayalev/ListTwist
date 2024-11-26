import React from "react";
import "../css/LandingPage.css";
//import logo from "/images/ListTwistLogo.png";

const LandingPage = () => {
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
                <img src="/images/ListTwistLogo.png"  alt="Logo" className="animated-logo" />
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
