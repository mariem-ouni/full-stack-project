import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "develoment" ? "http://localhost:5001/api" :"/api",
    withCredentails: true,
    
    
})