import {registerUser} from '../../services/userService';
import {useForm} from 'react-hook-form';
import {Link, useNavigate} from 'react-router-dom';
import {useState} from 'react';
import React from 'react';
import ModalPop from '../../components/ModalPop';

export default function Register() {

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
    setError,
    clearErrors,
    watch
  } = useForm();

  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Watch password and confirmPassword fields for real-time validation
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  // Check if passwords match in real-time
  React.useEffect(() => {
    if (confirmPassword && password) {
      if (password === confirmPassword) {
        clearErrors('confirmPassword');
      } else {
        setError('confirmPassword', { 
          type: 'manual', 
          message: 'Passwords do not match' 
        });
      }
    }
  }, [password, confirmPassword, setError, clearErrors]);

  // data submit
  const onSubmit = async(data)=> {
    setApiError(null);
    setLoading(true);
    
    try{
      const res = await registerUser(data);
      console.log("Registration Success:", res);
      
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
      
      reset(); 
    }catch(err){
      console.log("Registration Error:", err);
      
      // Handle 404 - Backend not running or wrong endpoint
      if (err.status === 404 || err.statusCode === 404) {
        setApiError([{
          message: "Backend Error: (404) Make sure your backend server is running"
        }]);
        return;
      }
      
      // Handle email already registered
      if (err.message && (err.message.toLowerCase().includes('already registered') || err.message.toLowerCase().includes('already exists'))) {
        setError('email', { type: 'manual', message: 'This email is already registered' });
        setApiError([{message: 'This email is already registered. Please login instead or use a different email.'}]);
        return;
      }
      
      // Handle field-specific validation errors from backend
      if (err.errors && Array.isArray(err.errors)) {
        // Group errors by field to combine multiple messages
        const fieldErrors = {};
        err.errors.forEach((error) => {
          if (error.field) {
            const fieldName = error.field.toLowerCase();
            if (!fieldErrors[fieldName]) {
              fieldErrors[fieldName] = [];
            }
            fieldErrors[fieldName].push(error.message);
          }
        });
        
        // Show errors next to specific fields only
        Object.entries(fieldErrors).forEach(([fieldName, messages]) => {
          const errorMessage = messages.join('. '); // Combine multiple messages
          
          if (fieldName === 'name') {
            setError('name', { type: 'manual', message: errorMessage });
          } else if (fieldName === 'email') {
            setError('email', { type: 'manual', message: errorMessage });
          } else if (fieldName === 'password') {
            setError('password', { type: 'manual', message: errorMessage });
          } else if (fieldName === 'confirmpassword' || fieldName === 'confirm_password') {
            setError('confirmPassword', { type: 'manual', message: errorMessage });
          }
        });
        // Don't show in error box at top - only below fields
      } else if (err.message) {
        // Only show general errors in box (like network errors)
        setApiError([{message: err.message}]);
      } else {
        setApiError([{message: "Registration failed! Please try again."}]);
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <ModalPop 
        message="Registration Successful!"
        isVisible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
      
      <div className="bg-light min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-lg shadow-md">
          <h2 className="heading-lg sm:text-2xl font-semibold text-center mb-4 sm:mb-6">Register</h2>
            
            {/* Display API Errors */}
            {apiError && apiError.some(err => err.message && (err.message.toLowerCase().includes('already registered') || err.message.toLowerCase().includes('backend error') || err.message.toLowerCase().includes('cannot connect'))) && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                {apiError.filter(err => err.message && (err.message.toLowerCase().includes('already registered') || err.message.toLowerCase().includes('backend error') || err.message.toLowerCase().includes('cannot connect'))).map((err, idx) => (
                  <div key={idx}>
                    <p className="text-red-600 text-sm">
                      {err.message}
                    </p>
                    {/* Show login link if email already registered */}
                    {err.message && err.message.toLowerCase().includes('already registered')}
                  </div>
                ))}
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="mb-4">
                  <input type="text"
                  placeholder="Name"
                  {...register('name',{required: "Name is required"})}
                  className={`w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-1 text-sm sm:text-base ${
                    errors.name 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-[#cfcfcf]'
                  }`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              {/* Email */}
              <div className="mb-4">
                <input type="email"
                placeholder="Email"
                  {...register('email',{required: "Email is required"})}
                  className={`w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-1 text-sm sm:text-base ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-[#cfcfcf]'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
              {/* passowrd */}
              <div className="mb-4">
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...register('password',{required: "Password is required"})}
                    className={`w-full p-2 sm:p-3 pr-10 border rounded-md focus:outline-none focus:ring-1 text-sm sm:text-base ${
                      errors.password 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-[#cfcfcf]'
                    }`}
                  />
                  {/* Eye icon toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? (
                      // Eye Slash (Hide)
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      // Eye (Show)
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>
              {/* confirm password */}
              <div className="mb-4">
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    {...register('confirmPassword',{required: "Confirm Password is required"})}
                    className={`w-full p-2 sm:p-3 pr-16 border rounded-md focus:outline-none focus:ring-1 text-sm sm:text-base ${
                      errors.confirmPassword 
                        ? 'border-red-500 focus:ring-red-500' 
                        : confirmPassword && password && password === confirmPassword
                        ? 'border-green-500 focus:ring-green-500'
                        : 'border-gray-300 focus:ring-[#cfcfcf]'
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {/* Success checkmark when passwords match */}
                    {confirmPassword && password && password === confirmPassword && (
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    
                    {/* Eye icon toggle */}
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        // Eye Slash (Hide)
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        // Eye (Show)
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
              </div>
              <div className="mb-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full p-2 bg-primary text-white rounded-md hover:bg-hover-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
              <p className="text-center text-sm gapx-1">Already have an account? 
              <Link to="/login" className="text-primary hover:text-hover-primary underline font-medium ml-[3px]">Login</Link></p>
            </form>
        </div>
      </div>
    </>
  )
}