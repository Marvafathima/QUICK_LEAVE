import React, { useState,useEffect } from 'react';
import Calendar from 'react-multi-date-picker';
import DatePanel from 'react-multi-date-picker/plugins/date_panel';
import { Input, Select, Option, Textarea, Button, Card, CardBody, CardHeader } from "@material-tailwind/react";
import Layout from '../Layout';
import { BASE_URL } from '../../config';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { logout } from '../../app/slice/authSlice';
const LeaveApplication = () => {
  const [leaveType, setLeaveType] = useState('');
  const [dates, setDates] = useState([]);
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState({});
  const [calendarOpen, setCalendarOpen] = useState(false);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loading, error, user, isAuthenticated } = useSelector((state) => ({
    loading: state.auth.loading,
    error: state.auth.error,
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated
  }));
    
  // Custom date validator
  const dateValidator = (date) => {
    // Disable weekends and past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return (
      date.weekDay.index !== 0 && // Not Sunday
      date.weekDay.index !== 6 && // Not Saturday
      date.toDate() > today // Not today or past dates
    );
  };


const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    const validations = {
      leaveType: !leaveType ? 'Leave type is required' : '',
      dates: dates.length === 0 ? 'Please select at least one date' : '',
      reason: reason.trim().length < 10 ? 'Reason must be at least 10 characters' : ''
    };

    const formErrors = Object.values(validations).filter(error => error !== '');
    
    if (formErrors.length > 0) {
      setErrors(validations);
      return;
    }
    setIsSubmitting(true);

    try {
      // Get access token from localStorage
      const authState = JSON.parse(localStorage.getItem("authState"));
      const token = authState ? authState.accessToken : null;
   
      console.log("token got 61 leaveapppage", token);
      
      if (!token) {
        toast.error('Authentication required. Please login again.');
        navigate('/login');
        return;
      }

      // Prepare the request data
      const leaveData = {
        leaveType,
        dates: dates.map(d => d.format('YYYY-MM-DD')),
        reason: reason.trim(),
        employeeId: user.id
      };
      
      console.log("leaveData", leaveData);
      
      const response = await axios.post(
        `${BASE_URL}leave/apply`,
        leaveData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Handle successful response
      toast.success('Leave application submitted successfully!');
      
      // Reset form
      setLeaveType('');
      setDates([]);
      setReason('');
      setErrors({});
      
      // Redirect to leaves list
    //   navigate('/employee/leaves');

    } catch (error) {
      console.error('Leave application error:', error);
      
      if (error.response) {
        const { data, status } = error.response;
        
        // Handle different types of error responses
        if (status === 400) {
          // Validation errors from the serializer
          if (data.errors) {
            // Handle structured validation errors
            Object.entries(data.errors).forEach(([field, messages]) => {
              if (Array.isArray(messages)) {
                messages.forEach(message => toast.error(`${field}: ${message}`));
              } else if (typeof messages === 'string') {
                toast.error(`${field}: ${messages}`);
              }
            });
          } else if (typeof data === 'object') {
            // Handle individual field errors
            Object.entries(data).forEach(([field, message]) => {
              if (field === 'dates') {
                // Handle date-related errors (conflicts, weekends, etc.)
                toast.error(message);
              } else if (field === 'leave_type') {
                // Handle leave balance errors
                toast.error(message);
              } else {
                toast.error(`${field}: ${message}`);
              }
            });
          } else {
            // Handle simple error message
            toast.error(data.message || 'Invalid request. Please check your input.');
          }
        } else if (status === 401) {
          // Handle authentication errors
          toast.error('Session expired. Please login again.');
          dispatch(logout());
          navigate('/');
        //   navigate('/login');
        } else if (status === 403) {
          // Handle permission errors
          toast.error('You do not have permission to perform this action.');
        } else if (status === 409) {
          // Handle conflict errors (e.g., overlapping leaves)
          toast.error(data.message || 'Conflict with existing leave application.');
        } else {
          // Handle other status codes
          toast.error(data.message || 'An error occurred while submitting your application.');
        }
      } else if (error.request) {
        // Handle network errors
        toast.error('Unable to connect to the server. Please check your internet connection.');
      } else {
        // Handle other errors
        toast.error('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
    // setIsSubmitting(true);

    // // try {
    //   // Get access token from localStorage
    //   const authState = JSON.parse(localStorage.getItem("authState"));
    // //   const token = localStorage.getItem('accessToken');
    // const token = authState ? authState.accessToken : null;

   
    //   console.log("token got 61 leaveapppage",token)
    //   if (!token) {
    //     toast.error('Authentication required. Please login again.');
    //     navigate('/login');
    //     return;
    //   }

    //   // Prepare the request data
    //   const leaveData = {
    //     leaveType,
    //     dates: dates.map(d => d.format('YYYY-MM-DD')), // Format dates consistently
    //     reason: reason.trim(),
    //     employeeId: user.id // Assuming employeeId is stored in localStorage
    //   };
    //   console.log("leaveData",leaveData)
    //   // Make API request
    //   const response = await axios.post(
    //     // `${import.meta.env.VITE_API_BASE_URL}/api/leave/apply`,
    //     `${BASE_URL}leave/apply`,
    //     leaveData,
    //     {
    //       headers: {
    //         'Authorization': `Bearer ${token}`,
    //         'Content-Type': 'application/json'
    //       }
    //     }
    //   );

    //   // Handle successful response
    //   if (response.data.success) {
    //     toast.success('Leave application submitted successfully!');
        
    //     // Reset form
    //     setLeaveType('');
    //     setDates([]);
    //     setReason('');
    //     setErrors({});
        
    //     // Optionally redirect to leaves list
    //     navigate('/employee/leaves');
    //   }

    
};

useEffect(() => {
    return () => {
      setIsSubmitting(false); // Reset isSubmitting when component unmounts
    };
  }, []);

  return (
    <Layout>
    <Card className="w-full max-w-2xl mx-auto mt-10">
      <CardHeader 
        color="green" 
        className="mb-4 p-6"
      >
        <h2 className="text-white text-2xl">Leave Application</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Leave Type Select */}
          <div>
            <Select 
              label="Leave Type"
              value={leaveType}
              onChange={(val) => {
                setLeaveType(val);
                setErrors(prev => ({...prev, leaveType: ''}));
              }}
            >
              <Option value="annual">Annual Leave</Option>
              <Option value="sick">Sick Leave</Option>
              <Option value="casual">Casual Leave</Option>
              <Option value="maternity">Maternity/Paternity Leave</Option>
            </Select>
            {errors.leaveType && (
              <p className="text-red-500 text-sm mt-1">{errors.leaveType}</p>
            )}
          </div>

          {/* Calendar for Date Selection */}
          <div>
            <p className="mb-2 text-green-600">Select Leave Dates</p>
            <Calendar 
              multiple
              value={dates}
              onChange={(dateObjects) => {
                setDates(dateObjects);
                setCalendarOpen(false); // Close calendar after selection
              }}
              open={calendarOpen}
              onOpen={() => setCalendarOpen(true)}
              onClose={() => setCalendarOpen(false)}
              
              // Calendar Customization
            //   calendar={gregorian}
            //   locale={gregorian_en}
            //   calendarPosition="bottom-center"
              
              // Date Restrictions
              minDate={new Date().setDate(new Date().getDate() + 1)} // Only allow future dates
              
              // Custom validation
              disableDate={dateValidator}
              
              // Additional Plugins
              plugins={[
                <DatePanel key="date-panel" />,
              ]}
              
              // Green Theme Customization
              className="custom-calendar"
              containerClassName="w-full"
              style={{
                backgroundColor: '#e6f3e6', // Light green background
                borderColor: '#4caf50', // Green border
              }}
            />
            {errors.dates && (
              <p className="text-red-500 text-sm mt-1">{errors.dates}</p>
            )}
          </div>

          {/* Reason Textarea */}
          <div>
            <Textarea
              label="Reason for Leave"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setErrors(prev => ({...prev, reason: ''}));
              }}
            />
            {errors.reason && (
              <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" color="green" fullWidth 
          disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Apply for Leave'}
          </Button>
        </form>
      </CardBody>
    </Card></Layout>
  );
};

export default LeaveApplication;

// Optional: Add some custom CSS for further calendar styling
const customCalendarStyles = `
<style>
  .custom-calendar .rmdp-day:not(.rmdp-disabled):hover {
    background-color: #4caf50 !important;
    color: white !important;
  }
  .custom-calendar .rmdp-day.rmdp-selected {
    background-color: #4caf50 !important;
  }
</style>
`;


// import React, { useState } from 'react';
// import { Calendar, DateObject } from 'react-multi-date-picker';
// import { Input, Select, Option, Textarea, Button, Card, CardBody, CardHeader } from "@material-tailwind/react";
// import Layout from '../Layout';
// // Utility function to check if selected dates are valid
// const validateDates = (selectedDates) => {
//   // Check for weekends
//   const invalidDates = selectedDates.filter(date => 
//     date.weekDay.index === 6 || // Saturday
//     date.weekDay.index === 0    // Sunday
//   );

//   return {
//     isValid: invalidDates.length === 0,
//     invalidDates
//   };
// };

// // Main Leave Application Component
// const LeaveApplication = () => {
//   const [leaveType, setLeaveType] = useState('');
//   const [dates, setDates] = useState([]);
//   const [reason, setReason] = useState('');
//   const [errors, setErrors] = useState({});

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     // Validate dates
//     const dateValidation = validateDates(dates);
    
//     if (!dateValidation.isValid) {
//       setErrors({
//         dates: 'Cannot select weekend dates: ' + 
//           dateValidation.invalidDates.map(d => d.format()).join(', ')
//       });
//       return;
//     }

//     // Additional validation
//     const validations = {
//       leaveType: !leaveType ? 'Leave type is required' : '',
//       dates: dates.length === 0 ? 'Please select at least one date' : '',
//       reason: reason.trim().length < 10 ? 'Reason must be at least 10 characters' : ''
//     };

//     // Check if there are any validation errors
//     const formErrors = Object.values(validations).filter(error => error !== '');
    
//     if (formErrors.length > 0) {
//       setErrors(validations);
//       return;
//     }

//     // TODO: Send leave application to backend
//     console.log('Leave Application Submitted:', {
//       leaveType,
//       dates: dates.map(d => d.format()),
//       reason
//     });

//     // Reset form
//     setLeaveType('');
//     setDates([]);
//     setReason('');
//     setErrors({});
//   };

//   return (
//     <Layout>
//     <Card className="w-full max-w-2xl mx-auto mt-10">
//       <CardHeader 
//         color="green" 
//         className="mb-4 p-6"
//       >
//         <h2 className="text-white text-2xl">Leave Application</h2>
//       </CardHeader>
//       <CardBody>
//         <form onSubmit={handleSubmit} className="flex flex-col gap-6">
//           {/* Leave Type Select */}
//           <div>
//             <Select 
//               label="Leave Type"
//               value={leaveType}
//               onChange={(val) => {
//                 setLeaveType(val);
//                 setErrors(prev => ({...prev, leaveType: ''}));
//               }}
//             >
//               <Option value="annual">Annual Leave</Option>
//               <Option value="sick">Sick Leave</Option>
//               <Option value="casual">Casual Leave</Option>
//               <Option value="maternity">Maternity/Paternity Leave</Option>
//             </Select>
//             {errors.leaveType && (
//               <p className="text-red-500 text-sm mt-1">{errors.leaveType}</p>
//             )}
//           </div>

//           {/* Calendar for Date Selection */}
//           <div>
//             <p className="mb-2 text-blue-gray-500">Select Leave Dates</p>
//             <Calendar 
//               multiple
//               value={dates}
             
//               onChange={setDates}
//               format="YYYY-MM-DD"
//             />
//             {errors.dates && (
//               <p className="text-red-500 text-sm mt-1">{errors.dates}</p>
//             )}
//           </div>

//           {/* Reason Textarea */}
//           <div>
//             <Textarea
//               label="Reason for Leave"
//               value={reason}
//               onChange={(e) => {
//                 setReason(e.target.value);
//                 setErrors(prev => ({...prev, reason: ''}));
//               }}
//             />
//             {errors.reason && (
//               <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <Button type="submit" color="green" fullWidth>
//             Apply for Leave
//           </Button>
//         </form>
//       </CardBody>
//     </Card></Layout>
//   );
// };

// export default LeaveApplication;