import { useForm } from "react-hook-form"
import { loginUser } from "../../services/userService"
import {Link, useNavigate} from 'react-router-dom';
import {useState} from 'react';
import ModalPop from '../../components/ModalPop';


export default function LoginPage() {
    const{
        register,
        handleSubmit,
        reset,
        setError,
        formState: {errors},
    } = useForm();

    const [apiError, setApiError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async(data)=> {
        setApiError(null);
        setLoading(true);

        try{
            const res = await loginUser(data);
            console.log("Login Success:", res);

            // Store token and user data in localStorage
            if (res.token) {
                localStorage.setItem('token', res.token);
            }
            if (res.user) {
                localStorage.setItem('user', JSON.stringify(res.user));
            }
            
            setShowSuccessModal(true);
            
            // Redirect to dashboard after 1 second
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
            
            // reset form
            reset();

        }catch(err){
            console.log("Login Error:", err);
            
            // Handle 404 - Backend not running or wrong endpoint
            if (err.status === 404 || err.statusCode === 404) {
                setApiError([{
                    message: "Backend Error: (404) Make sure your backend server is running"
                }]);
                return;
            }

            // Handle network errors
            if (err.status === 'NETWORK_ERROR') {
                setApiError([{message: 'Cannot connect to backend server'}]);
                return;
            }

            // Handle invalid credentials or user not found
            if (err.message && (err.message.toLowerCase().includes('invalid') 
                || err.message.toLowerCase().includes('incorrect') 
                || err.message.toLowerCase().includes('not found'))) {
                setError('email', { type: 'manual', message: 'Invalid email or password' });
                setApiError([{message: err.message}]);
                return;
            }
            
            // Handle field-specific validation errors from backend
            if (err.errors && Array.isArray(err.errors)) {
                err.errors.forEach((error) => {
                    if (error.field) {
                        const fieldName = error.field.toLowerCase();
                        if (fieldName === 'email') {
                            setError('email', { type: 'manual', message: error.message });
                        } else if (fieldName === 'password') {
                            setError('password', { type: 'manual', message: error.message });
                        }
                    }
                });
                return;
            }
            
            // Handle other errors
            if (err.message) {
                setApiError([{message: err.message}]);
            } else {
                setApiError([{message: 'Login failed! Please try again.'}]);
            }
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <ModalPop 
                message="Login Successful!"
                isVisible={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
            />
             <div className="flex min-h-screen bg-white">
                <div className="hidden md:flex w-1/2 items-center justify-center relative">
                    <img src="public/assets/auth-img.png" alt="auth-img" className="w-100 h-[585px;]" />
                    <div className="absolute text-center text-white px-6">
                        <h2 className="text-4xl font-bold mb-2">Welcome back — Let’s get things done</h2>
                    </div>
                </div>
                <div className="flex w-full md:w-1/2 items-center justify-center px-6 sm:px-12 lg:px-20">
                    <div className="w-full max-w-md bg-gray-50 shadow-md rounded-2xl border border-[#e5e5e5] p-8">
                        <h2 className="heading-lg sm:text-2xl font-semibold text-[#184071] text-center mb-4 sm:mb-6">Login</h2>

                        {/* Display API Errors */}
                        {apiError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                {apiError.map((err, idx) => (
                                    <p key={idx} className="text-red-600 text-sm">
                                        {err.message}
                                    </p>
                                ))}
                            </div>
                        )}

                        <form onSubmit={(handleSubmit(onSubmit))} className="space-y-4">
                            <div className="mb-4">
                                <input
                                type="email"
                                placeholder="Email"
                                {...register('email', {required: "Email is required"})}
                                className={`w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-1 text-sm sm:text-base ${
                                    errors.name 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : 'border-gray-300 focus:ring-[#cfcfcf]'
                                }`} />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                            </div>

                            <div className="mb-4">
                                <input
                                type="password"
                                placeholder="Password"
                                {...register('password', {required: "Password is required"})}
                                className={`w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-1 text-sm sm:text-base ${
                                    errors.name 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : 'border-gray-300 focus:ring-[#cfcfcf]'
                                }`} />
                                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                            </div>

                            <div className="mb-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary text-white py-2 sm:py-2.5 rounded-md hover:bg-hover-primary transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>
                            </div>
                        </form>

                        <p className="text-center text-sm mt-4 sm:mt-5">
                        Don't have an account? 
                        <Link
                            to="/register"
                            className="text-primary hover:text-hover-primary underline font-medium ml-[3px]"
                        >
                            Register
                        </Link>
                        </p>
                    </div>
                </div>
             </div>
        </>
    )
}