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


async function generateDailySchedule(tasks, personalInfo) {
    try {
        const prompt = `
        Based on the tasks provided below, create a daily schedule optimized for productivity. Each task should have:
        Additionally, suggest personalized daily challenges based on their hobbies and age.
   
    User Details:
    - Hobbies: ${personalInfo.hobbiesInput}
    - Age: ${personalInfo.age}

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
       
       
       For each task, return a LINK related to that specific task. that help to suceed the task.
      if the task is something that connect to bake and cook give url to google with search of this thing.

        Return the schedule as a JSON array of objects, where each object contains:
        - "startTime": the specific start time (in HH:MM format)
        - "endTime": the specific end time (in HH:MM format)
        - "task": the name of the task, in Hebrew
        - "date": the specific date of the task (in YYYY-MM-DD format)
         - "link": a relevant LINK for the task (make sure the link is directly connected to the task described and is valid).Ensure the link is to a real recipe from a credible site
        
      Please ensure that no other information or explanations are included in the response. Only return the JSON array of tasks and links. 
      Use the following input tasks:
        ${JSON.stringify(tasks)}
        `;

        const response = await model.generateContent([{ text: prompt }]);
        console.log("Gemini API Response:", response); // הוספה של בדיקת התגובה

        const rawResponse = response.response.text();
        console.log("Raw Response from Gemini API:", rawResponse); // בדיקת התגובה הגולמית

        const cleanedResponse = rawResponse.trim().replace(/^```json|```$/g, '');
        return JSON.parse(cleanedResponse); // Return the parsed schedule
    } catch (error) {

        console.error(` failed:`, error);
    }
}

async function addEventsToGoogleCalendar(schedule) {
    try {
        const savedTokens = loadTokensFromFile();// Load tokens to authenticate requests
        if (!savedTokens) {
            throw new Error("User not authenticated. Please authenticate with Google.");
        }
        oauth2Client.setCredentials(savedTokens);
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });// Initialize Calendar API

        for (const task of schedule) {
            // Create and insert each task as a Google Calendar event
            const event = {
                summary: task.task,
                description: task.link ? `🌐 לינק למשימה: ${task.link}` : undefined, // Add link to description if available
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


// ---- Export Functions ----
module.exports = {
    saveTokensToFile,
    loadTokensFromFile,
    addEventsToGoogleCalendar,
    generateDailySchedule
};

