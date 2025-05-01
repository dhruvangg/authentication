import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, 
});

axiosInstance.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;

    if(error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const response = await axiosInstance.post('/auth/refresh', {}, { withCredentials: true });
            if (response.data.accessToken) {
                axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.accessToken;
                return axiosInstance(originalRequest);
            }
        } catch (err) {
            console.error('Error refreshing token:', err);
        }
    }
})

export default axiosInstance;
