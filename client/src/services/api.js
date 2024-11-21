import axios from "axios";

const API_BASE_URL = "http://localhost:3000/auth/google/callback/task-input";/// 3001 צריך לאןלי זה בכלל 

export const generateSchedule = async (tasks) => {
  console.log("Generating schedule...", tasks);
  const response = await axios.post(`${API_BASE_URL}/generateSchedule`, { tasks });
  return response.data;
};
