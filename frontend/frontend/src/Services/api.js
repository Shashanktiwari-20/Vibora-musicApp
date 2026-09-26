import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

let accessToken = null;

export const setAccessToken = (token) => {
    accessToken = token;
};

export const clearAccessToken = () => {
    accessToken = null;
};

api.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeToRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

const notifyRefreshSubscribers = (token) => {
    refreshSubscribers.forEach((callback) => {
        callback(token);
    });

    refreshSubscribers = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if ( error.response?.status !== 401 || originalRequest?._retry || originalRequest?.url?.includes("/auth/refresh") || originalRequest?.url?.includes("/auth/login") || originalRequest?.url?.includes("/auth/login/request-otp") || originalRequest?.url?.includes("/auth/login/verify-otp") || originalRequest?.url?.includes("/auth/register")) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                subscribeToRefresh((newToken) => {
                    if (!newToken) {
                        reject(error);
                        return;
                    }

                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    resolve(api(originalRequest));
                });
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const response = await api.post("/auth/refresh");

            const newAccessToken = response.data.accessToken;

            setAccessToken(newAccessToken);
            notifyRefreshSubscribers(newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return api(originalRequest);
        } catch (refreshError) {
            notifyRefreshSubscribers(null);
            clearAccessToken();

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;