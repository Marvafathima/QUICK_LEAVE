import React, { useEffect, useState } from 'react'
import {
    Navbar,
    MobileNav,
    Typography,
    Button,
    IconButton,
    Input,
    Card
  } from "@material-tailwind/react";
  import { useSelector, useDispatch } from 'react-redux';
  import { useNavigate } from 'react-router-dom';

  import { selectIsAuthenticated, selectCurrentUser, logout } from '../app/slice/authSlice'


export const CustomNavbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectCurrentUser);
    const [openNav, setOpenNav] =useState(false);
    const userRole = useSelector((state) => state.auth.user?.role);
    console.log("navbar 24 userrole",userRole)
    useEffect(() => {
      window.addEventListener(
        "resize",
        () => window.innerWidth >= 960 && setOpenNav(false),
      );
    }, []);

    const handleLogout = () => {
      dispatch(logout());
      navigate('/');
  };


      const navList = (
        
        <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
         
          {userRole === "manager" ? (
            <>
            <Typography
              as="li"
              variant="small"
              color="blue-gray"
              className="p-1 font-normal"
            >
              <a href="#" className="flex items-center">
                Dashboard
              </a>
            </Typography>
            <Typography
              as="li"
              variant="small"
              color="blue-gray"
              className="p-1 font-normal"
            >
              <a href="/pending_leave/request" className="flex items-center">
                Leave Requests
              </a>
            </Typography>
            <Typography
              as="li"
              variant="small"
              color="blue-gray"
              className="p-1 font-normal"
            >
              <a href="#" className="flex items-center">
                Rejected Requests
              </a>
            </Typography>
            <Typography
              as="li"
              variant="small"
              color="blue-gray"
              className="p-1 font-normal"
            >
              <a href="#" className="flex items-center">
                Approved Requests
              </a>
            </Typography>
          </> 
          ) : (
            // Render manager options if the user role is manager
            <>
          <Typography
            as="li"
            variant="small"
            color="blue-gray"
            className="p-1 font-normal"
          >
            <a href="#" className="flex items-center">
              Dashboard
            </a>
          </Typography>
          <Typography
            as="li"
            variant="small"
            color="blue-gray"
            className="p-1 font-normal"
          >
            <a href="/leave_application" className="flex items-center">
              Apply for leave
            </a>
          </Typography>
          <Typography
            as="li"
            variant="small"
            color="blue-gray"
            className="p-1 font-normal"
          >
            <a href="#" className="flex items-center">
            My Leave Requests
            </a>
          </Typography>
          <Typography
            as="li"
            variant="small"
            color="blue-gray"
            className="p-1 font-normal"
          >
            <a href="#" className="flex items-center">
            Total leaves Report:
            </a>
          </Typography>
          </>
          )}
        </ul>
      );
  
const authButtons = isAuthenticated ? (
  // Logged in state
  <div className="flex items-center gap-x-1">
      <span className="mr-4 text-sm">{user?.email}</span>
      <Button
          variant="gradient"
          size="sm"
          className="hidden lg:inline-block"
          color="green"
          onClick={handleLogout}
      >
          <span>Logout</span>
      </Button>
  </div>
) : (
  // Logged out state
  <div className="flex items-center gap-x-1">
      <a href="/login">
          <Button
              variant="text"
              size="sm"
              className="hidden lg:inline-block"
          >
              <span>Log In</span>
          </Button>
      </a>
      <a href="/signup">
          <Button
              variant="gradient"
              size="sm"
              className="hidden lg:inline-block"
              color="green"
          >
              <span>Sign up</span>
          </Button>
      </a>
  </div>
);

// Mobile auth buttons
const mobileAuthButtons = isAuthenticated ? (
  <Button 
      ripple={true} 
      fullWidth 
      variant="gradient" 
      size="sm" 
      className=""
      onClick={handleLogout}
  >
      <span>Logout</span>
  </Button>
) : (
  <div className="flex items-center gap-x-1">
      <a href="/login">
          <Button ripple={true} fullWidth variant="text" size="sm" className="">
              <span>Log In</span>
          </Button>
      </a>
      <a href="/signup">
          <Button ripple={true} fullWidth variant="gradient" size="sm" className="">
              <span>Sign up</span>
          </Button>
      </a>
  </div>
);

return (
  <div className="-m-6 max-h-[768px] w-[calc(100%+48px)] overflow-scroll bg-gradient-to-b from-white to-green-300">
      <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4">
          <div className="flex items-center justify-between text-blue-gray-900">
              <Typography
                  as="a"
                  href="#"
                  className="mr-4 cursor-pointer py-1.5 font-bold text-2xl"
              >
                  QUICKLEAVE
              </Typography>
              <div className="flex items-center gap-4">
                  {/* Only show navList if authenticated */}
                  {isAuthenticated && <div className="mr-4 hidden lg:block">{navList}</div>}
                  {authButtons}
                  <IconButton
                      variant="text"
                      className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
                      ripple={false}
                      onClick={() => setOpenNav(!openNav)}
                  >
                      {openNav ? (
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              className="h-6 w-6"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                          >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                              />
                          </svg>
                      ) : (
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                          >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M4 6h16M4 12h16M4 18h16"
                              />
                          </svg>
                      )}
                  </IconButton>
              </div>
          </div>
          <MobileNav open={openNav}>
              {/* Only show navList if authenticated */}
              {isAuthenticated && navList}
              {mobileAuthButtons}
          </MobileNav>
      </Navbar>
  </div>
);
};