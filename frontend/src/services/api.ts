import axios from "axios";

const api = axios.create({
  baseURL: "http://10.68.55.240:3011", 
});

export default api;
