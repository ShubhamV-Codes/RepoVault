import React, { useEffect } from 'react'
import {useNavigate, useRoutes} from 'react-router-dom';

// Page-List
import Dashboard from './components/dashboard/Dashboard.jsx';
import CreateRepository from "./components/repo/CreateRepository";
import RepositoryDetails from "./components/repo/RepositoryDetails";
import Login from './components/auth/Login.jsx';
import Signup from './components/auth/Signup.jsx';
import Profile from './components/user/Profile.jsx';
import AddFile from './components/repo/AddFile';

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
        },
        {
            path: "/repo/create",           
            element: <CreateRepository/>     
        },
        {
    path: "/repo/:repoId",           
    element: <RepositoryDetails/>     
  },
  {

    path: "/repo/:repoId/add-file",         
    element: <AddFile/>    
  }

    ]);

    return element;

}

export default ProjectRoutes;