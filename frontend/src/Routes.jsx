import React, { useEffect } from 'react'
import {useNavigate, useRoutes} from 'react-router-dom';

// Page-List
import Dashboard from './components/dashboard/Dashboard.jsx';
import Login from './components/auth/Login.jsx';
import Signup from './components/auth/Signup.jsx';
import Profile from './components/user/Profile.jsx';

// Auth Context
import {useAuth} from './authContext.jsx';

const ProjectRoutes = () => {
    const {currentUser, setCurrentUser} =  useAuth();
    const navigate = useNavigate();

    useEffect(() => {
  const userIdFromStorage = localStorage.getItem('userId');

  // restore session
  if (userIdFromStorage && !currentUser) {
    setCurrentUser({ id: userIdFromStorage });
  }

  // protect private routes
  if (!userIdFromStorage && !["/auth", "/signup"].includes(window.location.pathname)) {
    navigate("/auth");
  }

  // prevent logged-in users from seeing auth pages
  if (userIdFromStorage && ["/auth", "/signup"].includes(window.location.pathname)) {
    navigate("/");
  }

}, [currentUser, navigate, setCurrentUser]);


    let element = useRoutes ([
        {
            path :"/",
            element:<Dashboard/>
        },
        {
            path :"/auth",
            element:<Login/>
        },
        {
            path :"/signup",
            element:<Signup/>
        },
        {
            path: "/profile",
            element: <Profile/>
        }
    ]);

    return element;

}

export default ProjectRoutes;