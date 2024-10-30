
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, selectAuthError,selectAuthLoading}from '../app/slice/authSlice';

import Layout from './Layout';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get loading and error states from Redux
  const loading = useSelector(selectAuthLoading);
  const reduxError = useSelector(selectAuthError);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Using the loginUser thunk from your slice
      const resultAction = await dispatch(loginUser(formData)).unwrap();
    //   if (resultAction.role === 'employee') {
    //     navigate('/employee_dashboard');
    //   } else if (resultAction.role === 'manager') {
    //     navigate('/hrdashboard');}
      // If login is successful, navigate to dashboard
    //   navigate('/dashboard');
    } catch (err) {
      // Redux Toolkit will handle the error state
      console.error('Login failed:', err);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          
          <form onSubmit={handleSubmit}>
            {/* Show error message if exists */}
            {reduxError && (
              <div className="mb-4 text-red-500 text-center">
                {reduxError}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>



    </Layout>
  );
};

export default LoginPage;