// import React from 'react'
// import { useSelector } from 'react-redux';
// import Layout from '../Layout'
// export const EmployeeDashboard = () => {
//     const { loading, error, user, isAuthenticated } = useSelector((state) => ({
//         loading: state.auth.loading,
//         error: state.auth.error,
//         user: state.auth.user,
//         isAuthenticated: state.auth.isAuthenticated
//       }));
   
//     if (loading) return <div>Loading...</div>;

//   return (
//     <div>
// <Layout>
//     <div>

//       {isAuthenticated ? (
//         <div>
//           <p>Welcome {user.username}!</p>
//           <p>Email: {user.email}</p>
//           <p>Role: {user.role}</p>
//         </div>
//       ) : (
//         <p>Please log in</p>
//       )}
//     </div>
//     </Layout>
//     </div>
//   )
// }
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { 
  ClipboardList, 
  CheckCircle, 
  XCircle, 
  Clock, 
  PlusCircle,
  Calendar,
  UserCircle,
  BarChart
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from '../../config';
export const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { loading, error, user, isAuthenticated } = useSelector((state) => ({
    loading: state.auth.loading,
    error: state.auth.error,
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated
  }));
  const [stats, setStats] = useState(null);
  const [loadings, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const authState = JSON.parse(localStorage.getItem("authState"));
      const token = authState ? authState.accessToken : null;

      if (!token) {
        toast.error("Authentication required. Please login again.");
        navigate("/login");
        return;
      }

      const response = await axios.get(`${BASE_URL}user_leave_stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch user leave statistics");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      approved: "green",
      pending: "amber",
      rejected: "red",
    };
    return colors[status] || "gray";
  };

  if (loadings) {
    return  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
  </div>
  }

  if (!stats) {
    return <div>No leave statistics available.</div>;
  }




  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const quickLinks = [
    {
      title: "Apply Leave",
      description: "Submit a new leave application",
      icon: <PlusCircle className="h-6 w-6 text-green-500" />,
      path: "/leave_application",
      color: "bg-green-50"
    },
    {
      title: "Pending Leaves",
      description: "Track your pending applications",
      icon: <Clock className="h-6 w-6 text-amber-500" />,
      path: "/mypending/requests",
      color: "bg-amber-50"
    },
    {
      title: "Approved Leaves",
      description: "View your approved leaves",
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      path: "/myapproved/requests",
      color: "bg-green-50"
    },
    {
      title: "Rejected Leaves",
      description: "View rejected applications",
      icon: <XCircle className="h-6 w-6 text-red-500" />,
      path: "/myrejected/requests",
      color: "bg-red-50"
    }
  ];

  const statis = [
    {
      title: "Leave Balance",
      value:`${stats.overall_stats.total_balance}`,
      icon: <Calendar className="h-6 w-6 text-green-500" />,
      color: "bg-green-50"
    },
    {
      title: "Pending Requests",
      value: `${stats.overall_stats.pending_requests}`,
      icon: <Clock className="h-6 w-6 text-amber-500" />,
      color: "bg-amber-50"
    },
    {
      title: "Used Leaves",
      value: `${stats.overall_stats.total_taken}`,
      icon: <ClipboardList className="h-6 w-6 text-blue-500" />,
      color: "bg-blue-50"
    }
  ];

  return (
    <Layout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center gap-4">
              <UserCircle className="h-12 w-12" />
              <div>
                <Typography variant="h4">Welcome back, {user?.username}!</Typography>
                <Typography variant="paragraph" className="mt-1 opacity-80">
                  Manage your leave applications and track your requests
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {statis.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardBody className={`${stat.color} flex items-center gap-4`}>
                {stat.icon}
                <div>
                  <Typography variant="paragraph" className="text-gray-600">
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" color="blue-gray">
                    {stat.value}
                  </Typography>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Quick Links Section */}
        <div className="mb-8">
          <Typography variant="h5" color="blue-gray" className="mb-4">
            Quick Actions
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                onClick={() => navigate(link.path)}
              >
                <CardBody className={`${link.color}`}>
                  <div className="flex flex-col items-center text-center gap-2">
                    {link.icon}
                    <Typography variant="h6" color="blue-gray">
                      {link.title}
                    </Typography>
                    <Typography variant="small" className="text-gray-600">
                      {link.description}
                    </Typography>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <Card>
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="mb-4">
              Recent Activity
            </Typography>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <Typography variant="small" className="font-medium">
                    Sick Leave Approved
                  </Typography>
                  <Typography variant="small" color="gray">
                    Your sick leave request for Oct 15-16 has been approved
                  </Typography>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-amber-500" />
                <div>
                  <Typography variant="small" className="font-medium">
                    New Leave Request
                  </Typography>
                  <Typography variant="small" color="gray">
                    You submitted a leave request for Nov 20-21
                  </Typography>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default EmployeeDashboard;