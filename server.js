const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Key for Gemini (Replace with your own secure method for storing keys)
const API_KEY = "AIzaSyCwqAVG99KaryJWDjFdYUQb0GnBIu5aQsU";
//const ChayaleAPI_KEY = "AIzaSyC4InGGZOLEng6BHquirxvGc7Fard8cEtE"

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(API_KEY);

// Model to use
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

// Generate daily schedule using Gemini API
async function generateDailySchedule(tasks) {
    console.log(tasks);
    try {
        // Prepare a prompt to generate a schedule
        const prompt = `
        Based on the tasks provided below, create a daily schedule optimized for productivity:
        ${JSON.stringify(tasks)}
      
        If there are free time slots, add daily challenges like:
        - Drinking water
        - Doing a short exercise
        - Reading or mindfulness
      
        Return the schedule as a JSON array of objects, where each object contains:
        - "time" (the time range for the task)
        - "task" (the name of the task).
      
        Do not include any other details.
        `;

        const response = await model.generateContent([
            {
                text: prompt,
            },
        ]);
        console.log("+++++")
        console.log("response", response.response.text());

        return response.response.text();
    } catch (error) {
        console.error("Error generating schedule:", error);
        throw new Error("Failed to generate schedule");
    }
}

// Route to submit tasks and get a schedule
app.post('/generateSchedule', async (req, res) => {
    console.log("Received request:", req.body);

    const tasks = req.body.tasks; // Example: [{ name, duration, location, priority }]
    if (!tasks || !Array.isArray(tasks)) {
        return res.status(400).send("Invalid tasks format. Please send an array of task objects.");
    }

    try {
        const schedule = await generateDailySchedule(tasks);
        res.send({ schedule });
    } catch (error) {
        res.status(500).send("Error generating schedule.");
    }
});



// Example route for task suggestions
app.get('/suggestions', (req, res) => {
    const suggestions = [
        "Drink a glass of water",
        "Take a 10-minute walk",
        "Stretch for 5 minutes",
    ];
    res.send({ suggestions });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Daily Assistant API is running on port ${PORT}`);
});
