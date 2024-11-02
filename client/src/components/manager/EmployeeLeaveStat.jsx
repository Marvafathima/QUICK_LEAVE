import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Card,
  CardBody,
  Typography,
  Chip,
  Progress,
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
  List,
  ListItem,
} from "@material-tailwind/react";
import Layout from '../Layout';
import { BASE_URL } from '../../config';
const EmployeeLeaveStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const authState = JSON.parse(localStorage.getItem("authState"));
      const token = authState ? authState.accessToken : null;
      
      if (!token) {
        toast.error('Authentication required. Please login again.');
        navigate('/login');
        return;
      }

      const response = await axios.get(`${BASE_URL}employee_leave_stats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setStats(response.data.data);
      if (response.data.data.employees.length > 0) {
        setSelectedEmployee(response.data.data.employees[0]);
      }
    } catch (error) {
      toast.error('Failed to fetch leave statistics');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      approved: "green",
      pending: "amber",
      rejected: "red"
    };
    return colors[status] || "gray";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Employee List Sidebar */}
        <Card className="md:col-span-3 h-fit">
          <CardBody>
            <Typography variant="h6" color="blue-gray" className="mb-4">
              Employees ({stats?.total_employees})
            </Typography>
            <List>
              {stats?.employees.map((employee) => (
                <ListItem
                  key={employee.employee_id}
                  onClick={() => setSelectedEmployee(employee)}
                  className={`cursor-pointer ${
                    selectedEmployee?.employee_id === employee.employee_id
                      ? "bg-green-50"
                      : ""
                  }`}
                >
                  <Typography variant="small">
                    {employee.employee_name}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </CardBody>
        </Card>

        {/* Main Content Area */}
        {selectedEmployee && (
          <div className="md:col-span-9 space-y-6">
            {/* Overall Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardBody>
                  <Typography variant="small" color="blue-gray">
                    Total Leave Balance
                  </Typography>
                  <Typography variant="h4" color="green">
                    {selectedEmployee.overall_stats.total_balance}
                  </Typography>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Typography variant="small" color="blue-gray">
                    Leave Days Taken
                  </Typography>
                  <Typography variant="h4" color="blue-gray">
                    {selectedEmployee.overall_stats.total_taken}
                  </Typography>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Typography variant="small" color="blue-gray">
                    Total Allowance
                  </Typography>
                  <Typography variant="h4" color="blue-gray">
                    {selectedEmployee.overall_stats.total_allowed}
                  </Typography>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Typography variant="small" color="blue-gray">
                    Pending Requests
                  </Typography>
                  <Typography variant="h4" color="amber">
                    {selectedEmployee.overall_stats.pending_requests}
                  </Typography>
                </CardBody>
              </Card>
            </div>

            {/* Leave Type Breakdown */}
            <Card>
              <CardBody>
                <Typography variant="h6" color="blue-gray" className="mb-4">
                  Leave Type Breakdown
                </Typography>
                <div className="space-y-4">
                  {Object.entries(selectedEmployee.leave_type_breakdown).map(([type, stats]) => (
                    <div key={type} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Typography variant="small">{stats.type_display}</Typography>
                        <Typography variant="small">
                          {stats.taken} / {stats.max_allowed} days
                        </Typography>
                      </div>
                      <Progress
                        value={(stats.taken / stats.max_allowed) * 100}
                        color="green"
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Recent Leave Requests */}
            <Card>
              <CardBody>
                <Typography variant="h6" color="blue-gray" className="mb-4">
                  Recent Leave Requests
                </Typography>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max table-auto text-left">
                    <thead>
                      <tr>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                          <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                            Type
                          </Typography>
                        </th>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                          <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                            Days
                          </Typography>
                        </th>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                          <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                            Status
                          </Typography>
                        </th>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                          <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                            Date
                          </Typography>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEmployee.recent_leaves.map((leave, index) => (
                        <tr key={index}>
                          <td className="p-4">
                            <Typography variant="small" color="blue-gray">
                              {leave.type_display}
                            </Typography>
                          </td>
                          <td className="p-4">
                            <Typography variant="small" color="blue-gray">
                              {leave.days}
                            </Typography>
                          </td>
                          <td className="p-4">
                            <Chip
                              size="sm"
                              variant="gradient"
                              color={getStatusColor(leave.status)}
                              value={leave.status_display}
                            />
                          </td>
                          <td className="p-4">
                            <Typography variant="small" color="blue-gray">
                              {new Date(leave.created_at).toLocaleDateString()}
                            </Typography>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

// Wrap with Layout component
const EmployeeLeaveStatsWithLayout = () => (
  <Layout>
    <EmployeeLeaveStats />
  </Layout>
);

export default EmployeeLeaveStatsWithLayout;