// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   Typography,
//   Button,
//   Input,
//   CardBody,
//   Chip,
//   IconButton
// } from "@material-tailwind/react";
// import { 
//   ChevronLeftIcon, 
//   ChevronRightIcon, 
//   CalendarIcon,
//   ClockIcon,
//   XCircleIcon,
//   SearchIcon
// } from "lucide-react";
// import axios from 'axios';
// import { BASE_URL } from '../../config';
// import Layout from '../Layout';
// const ITEMS_PER_PAGE = 6;

// const RejectedLeavesDisplay = () => {
//   const [leaves, setLeaves] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const authState = JSON.parse(localStorage.getItem("authState"));
//       const token = authState ? authState.accessToken : null;
//       console.log(token,"this is the token")
      
//       if (!token) {
//         toast.error('Authentication required. Please login again.');
//         navigate('/login');
//         return;
//       }
//   // Fetch rejected leaves
//   useEffect(() => {
//     const fetchLeaves = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}rejected/leave`,{
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           }
//         });
        
//         console.log("response we got:",response)
//         // const data = await response.json();
//         setLeaves(response.data.data.requests);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching leaves:', error);
//         setLoading(false);
//       }
//     };
//     fetchLeaves();
//   }, []);

//   // Filter leaves based on search
//   const filteredLeaves = leaves.filter(leave => 
//     leave.leave_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     leave.reason.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Pagination logic
//   const totalPages = Math.ceil(filteredLeaves.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const endIndex = startIndex + ITEMS_PER_PAGE;
//   const currentLeaves = filteredLeaves.slice(startIndex, endIndex);

//   // Format date helper
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   return (
//     <Layout>
//     <div className="w-full px-4 py-8">
//       {/* Search Bar */}
//       <div className="mb-8 flex justify-between items-center">
//         <Typography variant="h4" className="text-green-800">
//           Rejected Leave Requests
//         </Typography>
//         <div className="w-72">
//           <Input
//             type="text"
//             label="Search leaves"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="focus:border-green-500"
//             icon={<SearchIcon className="h-5 w-5 text-green-600" />}
//           />
//         </div>
//       </div>

//       {/* Leave Cards Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//         {currentLeaves.map((leave) => (
//           <Card key={leave.id} className="hover:shadow-lg transition-shadow duration-300">
//             <CardBody>
//               <div className="flex items-start justify-between mb-4">
//                 <div>
//                   <Typography variant="h6" className="text-green-800 mb-1">
//                     {leave.leave_type}
//                   </Typography>
//                   <Chip
//                     value="Rejected"
//                     className="bg-red-100 text-red-800 text-xs"
//                     icon={<XCircleIcon className="h-4 w-4" />}
//                   />
//                 </div>
//                 <Typography className="text-gray-600 text-sm">
//                   {formatDate(leave.created_at)}
//                 </Typography>
//               </div>

//               <div className="space-y-3">
//                 <div className="flex items-center gap-2 text-gray-700">
//                   <CalendarIcon className="h-5 w-5 text-green-600" />
//                   <Typography className="text-sm">
//                     {leave.total_days} day{leave.total_days > 1 ? 's' : ''}
//                   </Typography>
//                 </div>

//                 <div className="flex items-start gap-2">
//                   <ClockIcon className="h-5 w-5 text-green-600 mt-1" />
//                   <Typography className="text-sm text-gray-700">
//                     {leave.reason}
//                   </Typography>
//                 </div>

//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {leave.selected_dates.map((date) => (
//                     <Chip
//                       key={date}
//                       value={formatDate(date)}
//                       className="bg-green-50 text-green-800 text-xs"
//                     />
//                   ))}
//                 </div>
//               </div>
//             </CardBody>
//           </Card>
//         ))}
//       </div>

//       {/* Pagination */}
//       <div className="flex items-center justify-center gap-4">
//         <IconButton
//           variant="outlined"
//           className="border-green-500 text-green-500 hover:bg-green-50"
//           onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//           disabled={currentPage === 1}
//         >
//           <ChevronLeftIcon className="h-4 w-4" />
//         </IconButton>

//         <Typography className="text-green-800">
//           Page {currentPage} of {totalPages}
//         </Typography>

//         <IconButton
//           variant="outlined"
//           className="border-green-500 text-green-500 hover:bg-green-50"
//           onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//           disabled={currentPage === totalPages}
//         >
//           <ChevronRightIcon className="h-4 w-4" />
//         </IconButton>
//       </div>
//     </div></Layout>
//   );
// };

// export default RejectedLeavesDisplay;


import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Button,
  Input,
  CardBody,
  Chip,
  IconButton
} from "@material-tailwind/react";
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CalendarIcon,
  ClockIcon,
  XCircleIcon,
  SearchIcon,
  Clock4Icon
} from "lucide-react";
import axios from 'axios';
import { BASE_URL } from '../../config';
import Layout from '../Layout';
const ITEMS_PER_PAGE = 6;

const RejectedLeavesDisplay = () => {
  const [leaves, setLeaves] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
    const authState = JSON.parse(localStorage.getItem("authState"));
  const token = authState ? authState.accessToken : null;
  console.log(token,"this is the token")
  
  if (!token) {
    toast.error('Authentication required. Please login again.');
    navigate('/login');
    return;
  }
  // Fetch rejected leaves
  // useEffect(() => {
  //   const fetchLeaves = async () => {
  //     try {
  //       const response = await fetch('/api/leaves/rejected/');
  //       const result = await response.json();
  //       setLeaves(result.data.data.requests);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching leaves:', error);
  //       setLoading(false);
  //     }
  //   };
  //   fetchLeaves();
  // }, []);
    useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get(`${BASE_URL}myrejected/leave`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log("our response",response)
        setLeaves(response.data.data.requests);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leaves:', error);
        setLoading(false);
      }
    };
  
    fetchLeaves();
  }, [token]);

  // Filter leaves based on search
  const filteredLeaves = leaves.filter(leave => 
    leave.leave_type_display.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredLeaves.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentLeaves = filteredLeaves.slice(startIndex, endIndex);

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Layout>
    <div className="w-full px-4 py-8">
      {/* Search Bar */}
      <div className="mb-8 flex justify-between items-center">
        <Typography variant="h4" className="text-green-800">
          Rejected Leave Requests
        </Typography>
        <div className="w-72">
          <Input
            type="text"
            label="Search leaves"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="focus:border-green-500"
            icon={<SearchIcon className="h-5 w-5 text-green-600" />}
          />
        </div>
      </div>

      {/* Leave Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentLeaves.map((leave) => (
          <Card key={leave.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardBody>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Typography variant="h6" className="text-green-800 mb-1">
                    {leave.leave_type_display}
                  </Typography>
                  <Chip
                    value={leave.status_display}
                    className="bg-red-100 text-red-800 text-xs"
                    icon={<XCircleIcon className="h-4 w-4" />}
                  />
                </div>
                <Typography className="text-gray-600 text-sm">
                  {formatDate(leave.created_at)}
                </Typography>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <CalendarIcon className="h-5 w-5 text-green-600" />
                  <Typography className="text-sm">
                    {leave.total_days} day{leave.total_days > 1 ? 's' : ''}
                  </Typography>
                  <div className="ml-auto">
                    <Chip
                      value={`${leave.remaining_leaves} days left`}
                      className="bg-green-50 text-green-800 text-xs"
                      icon={<Clock4Icon className="h-3 w-3" />}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <Typography className="text-sm font-medium">
                    Employee:
                  </Typography>
                  <Typography className="text-sm">
                    {leave.employee_name}
                  </Typography>
                </div>

                <div className="flex items-start gap-2">
                  <ClockIcon className="h-5 w-5 text-green-600 mt-1" />
                  <Typography className="text-sm text-gray-700">
                    {leave.reason}
                  </Typography>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {leave.selected_dates.map((date) => (
                    <Chip
                      key={date}
                      value={formatDate(date)}
                      className="bg-green-50 text-green-800 text-xs"
                    />
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <IconButton
            variant="outlined"
            className="border-green-500 text-green-500 hover:bg-green-50"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </IconButton>

          <Typography className="text-green-800">
            Page {currentPage} of {totalPages}
          </Typography>

          <IconButton
            variant="outlined"
            className="border-green-500 text-green-500 hover:bg-green-50"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </IconButton>
        </div>
      )}

      {/* No Results Message */}
      {filteredLeaves.length === 0 && !loading && (
        <div className="text-center py-8">
          <Typography variant="h6" className="text-gray-600">
            No rejected leave requests found
          </Typography>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <Typography variant="h6" className="text-gray-600">
            Loading leave requests...
          </Typography>
        </div>
      )}
    </div></Layout>
  );
};

export default RejectedLeavesDisplay;








// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   Typography,
//   Button,
//   Input,
//   CardBody,
//   Chip,
//   IconButton
// } from "@material-tailwind/react";
// import { 
//   ChevronLeftIcon, 
//   ChevronRightIcon, 
//   CalendarIcon,
//   ClockIcon,
//   XCircleIcon,
//   SearchIcon
// } from "lucide-react";
// import axios from 'axios';
// import { BASE_URL } from '../../config';
// import Layout from '../Layout';
// const ITEMS_PER_PAGE = 6;

// // Helper function to format leave type for display
// const formatLeaveType = (type) => {
//   return type.split('_')
//     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(' ');
// };

// const RejectedLeavesDisplay = () => {
//   const [leaves, setLeaves] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const authState = JSON.parse(localStorage.getItem("authState"));
//   const token = authState ? authState.accessToken : null;
//   console.log(token,"this is the token")
  
//   if (!token) {
//     toast.error('Authentication required. Please login again.');
//     navigate('/login');
//     return;
//   }
//   // Fetch rejected leaves
//   // useEffect(() => {
//   //   const fetchLeaves = async () => {
//   //     try {
//   //       const response = await fetch('/api/leaves/rejected/');
//   //       const result = await response.json();
//   //       setLeaves(result.data.data.requests);
//   //       setLoading(false);
//   //     } catch (error) {
//   //       console.error('Error fetching leaves:', error);
//   //       setLoading(false);
//   //     }
//   //   };
//   //   fetchLeaves();
//   // }, []);
//   useEffect(() => {
//     const fetchLeaves = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}myrejected/leave`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });
//         console.log("our response",response)
//         setLeaves(response.data.data.requests);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching leaves:', error);
//         setLoading(false);
//       }
//     };
  
//     fetchLeaves();
//   }, [token]);
//   // Filter leaves based on search
//   const filteredLeaves = leaves.filter(leave => 
//     formatLeaveType(leave.leave_type).toLowerCase().includes(searchTerm.toLowerCase()) ||
//     leave.reason.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Pagination logic
//   const totalPages = Math.ceil(filteredLeaves.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const endIndex = startIndex + ITEMS_PER_PAGE;
//   const currentLeaves = filteredLeaves.slice(startIndex, endIndex);

//   // Format date helper
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   return (
//     <Layout>
//     <div className="w-full px-4 py-8">
//       {/* Search Bar */}
//       <div className="mb-8 flex justify-between items-center">
//         <Typography variant="h4" className="text-green-800">
//           Rejected Leave Requests
//         </Typography>
//         <div className="w-72">
//           <Input
//             type="text"
//             label="Search leaves"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="focus:border-green-500"
//             icon={<SearchIcon className="h-5 w-5 text-green-600" />}
//           />
//         </div>
//       </div>

//       {/* Leave Cards Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//         {currentLeaves.map((leave) => (
//           <Card key={leave.id} className="hover:shadow-lg transition-shadow duration-300">
//             <CardBody>
//               <div className="flex items-start justify-between mb-4">
//                 <div>
//                   <Typography variant="h6" className="text-green-800 mb-1">
//                     {formatLeaveType(leave.leave_type)}
//                   </Typography>
//                   <Chip
//                     value="Rejected"
//                     className="bg-red-100 text-red-800 text-xs"
//                     icon={<XCircleIcon className="h-4 w-4" />}
//                   />
//                 </div>
//                 <Typography className="text-gray-600 text-sm">
//                   {formatDate(leave.created_date)}
//                 </Typography>
//               </div>

//               <div className="space-y-3">
//                 <div className="flex items-center gap-2 text-gray-700">
//                   <CalendarIcon className="h-5 w-5 text-green-600" />
//                   <Typography className="text-sm">
//                     {leave.total_days} day{leave.total_days > 1 ? 's' : ''}
//                   </Typography>
//                 </div>

//                 <div className="flex items-center gap-2 text-gray-700">
//                   <Typography className="text-sm font-medium">
//                     Employee:
//                   </Typography>
//                   <Typography className="text-sm">
//                     {leave.employee_name}
//                   </Typography>
//                 </div>

//                 <div className="flex items-start gap-2">
//                   <ClockIcon className="h-5 w-5 text-green-600 mt-1" />
//                   <Typography className="text-sm text-gray-700">
//                     {leave.reason}
//                   </Typography>
//                 </div>

//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {leave.dates.map((date) => (
//                     <Chip
//                       key={date}
//                       value={formatDate(date)}
//                       className="bg-green-50 text-green-800 text-xs"
//                     />
//                   ))}
//                 </div>
//               </div>
//             </CardBody>
//           </Card>
//         ))}
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex items-center justify-center gap-4">
//           <IconButton
//             variant="outlined"
//             className="border-green-500 text-green-500 hover:bg-green-50"
//             onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//             disabled={currentPage === 1}
//           >
//             <ChevronLeftIcon className="h-4 w-4" />
//           </IconButton>

//           <Typography className="text-green-800">
//             Page {currentPage} of {totalPages}
//           </Typography>

//           <IconButton
//             variant="outlined"
//             className="border-green-500 text-green-500 hover:bg-green-50"
//             onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//             disabled={currentPage === totalPages}
//           >
//             <ChevronRightIcon className="h-4 w-4" />
//           </IconButton>
//         </div>
//       )}

//       {/* No Results Message */}
//       {filteredLeaves.length === 0 && !loading && (
//         <div className="text-center py-8">
//           <Typography variant="h6" className="text-gray-600">
//             No rejected leave requests found
//           </Typography>
//         </div>
//       )}
//     </div></Layout>
//   );
// };

// export default RejectedLeavesDisplay;