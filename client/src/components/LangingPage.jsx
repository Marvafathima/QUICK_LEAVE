import React from 'react';
import { Calendar, CheckCircle, Clock, Users } from 'lucide-react';
import Layout from './Layout';
import { Link } from 'react-router-dom';
const LandingPage = () => {
  return (
    <Layout>
    <div className="w-full bg-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Simplify Leave Management
              <span className="block text-green-600">For Your Team</span>
            </h1>
            <p className="text-lg text-gray-600">
              Streamline your leave application process with our intuitive system. Track, approve, and manage time off efficiently.
            </p>
            <div className="flex flex-wrap gap-4">
                <Link to="/signup">
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                Get Started
              </button></Link>
              <button className="border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center">
            {/* Placeholder for your main SVG */}
            <img src='windy_day.svg'></img>
            {/* <div className="w-full max-w-md h-64 bg-green-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-24 h-24 text-green-600" />
            </div> */}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Key Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Approval</h3>
              <p className="text-gray-600">Streamlined approval process with instant notifications</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Time Tracking</h3>
              <p className="text-gray-600">Monitor leave balances and time-off patterns</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Team Calendar</h3>
              <p className="text-gray-600">View team availability at a glance</p>
            </div>
          </div>
        </div>
      </div>
    </div></Layout>
  );
};

export default LandingPage;