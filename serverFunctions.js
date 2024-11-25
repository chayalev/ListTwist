const { google } = require('googleapis');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // ייבוא ה-GoogleGenerativeAI
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

// ---- Google Calendar Helper Functions ----
function saveTokensToFile(tokens) {
    fs.writeFileSync('tokens.json', JSON.stringify(tokens));
}

function loadTokensFromFile() {
    if (fs.existsSync('tokens.json')) {
        return JSON.parse(fs.readFileSync('tokens.json', 'utf8'));
    }
    return null;
}

// Add events to Google Calendar
// async function addEventsToGoogleCalendar(schedule) {
//     try {
//         const savedTokens = loadTokensFromFile();
//         if (!savedTokens) {
//             throw new Error("User not authenticated. Please authenticate with Google.");
//         }
//         oauth2Client.setCredentials(savedTokens);
//         const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
//         const currentDate = new Date().toISOString().split('T')[0];

//         for (const task of schedule) {
//             const event = {
//                 summary: task.task,
//                 start: {
//                     dateTime: `${currentDate}T${task.startTime}:00`,
//                     timeZone: 'Asia/Jerusalem',
//                 },
//                 end: {
//                     dateTime: `${currentDate}T${task.endTime}:00`,
//                     timeZone: 'Asia/Jerusalem',
//                 },
//             };

//             const response = await calendar.events.insert({
//                 auth: oauth2Client,
//                 calendarId: 'primary',
//                 resource: event,
//             });
//             console.log(`Event created: ${response.data.htmlLink}`);

//         }

//         console.log("All events were successfully added to Google Calendar!");

//     } catch (error) {
//         console.error("Error adding events to Google Calendar:", error);
//     }
// }

async function addEventsToGoogleCalendar(schedule) {
    try {
        const savedTokens = loadTokensFromFile();
        if (!savedTokens) {
            throw new Error("User not authenticated. Please authenticate with Google.");
        }
        oauth2Client.setCredentials(savedTokens);
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        for (const task of schedule) {
            const event = {
                summary: task.task,
                start: {
                    dateTime: `${task.date}T${task.startTime}:00`,
                    timeZone: 'Asia/Jerusalem',
                },
                end: {
                    dateTime: `${task.date}T${task.endTime}:00`,
                    timeZone: 'Asia/Jerusalem',
                },
            };

            const response = await calendar.events.insert({
                auth: oauth2Client,
                calendarId: 'primary',
                resource: event,
            });
            console.log(`Event created: ${response.data.htmlLink}`);
        }

        console.log("All events were successfully added to Google Calendar!");

    } catch (error) {
        console.error("Error adding events to Google Calendar:", error);
    }
}




async function generateDailySchedule(tasks) {
    const maxRetries = 3;
    let attempts = 0;

    while (attempts < maxRetries) {
        try {


            const prompt = `
            Based on the tasks provided below, create a daily schedule optimized for productivity. Each task should have:
            - "startTime" (specific start time in HH:MM format)
            - "endTime" (specific end time in HH:MM format)
            - "task" (the name of the task, in Hebrew)
            - "date" (the specific date of the task in YYYY-MM-DD format)
            
            Consider these rules:
            1. Tasks with a specified start time should be scheduled exactly at their given start time.
            2. Tasks without a specified start time should be slotted optimally, filling in free time in the schedule.
            3. If there are free time slots, suggest **only one or two daily challenges**, and only if there is sufficient free time. Examples include:
               - Drinking water
               - A short exercise
               - Mindfulness or relaxation activities
            4. If the day is packed with tasks, add **one or two encouraging sentences in Hebrew** after every few tasks to motivate the user and help them stay positive.
            
            Return the schedule as a JSON array of objects, where each object contains:
            - "startTime": the specific start time (in HH:MM format)
            - "endTime": the specific end time (in HH:MM format)
            - "task": the name of the task, in Hebrew
            - "date": the specific date of the task (in YYYY-MM-DD format)
            
            Do not include any other details. Use the following input tasks:
            ${JSON.stringify(tasks)}
            `;


            const response = await model.generateContent([{ text: prompt }]);
            console.log("Gemini API Response:", response); // הוספה של בדיקת התגובה

            const rawResponse = response.response.text();
            console.log("Raw Response from Gemini API:", rawResponse); // בדיקת התגובה הגולמית

            const cleanedResponse = rawResponse.trim().replace(/^```json|```$/g, '');
            return JSON.parse(cleanedResponse);
        } catch (error) {
            attempts++;
            console.error(`Attempt ${attempts} failed:`, error);

            if (attempts >= maxRetries) {
                throw new Error("Failed to generate schedule after multiple attempts.");
            }

            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }
}
module.exports = {
    saveTokensToFile,
    loadTokensFromFile,
    addEventsToGoogleCalendar,
    generateDailySchedule
};

