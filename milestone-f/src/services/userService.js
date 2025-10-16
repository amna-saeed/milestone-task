import axiosInstance from "../api/axiosInstance";

// registerUser
export const registerUser = async(userData)=> {
    try{
        const response = await axiosInstance.post('/auth/register', userData);
        return response.data;
    }catch(error){
        console.log("Full axios error:", error);
        // If no response, backend is not reachable
        if (!error.response) {
            throw {
                message: "Cannot connect to backend server",
                status: 'NETWORK_ERROR'
            };
        }
        // Extract error data and status
        const errorData = error.response.data || {message: "Registration failed"};
        errorData.status = error.response.status;
        errorData.statusCode = error.response.status;
        throw errorData;
    }
}


// loginUser
export const loginUser= async(data)=>{
    try{
        const response = await axiosInstance.post('/auth/login', data);
        return response.data;
    }catch(error){
        console.log("Full axios error:", error);
        if(!error.response){
            throw{
                message: "Cannot connect to backend server",
                status: 'NETWORK_ERROR'
            }
        }
        const errorData = error.response.data || {message: "Login failed"};
        errorData.status = error.response.status;
        errorData.statusCode = error.response.status;
        throw errorData;
    }
    
}