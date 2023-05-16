import axios from "axios";
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });


API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
//   "accessToken"
// )}`;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

axios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem(
    "accessToken"
  )}`;
  return config;
});

export default API;
