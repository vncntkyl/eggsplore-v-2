import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState([]);
  const navigate = useNavigate();
  const signInUser = async (username, password) => {
    const url = "http://localhost/eggsplore-v-2/api/login.php";
    //const url = "../api/login.php";

    try {
      const fd_login = new FormData();
      fd_login.append("user_login", username);
      fd_login.append("password", password);
      const loginResponse = await axios.post(url, fd_login);

      if (loginResponse.status === 200) {
        return loginResponse.data;
      }
    } catch (e) {
      return e.message;
    }
  };

  function getCurrentUser() {
    return sessionStorage.getItem("currentUser");
  }

  function getUserType() {
    if (sessionStorage.getItem("currentUser")) {
      return JSON.parse(sessionStorage.getItem("currentUser")).user_type;
    }
    return null;
  }

  useEffect(() => {
    if (sessionStorage.getItem("currentUser")) {
      setCurrentUser(JSON.parse(sessionStorage.getItem("currentUser")));
    } else {
      navigate("/login");
    }
  }, [sessionStorage]);

  const values = {
    currentUser,
    signInUser,
    setCurrentUser,
    getCurrentUser,
    getUserType,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
