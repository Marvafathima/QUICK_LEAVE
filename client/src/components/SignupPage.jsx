// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { setCredentials } from '../app/slice/authSlice';
// import Layout from './Layout';
// const SignupPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: '',
//     phone_number: '',
//     username: '',
//     password: '',
//     password2:'',
//     role: 'employee',
//     profile_pic: null,
//   });
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: files ? files[0] : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formDataToSend = new FormData();
//       Object.keys(formData).forEach(key => {
//         formDataToSend.append(key, formData[key]);
//       });
//       console.log("form data sending backend",formDataToSend)
//       const response = await axios.post('http://localhost:8000/signup/', formDataToSend, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       dispatch(setCredentials({
//         accessToken: response.data.access,
//         refreshToken: response.data.refresh,
//         role: response.data.role,
//       }));
//       navigate('/dashboard');
//     } catch (err) {
//       setError(err.response?.data?.message || 'An error occurred');
//     }
//   };

//   return (
//     <Layout>
//     <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="text-center text-3xl font-bold text-gray-900">
//           Create your account
//         </h2>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             {error && (
//               <div className="bg-red-50 p-4 rounded-md">
//                 <p className="text-sm text-red-700">{error}</p>
//               </div>
//             )}

//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 required
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
//                 onChange={handleChange}
//               />
//             </div>

//             <div>
//               <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
//                 Phone Number
//               </label>
//               <input
//                 id="phone_number"
//                 name="phone_number"
//                 type="tel"
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
//                 onChange={handleChange}
//               />
//             </div>

//             <div>
//               <label htmlFor="username" className="block text-sm font-medium text-gray-700">
//                 Username
//               </label>
//               <input
//                 id="username"
//                 name="username"
//                 type="text"
//                 required
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
//                 onChange={handleChange}
//               />
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 required
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
//                 onChange={handleChange}
//               />
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                  Confirm Password
//               </label>
//               <input
//                 id="password2"
//                 name="password2"
//                 type="password"
//                 required
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
//                 onChange={handleChange}
//               />
//             </div>


//             <div>
//               <label htmlFor="role" className="block text-sm font-medium text-gray-700">
//                 Role
//               </label>
//               <select
//                 id="role"
//                 name="role"
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
//                 onChange={handleChange}
//               >
//                 <option value="employee">Employee</option>
//                 <option value="manager">Manager</option>
//               </select>
//             </div>

//             <div>
//               <label htmlFor="profile_pic" className="block text-sm font-medium text-gray-700">
//                 Profile Picture
//               </label>
//               <input
//                 id="profile_pic"
//                 name="profile_pic"
//                 type="file"
//                 accept="image/*"
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
//                 onChange={handleChange}
//               />
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//               >
//                 Sign up
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//     </Layout>
//   );
// };
// export default SignupPage;
import React, { useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { setCredentials } from '../app/slice/authSlice';
import Layout from './Layout';
import { signupUser } from '../app/slice/authSlice';

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    phone_number: '',
    username: '',
    password: '',
    password2: '',
    role: 'employee',
    profile_pic: null,
  });
  const [errors, setErrors] = useState({});
// const loading = useSelector(selectAuthLoading);
//   const error = useSelector(selectAuthError);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Username validation
    if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    // Password confirmation validation
    if (formData.password !== formData.password2) {
      newErrors.password2 = 'Passwords do not match';
    }

    // Phone number validation (optional)
    if (formData.phone_number && !/^\d{10}$/.test(formData.phone_number.replace(/[^0-9]/g, ''))) {
      newErrors.phone_number = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    // Clear error for the field being changed
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'profile_pic') {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      await dispatch(signupUser(formDataToSend)).unwrap();
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the slice
      console.error('Signup failed:', err);
    }
  };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     try {
//       const formDataToSend = new FormData();
      
//       // Explicitly append each field to FormData
//       Object.keys(formData).forEach(key => {
//         if (key === 'profile_pic') {
//           if (formData[key]) {
//             formDataToSend.append(key, formData[key]);
//           }
//         } else {
//           formDataToSend.append(key, formData[key]);
//         }
//       });

//       // Log FormData contents (for debugging)
//       for (let pair of formDataToSend.entries()) {
//         console.log(pair[0] + ': ' + pair[1]);
//       }

    //   const response = await axios.post('http://localhost:8000/signup/', formDataToSend, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   });

    //   const authData = {
    //     accessToken: response.data.access,
    //     refreshToken: response.data.refresh,
    //     role: response.data.role,
    //   };

    //   // Store in Redux
    //   dispatch(setCredentials(authData));

    //   // Store in localStorage
    //   localStorage.setItem('authData', JSON.stringify(authData));
    //   localStorage.setItem('isAuthenticated', 'true');

    //   navigate('/dashboard');

//     } catch (err) {
//       const serverError = err.response?.data;
      
//       if (typeof serverError === 'object') {
//         // Handle structured error response
//         const newErrors = {};
//         Object.keys(serverError).forEach(key => {
//           newErrors[key] = Array.isArray(serverError[key]) 
//             ? serverError[key][0] 
//             : serverError[key];
//         });
//         setErrors(newErrors);
//       } else {
//         // Handle string error message
//         setErrors({ general: serverError || 'An error occurred during signup' });
//       }
//     }
//   };

  return (
    <Layout>
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Create your account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {errors.general && (
                <div className="bg-red-50 p-4 rounded-md">
                  <p className="text-sm text-red-700">{errors.general}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.phone_number ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  onChange={handleChange}
                />
                {errors.phone_number && (
                  <p className="mt-1 text-xs text-red-600">{errors.phone_number}</p>
                )}
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  onChange={handleChange}
                />
                {errors.username && (
                  <p className="mt-1 text-xs text-red-600">{errors.username}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="password2" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="password2"
                  name="password2"
                  type="password"
                  required
                  value={formData.password2}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.password2 ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  onChange={handleChange}
                />
                {errors.password2 && (
                  <p className="mt-1 text-xs text-red-600">{errors.password2}</p>
                )}
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  onChange={handleChange}
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              <div>
                <label htmlFor="profile_pic" className="block text-sm font-medium text-gray-700">
                  Profile Picture
                </label>
                <input
                  id="profile_pic"
                  name="profile_pic"
                  type="file"
                  accept="image/*"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  onChange={handleChange}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignupPage;