import Header from '../../components/Header'
import { useState, useEffect } from 'react';
import {useForm} from 'react-hook-form';
import {updatePassword} from '../../services/userService'

export default function Profile() {
  const [activeTab, setActiveTab] = useState("edit");
  const [user, setUser] = useState(null);

    useEffect(() => {
      // Get user data from localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
          try {
              setUser(JSON.parse(userData));
          } catch (error) {
              console.error('Error parsing user data:', error);
          }
      }
    }, []);

    const {
        register,
        handleSubmit,
        watch,
        setError,
        clearErrors,
        formState: { errors },
        reset,
      } = useForm();
    
      const [showCurrent, setShowCurrent] = useState(false);
      const [showNew, setShowNew] = useState(false);
      const [showConfirm, setShowConfirm] = useState(false);
    
      const newPassword = watch("newPassword");
      const confirmPassword = watch("confirmPassword");
    
      // Real-time password match validation
      useEffect(() => {
        if (newPassword && confirmPassword) {
          if (newPassword === confirmPassword) {
            clearErrors("confirmPassword");
          } else {
            setError("confirmPassword", {
              type: "manual",
              message: "Passwords do not match",
            });
          }
        }
      }, [newPassword, confirmPassword, setError, clearErrors]);
    
      const onSubmit = async (data) => {
        try {
          const token = localStorage.getItem("token"); 
           console.log(token)
          if (!token) {
            alert("Please log in again — token not found!");
            return;
          }
          const res = await updatePassword({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
          }, token);
          alert("Password updated successfully!");
          console.log(res);

        } catch (err) {
          console.error("Update failed:", err);
            alert(err.response?.data?.message || "Password update failed");
        }
    };

  return (
    <>
        <Header />
        <div className="flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-[480px]"> 
                <h2 className="text-2xl font-semibold py-5">Profile Settings</h2>
                {/* Tabs */}
                <div className="flex justify-between p-2 mb-4 rounded-lg bg-[#ededed]">
                    {/* Account Tab */}
                    <button
                        onClick={() => setActiveTab("edit")}
                        className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium px-2 py-1 rounded-md transition-colors ${
                        activeTab === "edit"
                            ? "bg-white text-black" 
                            : "text-gray-700"          
                        }`}
                    >
                        {/* Man Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            >
                            <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M5.5 21c0-3 5-4 6.5-4s6.5 1 6.5 4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Account
                    </button>

                    {/* Security Tab */}
                    <button
                        onClick={() => setActiveTab("security")}
                        className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium px-2 py-1 rounded-md transition-colors ${
                        activeTab === "security"
                            ? "bg-white text-black" 
                            : "text-gray-700"         
                        }`}
                    >
                        {/* Lock Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                        <rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Security
                    </button>
                </div>

                {/* Main Card */}
                <div className="bg-gray-50 shadow-md rounded-xl border border-gray-300 p-6 sm:p-8">
                {activeTab === "edit" && (
                    <form className="space-y-4">
                        <p className="text-lg font-semibold">Account Information</p>
                         {/* Name (editable) */}
                         <div className="flex flex-col">
                            <label className="mb-2 text-sm font-medium text-gray-700">Name:</label>
                            <input
                                type="text"
                                value= {user?.name || 'User'}
                                readOnly
                                disabled
                                className="w-full p-3 border rounded-md focus:outline-none text-sm bg-gray-100 cursor-not-allowed"
                              />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-2">Email:</label>
                            <input
                                type="email"
                                value={user?.email || ""}
                                readOnly
                                disabled
                                className="w-full p-3 border rounded-md focus:outline-none text-sm bg-gray-100 cursor-not-allowed"
                              />
                            <p className="text-xs text-gray-500 pt-1">Email cannot be changed</p>
                        </div>

                       {/* Submit Button */}
                        <button
                            type="submit"
                            disabled
                            className="bg-blue-300 text-white py-1 px-5 rounded-md"
                        >
                            Submit
                        </button>
                    </form>
                )}

                {activeTab === "security" && (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Current Password */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">Current Password</label>
                            <div className="relative pt-1">
                                <input
                                type={showCurrent ? "text" : "password"}
                                placeholder="Current Password"
                                {...register("currentPassword", { required: "Current password is required" })}
                                className={`w-full p-2 pr-10 border rounded-md ${
                                    errors.currentPassword ? "border-red-500" : "border-gray-300"
                                  } focus:outline-none focus:ring-0 focus:border-gray-400`}
                                />
                                <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                {showCurrent ? (
                                    // Eye Slash (Hide)
                                    <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                    />
                                    </svg>
                                ) : (
                                    // Eye (Show)
                                    <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                    </svg>
                                )}
                                </button>
                            </div>

                            {errors.currentPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.currentPassword.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">New Password</label>
                            <div className="relative pt-1">
                                <input
                                type={showNew ? "text" : "password"}
                                placeholder="New Password"
                                {...register("newPassword", { required: "New password is required" })}
                                className={`w-full p-2 pr-10 border rounded-md ${
                                    errors.currentPassword ? "border-red-500" : "border-gray-300"
                                  } focus:outline-none focus:ring-0 focus:border-gray-400`}
                                />
                                <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                {showNew ? (
                                    // Eye Slash (Hide)
                                    <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                    />
                                    </svg>
                                ) : (
                                    // Eye (Show)
                                    <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                                </svg>
                            )}
                            </button>
                        </div>

                        {errors.newPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
                        )}
                        </div>

                       {/* Confirm Password */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                            <div className="relative pt-1">
                                <input
                                type={showConfirm ? "text" : "password"}
                                placeholder="Confirm Password"
                                {...register("confirmPassword", { required: "Confirm password is required" })}
                                className={`w-full p-2 pr-10 border rounded-md ${
                                    errors.confirmPassword
                                      ? "border-red-500"
                                      : newPassword && confirmPassword && newPassword === confirmPassword
                                      ? "border-green-500"
                                      : "border-gray-300"
                                  } focus:outline-none focus:ring-0 focus:border-gray-300 active:border-gray-300 hover:border-gray-300`}
                                />
                                <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                {showConfirm ? (
                                    // Eye Slash (Hide)
                                    <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                    />
                                    </svg>
                                ) : (
                                    // Eye (Show)
                                    <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                    </svg>
                                )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>


                            <button
                                type="submit"
                                className="w-full bg-[#184071] text-white py-2 rounded-md hover:bg-[#184071ed] transition-colors"
                            >
                                Update Password
                            </button>
                    </form>
                )}
                </div>
            </div>
        </div>
    </>
    );
}