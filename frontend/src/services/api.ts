import axios from "axios";

const api = axios.create({
  baseURL: "http://SEU_IP_DO_BACKEND:3000", 
});

export default api;
