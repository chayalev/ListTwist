import axios from "axios";

const API_BASE_URL = "http://localhost:3000/auth/google/callback/task-input";/// 3001 צריך לאןלי זה בכלל 

// export const generateSchedule = async (tasks) => {
//   console.log("Generating schedule...", tasks);
//   const response = await axios.post(`${API_BASE_URL}/generateSchedule`, { tasks });
//   //window.location.href = "https://calendar.google.com/calendar/";
//   window.open("https://calendar.google.com/calendar/", "_blank");
//   return response.data;
// };
export const generateSchedule = async (tasks, personalInfo) => {
  console.log("Generating schedule...", tasks, personalInfo);
  const response = await axios.post(`${API_BASE_URL}/generateSchedule`, {
    tasks,
    personalInfo,
  });

  // פותח את Google Calendar בחלון חדש
  window.open("https://calendar.google.com/calendar/", "_blank");
  return response.data;
};
