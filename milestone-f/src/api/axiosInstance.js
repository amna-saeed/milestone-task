import axios from 'axios'

const axiosInstance = axios.create({

    // backend API URL
    baseURL: 'http://localhost:4000/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response)=> response,
    (error)=> {
        console.log("API Error:", error.response || error)
        return Promise.reject(error)
    },
);

export default axiosInstance;