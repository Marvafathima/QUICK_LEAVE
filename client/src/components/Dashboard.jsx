import React from 'react'
import { useSelector } from 'react-redux';
import Layout from './Layout';
export const Dashboard = () => {
    const { loading, error, user, isAuthenticated } = useSelector((state) => ({
        loading: state.auth.loading,
        error: state.auth.error,
        user: state.auth.user,
        isAuthenticated: state.auth.isAuthenticated
      }));
    // const user = useSelector(state=>state.auth);
    // console.log("isAuthenticated",isAuthenticated)
    // const loading = useSelector(selectAuthLoading);
    // const error = useSelector(selectAuthError);
  
    if (loading) return <div>Loading...</div>;

  return (
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
  )
}
