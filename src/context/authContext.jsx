/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { developmentURLs as url } from "./config";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState([]);
  const navigate = useNavigate();

  const signInUser = async (username, password) => {
    try {
      const fd_login = new FormData();
      fd_login.append("user_login", username);
      fd_login.append("password", password);
      const loginResponse = await axios.post(url.loginURL, fd_login);

      if (loginResponse.status === 200) {
        return loginResponse.data;
      }
    } catch (e) {
      return e.message;
    }
  };

  const getUser = async (id = null) => {
    try {
      const response = await axios.get(url.getUserURL, {
        params: {
          getUser: id ? id : "all",
        },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {
      return e.message;
    }
  };
  const getBuilding = async (id = null) => {
    try {
      const response = await axios.get(url.getBuildingURL, {
        params: {
          getBuilding: id ? id : "all",
        },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {
      return e.message;
    }
  };
  const getCurrentUser = () => {
    return sessionStorage.getItem("currentUser");
  };

  const getUserType = () => {
    if (sessionStorage.getItem("currentUser")) {
      return JSON.parse(sessionStorage.getItem("currentUser")).user_type;
    }
    return null;
  };

  useEffect(() => {
    if (sessionStorage.getItem("currentUser")) {
      setCurrentUser(JSON.parse(sessionStorage.getItem("currentUser")));
    } else {
      navigate("/login");
    }
  }, [sessionStorage]);

  const values = {
    currentUser,
    navigate,
    getUser,
    signInUser,
    getBuilding,
    getUserType,
    getCurrentUser,
    setCurrentUser,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
