import {registerUser} from '../../services/userService';
import {useForm} from 'react-hook-form';
import {Link, useNavigate} from 'react-router-dom';
import {useState} from 'react';
import ModalPop from '../../components/ModalPop';

export default function Register() {

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
    setError
  } = useForm();

  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

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
          
          if (fieldName === 'fullname' || fieldName === 'full_name') {
            setError('fullName', { type: 'manual', message: errorMessage });
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
        <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">Register</h2>
            
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
                  placeholder="Full Name"
                  {...register('fullName',{required: "Full Name is required"})}
                  className="w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#cfcfcf] text-sm sm:text-base"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
              </div>
              <div className="mb-4">
                <input type="email"
                placeholder="Email"
                {...register('email',{required: "Email is required"})}
                className="w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#cfcfcf] text-sm sm:text-base"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
              <div className="mb-4">
                <input type="password"
                placeholder="Password"
                {...register('password',{required: "Password is required"})}
                className="w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#cfcfcf] text-sm sm:text-base"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>
              <div className="mb-4">
                <input type="password"
                placeholder="Confirm Password"
                {...register('confirmPassword',{required: "Confirm Password is required"})}
                className="w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#cfcfcf] text-sm sm:text-base"
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
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