import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
  Input,
  Spinner,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { Eye, Check, X } from "lucide-react";
import Layout from '../Layout';
import { BASE_URL } from '../../config';
const TABLE_HEAD = ["Employee", "Applied On", "Leave Type", "Reason", "Duration", "Actions"];
const ITEMS_PER_PAGE = 5;

const ApprovedLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const authState = JSON.parse(localStorage.getItem("authState"));
      const token = authState ? authState.accessToken : null;
      console.log(token,"this is the token")
      
      if (!token) {
        toast.error('Authentication required. Please login again.');
        navigate('/login');
        return;
      }
  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
     
      const response = await axios.get(`${BASE_URL}approved/leave`,
     { headers: {
        'Authorization': `Bearer ${token}`,
      }}
      
      );
      setLeaves(response.data.data.requests);
      setError(null);
    } catch (err) {
      setError('Failed to fetch leave requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveDetails = async (leaveId) => {
    try {
      
      const response = await axios.get(`${BASE_URL}leave/pending/request/${leaveId}`,
      { headers: {
        'Authorization': `Bearer ${token}`,
      }});

      console.log("respne from request",response)
      setEmployeeInfo(response.data.data.employee_info);
      setSelectedLeave(response.data.data.leave_request);
      setDetailsOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

//   const handleAction = async (leaveId, action) => {
//     try {

//       await axios.put(`${BASE_URL}leave/pending/request/${leaveId}`, {
//         status: action},
//         {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         }
//       });
//       fetchLeaves(); // Refresh the list
//     } catch (err) {
//       console.error(err);
      
//     }
//   };

  const filteredLeaves = leaves.filter(leave => 
    leave.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.leave_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedLeaves = filteredLeaves.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredLeaves.length / ITEMS_PER_PAGE);

  return ( <Layout>
    <Card className="w-full max-w-6xl mx-auto my-8">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Rejected Leave Requests
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Manage rejected leave requests from your team members
            </Typography>
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <div className="w-full md:w-72">
              <Input
                label="Search"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        {loading ? (
          <div className="flex justify-center py-4">
            <Spinner className="h-8 w-8" color="green" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : (
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedLeaves.map((leave, index) => (
                <tr key={leave.id}>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {leave.employee_name}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {new Date(leave.created_date).toLocaleDateString()}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {leave.leave_type}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {leave.reason}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {leave.total_days} days
                    </Typography>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <IconButton
                        variant="text"
                        color="green"
                        onClick={() => fetchLeaveDetails(leave.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </IconButton>
                      {/* <IconButton
                        variant="text"
                        color="green"
                        onClick={() => handleAction(leave.id, 'approved')}
                      >
                        <Check className="h-4 w-4" />
                      </IconButton>
                      <IconButton
                        variant="text"
                        color="red"
                        onClick={() => handleAction(leave.id, 'rejected')}
                      >
                        <X className="h-4 w-4" />
                      </IconButton> */}
                      <Button
                    variant="outlined"
                    color="green">
                        Approved
                    </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Button
          variant="outlined"
          color="green"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Previous
        </Button>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <IconButton
              key={index + 1}
              variant={currentPage === index + 1 ? "filled" : "text"}
              color="green"
              size="sm"
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </IconButton>
          ))}
        </div>
        <Button
          variant="outlined"
          color="green"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Next
        </Button>
      </CardFooter>

      {/* Leave Details Dialog */}
      <Dialog
        size="xl"
        open={detailsOpen}
        handler={() => setDetailsOpen(false)}
      >
        <DialogHeader>Leave Request Details</DialogHeader>
        <DialogBody divider>
          {selectedLeave && employeeInfo && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Typography variant="h6" color="blue-gray">
                    Employee Information
                  </Typography>
                  <Typography color="gray" className="mt-2">
                    Name: {selectedLeave.employee_name}
                  </Typography>
                 
                </div>
                <div>
                  <Typography variant="h6" color="blue-gray">
                    Leave Balance
                  </Typography>
                  <Typography color="gray" className="mt-2">
                    Total Leaves Taken: {employeeInfo.total_leaves_taken}
                  </Typography>
                  <Typography color="gray">
                    Remaining Balance: {employeeInfo.leave_balance}
                  </Typography>
                  <Typography color="gray">
                    Maximum Allowed: {employeeInfo.max_allowed}
                  </Typography>
                </div>
              </div>
              <div>
                <Typography variant="h6" color="blue-gray">
                  Leave Details
                </Typography>
                <div className="mt-2 space-y-2">
                  <Typography color="gray">
                    Leave Type: {selectedLeave.leave_type}
                  </Typography>
                  <Typography color="gray">
                    Duration: {selectedLeave.total_days} days
                  </Typography>

                 
<p>Leave Dates</p>
{selectedLeave.dates && selectedLeave.dates.map((date) => (
  <Typography color="gray" key={date}>
    {new Date(date).toLocaleDateString()}
  </Typography> ))}
                  <Typography color="gray">
                    Reason: {selectedLeave.reason}
                  </Typography>
                </div>
              </div>
            </div>
          )}
        </DialogBody>
        {/* <DialogFooter className="space-x-2">
          <Button
            variant="outlined"
            color="red"
            onClick={() => {
              handleAction(selectedLeave.id, 'rejected');
              setDetailsOpen(false);
            }}
          >
            Reject
          </Button>
          <Button
            variant="filled"
            color="green"
            onClick={() => {
              handleAction(selectedLeave.id, 'approved');
              setDetailsOpen(false);
            }}
          >
            Approve
          </Button>
        </DialogFooter> */}
      </Dialog>
    </Card>
    </Layout>
  );
};

export default ApprovedLeaves;