import axios from "axios";
import { API_URL } from "../config.ts";

export const axiosInstance = axios.create({
    baseURL: API_URL,
    // The refresh token is an httpOnly cookie on a different origin to the
    // site; without this the browser never attaches it and /auth/refresh
    // always fails.
    withCredentials: true,
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
            // TODO: no redirect is actually wired up here yet — the caller is
            // left to handle the rejected promise.
            console.error("Unauthorized request");
        }
        return Promise.reject(error);
    }
);
