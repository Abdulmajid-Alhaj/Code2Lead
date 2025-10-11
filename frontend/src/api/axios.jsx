import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // base part of your backend URL
  withCredentials: true, // allow cookies to be sent automatically
});

export default api;