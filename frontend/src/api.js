// src/api.js
import axios from "axios";

const API_URL = "http://localhost:5000";

export const getAttendance = async (date) => {
  return axios.get(`${API_URL}/api/attendance?date=${date}`);
};
