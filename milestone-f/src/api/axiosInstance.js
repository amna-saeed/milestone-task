import axios from 'axios'

const axiosInstance = axios.create({

    // backend API URL - automatically switches based on environment
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor to add token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response)=> response,
    (error)=> {
        console.log("API Error:", error.response || error)
        return Promise.reject(error)
    },
);

export default axiosInstance;