import axios from "axios";

const api = axios.create({
  baseURL: "https://projeto-abp.onrender.com", 
});

export default api;
