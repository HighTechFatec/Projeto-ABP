import axios from "axios";

const api = axios.create({
  baseURL: "http://10.68.55.240:3000", 
});

export default api;
