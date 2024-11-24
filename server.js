const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { google } = require('googleapis');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
require('dotenv').config();
const { saveTokensToFile, loadTokensFromFile, addEventsToGoogleCalendar, generateDailySchedule } = require('./serverFunctions'); // ייבוא הפונקציות

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- Session Middleware ----
app.use(
    session({
        secret: 'your-secret-key', // החלף בסוד אמיתי
        resave: false,
        saveUninitialized: true,
    })
);

// ---- Gemini API Config ----
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
});

// ---- Google OAuth Config ----
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/auth/google/callback';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/userinfo.profile'];

// ---- Routes ----
// Google OAuth Authentication
app.get('/auth/google', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    res.redirect(authUrl);
});

// Google OAuth Callback
app.get('/auth/google/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) return res.status(400).send('Authorization code not provided.');
    console.log("code:", code);


    try {
        const { tokens } = await oauth2Client.getToken(code);
        console.log("tokens:", tokens);
        oauth2Client.setCredentials(tokens);
        saveTokensToFile(tokens);
        res.redirect('http://localhost:3001/auth/google/callback/task-input'); // כאן אתה מנווט לדף ה-task-input
        //res.send('Authentication successful! You can now make API requests.');
    } catch (error) {
        console.error('Error retrieving tokens:', error);
        res.status(500).send('Error during authentication.');
    }
});


// Route to generate schedule and add it to Google Calendar
app.post('/auth/google/callback/task-input/generateSchedule', async (req, res) => {
    const tasks = req.body.tasks;

    if (!tasks || !Array.isArray(tasks)) {
        return res.status(400).send('Invalid tasks format. Please send an array of task objects.');
    }

    try {
        const schedule = await generateDailySchedule(tasks);
        console.log("Generated Schedule:", schedule);
        await addEventsToGoogleCalendar(schedule);
        res.send({ schedule });
    } catch (error) {
        console.error("Error generating schedule or adding events:", error);
        res.status(500).send("Error generating schedule or adding events.");
    }
});

// ---- Start the Server ----
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});














