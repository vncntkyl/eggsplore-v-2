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

  useEffect(() => {
    if (sessionStorage.getItem("currentUser")) {
      setCurrentUser(sessionStorage.getItem("currentUser"));
    } else {
      navigate("/login");
    }
  }, [currentUser]);

  const values = {
    currentUser,
    signInUser,
    setCurrentUser,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
