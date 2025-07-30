import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        const deviceId = localStorage.getItem("deviceId");
        if (deviceId) {
            config.headers["x-device-id"] = deviceId;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Unauthorized request, redirecting to login...");
            //Redirect to login page
        }
        return Promise.reject(error);
    }
);
