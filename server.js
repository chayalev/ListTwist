const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { google } = require('googleapis');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
    session({
        secret: 'your-secret-key', // החליפי בסוד אמיתי
        resave: false,
        saveUninitialized: true,
    })
);

// Google OAuth Config
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/auth/google/callback';
console.log('CLIENT_ID:', CLIENT_ID);
console.log('CLIENT_SECRET:', CLIENT_SECRET);
console.log('REDIRECT_URI:', REDIRECT_URI);
const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

// Gemini API Config
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
});

// Generate daily schedule using Gemini API
async function generateDailySchedule(tasks) {
    try {
        const prompt = `
        Based on the tasks provided below, create a daily schedule optimized for productivity. Each task should have:
        - "startTime" (specific start time in HH:MM format)
        - "endTime" (specific end time in HH:MM format)
        - "task" (the name of the task, in Hebrew)
        
        Consider these rules:
        1. Tasks with a specified start time should be scheduled exactly at their given start time.
        2. Tasks without a specified start time should be slotted optimally, filling in free time in the schedule.
        3. If there are free time slots, suggest no more than **one or two daily challenges** tailored to the user's well-being.
        4. If the day is packed with tasks, add **one or two encouraging sentences in Hebrew** after every few tasks.

        Return the schedule as a JSON array:
        ${JSON.stringify(tasks)}
        `;
        const response = await model.generateContent([
            { text: prompt },
        ]);
        return response.response.text();
    } catch (error) {
        console.error('Error generating schedule:', error);
        throw new Error('Failed to generate schedule');
    }
}

// Route for Google OAuth
app.get('/auth/google', (req, res) => {
    const scopes = [
        // 'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        // 'https://www.googleapis.com/openid',
    ];

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });
    console.log("url",url);
    res.redirect(url);
});



// Google OAuth callback
app.get('/auth/google/callback', async (req, res) => {
    console.log("code",req.query.code);
    
    const code = req.query.code;
    if (!code) return res.status(400).send('Authorization code not provided.');

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        req.session.tokens = tokens;

        res.send('Authentication successful! You can now make API requests.');
    } catch (error) {
        console.error('Error retrieving tokens:', error);
        res.status(500).send('Error during authentication.');
    }
});

// Route to submit tasks and get a schedule
app.post('/generateSchedule', async (req, res) => {
    const tasks = req.body.tasks;
    if (!tasks || !Array.isArray(tasks)) {
        return res.status(400).send('Invalid tasks format. Please send an array of task objects.');
    }
    try {
        const schedule = await generateDailySchedule(tasks);
        res.send({ schedule });
    } catch (error) {
        res.status(500).send('Error generating schedule.');
    }
});

// Example route for task suggestions
app.get('/suggestions', (req, res) => {
    const suggestions = [
        'Drink a glass of water',
        'Take a 10-minute walk',
        'Stretch for 5 minutes',
    ];
    res.send({ suggestions });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
















//גרסא טובה
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const express = require('express');
// const app = express();
// const cors = require('cors');
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // API Key for Gemini (Replace with your own secure method for storing keys)
// //const API_KEY = "AIzaSyCwqAVG99KaryJWDjFdYUQb0GnBIu5aQsU";

// // Initialize Gemini API
// const genAI = new GoogleGenerativeAI(API_KEY);

// // Model to use
// const model = genAI.getGenerativeModel({
//     model: "gemini-1.5-flash",
// });

// // Generate daily schedule using Gemini API
// async function generateDailySchedule(tasks) {
//     console.log(tasks);
//     try {
//         // Prepare a prompt to generate a schedule
//         const prompt = `
//         Based on the tasks provided below, create a daily schedule optimized for productivity. Each task should have:
//         - "startTime" (specific start time in HH:MM format)
//         - "endTime" (specific end time in HH:MM format)
//         - "task" (the name of the task, in Hebrew)
        
//         Consider these rules:
//         1. Tasks with a specified start time should be scheduled exactly at their given start time.
//         2. Tasks without a specified start time should be slotted optimally, filling in free time in the schedule.
//         3. If there are free time slots, suggest no more than **one or two daily challenges** tailored to the user's well-being. Examples include:
//            - Drinking water
//            - A short exercise
//            - Mindfulness or relaxation activities
//         4. If the day is packed with tasks, add **one or two encouraging sentences in Hebrew** after every few tasks to motivate the user and help them stay positive.
        
//         Return the schedule as a JSON array of objects, where each object contains:
//         - "startTime": the specific start time (in HH:MM format)
//         - "endTime": the specific end time (in HH:MM format)
//         - "task": the name of the task, in Hebrew
//         - If included, challenges or motivational sentences should appear as their own tasks.
        
//         Do not include any other details. Use the following input tasks:
//         ${JSON.stringify(tasks)}
//         `;
//         const response = await model.generateContent([
//             {
//                 text: prompt,
//             },
//         ]);
//         console.log("Response:", response.response.text());
//         return response.response.text();
//     } catch (error) {
//         console.error("Error generating schedule:", error);
//         throw new Error("Failed to generate schedule");
//     }
// }

// // Route to submit tasks and get a schedule
// app.post('/generateSchedule', async (req, res) => {
//     console.log("Received request:", req.body);
//     const tasks = req.body.tasks; // Example: [{ name, duration, location, priority }]
//     if (!tasks || !Array.isArray(tasks)) {
//         return res.status(400).send("Invalid tasks format. Please send an array of task objects.");
//     }
//     try {
//         const schedule = await generateDailySchedule(tasks);
//         res.send({ schedule });
//     } catch (error) {
//         res.status(500).send("Error generating schedule.");
//     }
// });
// // Example route for task suggestions
// app.get('/suggestions', (req, res) => {
//     const suggestions = [
//         "Drink a glass of water",
//         "Take a 10-minute walk",
//         "Stretch for 5 minutes",
//     ];
//     res.send({ suggestions });
// });

// // Start the server
// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Daily Assistant API is running on port ${PORT}`);
// });
