import axios from "axios";

const API_URL = "http://161.35.203.118/"; // Change this to your actual backend URL

const getAuthParams = () => {
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");
  return { username, password };
};

export const fetchStudentDetails = async () => {
  const response = await axios.get(`${API_URL}/student`, { params: getAuthParams() });
  return response.data;
};

export const fetchNotifications = async () => {
  const response = await axios.get(`${API_URL}/notifications`, { params: getAuthParams() });
  return response.data;
};

export const fetchSchedule = async () => {
  const response = await axios.get(`${API_URL}/schedule`, { params: getAuthParams() });
  return response.data;
};
