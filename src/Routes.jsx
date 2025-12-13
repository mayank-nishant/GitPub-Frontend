import React, { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";

import Dashboard from "../src/components/dashboard/Dashboard.jsx";
import Profile from "../src/components/user/Profile.jsx";
import Login from "../src/components/auth/Login.jsx";
import Signup from "../src/components/auth/Signup.jsx";
import RepoList from "../src/components/repo/List.jsx";
import RepoDetail from "../src/components/repo/Detail.jsx";
import IssueList from "../src/components/issue/List.jsx";
import IssueDetail from "../src/components/issue/Detail.jsx";

import { useAuth } from "../src/authContext.jsx";

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");

    if (userIdFromStorage && !currentUser) {
      setCurrentUser(userIdFromStorage);
    }

    if (!userIdFromStorage && window.location.pathname === "/") {
      navigate("/auth");
    }

    if (!userIdFromStorage && window.location.pathname === "/profile") {
      navigate("/auth");
    }

    if (userIdFromStorage && ["/auth", "/signup"].includes(window.location.pathname)) {
      navigate("/");
    }
  }, [currentUser, setCurrentUser, navigate]);

  let element = useRoutes([
    {
      path: "/",
      element: <Dashboard></Dashboard>,
    },
    {
      path: "/auth",
      element: <Login></Login>,
    },
    {
      path: "/signup",
      element: <Signup></Signup>,
    },
    {
      path: "/profile",
      element: <Profile></Profile>,
    },
    {
      path: "/repos",
      element: <RepoList></RepoList>,
    },
    {
      path: "/repo/:id",
      element: <RepoDetail></RepoDetail>,
    },
    {
      path: "/repos/:id/issues",
      element: <IssueList></IssueList>,
    },
    {
      path: "/issue/:id",
      element: <IssueDetail></IssueDetail>,
    },
  ]);

  return element;
};

export default ProjectRoutes;
