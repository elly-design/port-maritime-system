import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudentRegistration() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setShowPassword(checked);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign up with:', formData);
    // Here you would typically handle the registration logic
    // For demo purposes, navigate to dashboard after registration
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side with logo and title */}
      <div className="w-2/5 bg-indigo-800 flex flex-col items-center justify-center text-white p-8">
        <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center mb-4">
          <svg className="w-24 h-24 text-indigo-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Student Registration System</h1>
      </div>

      {/* Right side with form */}
      <div className="w-3/5 p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-3xl font-bold text-indigo-900 mb-1">Register Account</h2>
          <p className="text-gray-600 mb-6">Sign UP to continue your progress</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                Student ID
              </label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className="w-full p-3 bg-gray-100 rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 bg-gray-100 rounded-md"
                required
              />
            </div>

            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="showPassword" className="text-sm text-gray-600">
                Show password
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition duration-300"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
