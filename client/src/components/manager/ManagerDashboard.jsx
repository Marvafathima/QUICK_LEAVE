import React from 'react'
import { useSelector } from 'react-redux';
import Layout from '../Layout'
export const ManagerDashboard = () => {
    const { loading, error, user, isAuthenticated } = useSelector((state) => ({
        loading: state.auth.loading,
        error: state.auth.error,
        user: state.auth.user,
        isAuthenticated: state.auth.isAuthenticated
      }));
   
    if (loading) return <div>Loading...</div>;

  return (
    <div>
<Layout>
    <div>

      {isAuthenticated ? (
        <div>
          <p>Welcome {user.username}!</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      ) : (
        <p>Please log in</p>
      )}
    </div>
    </Layout>
    </div>
  )
}
