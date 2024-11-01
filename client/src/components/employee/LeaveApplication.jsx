import React, { useState } from 'react';
import Calendar from 'react-multi-date-picker';
import DatePanel from 'react-multi-date-picker/plugins/date_panel';
// import gregorian from 'react-multi-date-picker/calendars/gregorian';
// import gregorian_en from 'react-multi-date-picker/locales/gregorian_en';
import { Input, Select, Option, Textarea, Button, Card, CardBody, CardHeader } from "@material-tailwind/react";
import Layout from '../Layout';
const LeaveApplication = () => {
  const [leaveType, setLeaveType] = useState('');
  const [dates, setDates] = useState([]);
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState({});
  const [calendarOpen, setCalendarOpen] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation logic remains the same as previous example
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

    // TODO: Send leave application to backend
    console.log('Leave Application Submitted:', {
      leaveType,
      dates: dates.map(d => d.format()),
      reason
    });

    // Reset form
    setLeaveType('');
    setDates([]);
    setReason('');
    setErrors({});
  };

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
          <Button type="submit" color="green" fullWidth>
            Apply for Leave
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