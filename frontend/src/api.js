import axios from "axios";

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN;

const API = axios.create({
  baseURL: `${API_ORIGIN}/api/v1`,
  withCredentials: true, // allows cookies/JWT with requests
});

export default API;
