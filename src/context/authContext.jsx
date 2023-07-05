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

  //USER MANAGEMENT
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
  const registerUser = async (newUser) => {
    try {
      const fd_register = new FormData();
      fd_register.append("userdata", JSON.stringify(newUser));
      const register_response = await axios.post(
        url.registerUserURL,
        fd_register
      );
      if (register_response.status === 200) {
        return register_response.data;
      }
    } catch (e) {
      return e.message;
    }
  };
  const getUser = async (id = null) => {
    try {
      const response = await axios.get(url.manageUserURL, {
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
  const deleteUser = async (id) => {
    try {
      const response = await axios.delete(url.manageUserURL, {
        params: {
          id: id,
        },
      });
      if (response.status === 200) {
        console.log(response.data);
      }
    } catch (e) {
      return e.message;
    }
  };
  const updateUser = async (user, id) => {
    try {
      const fd = new FormData();
      fd.append("userdata", user);
      fd.append("user_id", id);
      const response = await axios.post(url.manageUserURL, fd);
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

  //BUILDING MANAGEMENT
  const getBuilding = async (id = null) => {
    try {
      const response = await axios.get(url.manageBuildingURL, {
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
  const addBuilding = async (newBuilding) => {
    try {
      const fd_register = new FormData();
      fd_register.append("add_bldg", 1);
      fd_register.append("number", newBuilding.number);
      fd_register.append("capacity", newBuilding.capacity);
      const response = await axios.post(url.manageBuildingURL, fd_register);
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {
      return e.message;
    }
  };
  const updateBuilding = async (bldg, id) => {
    try {
      const bldg_data = {
        id: id,
        number: bldg.number,
        capacity: bldg.capacity,
      };
      const response = await axios.put(url.manageBuildingURL, bldg_data);
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {
      return e.message;
    }
  };
  const deleteBuilding = async (id) => {
    try {
      const response = await axios.delete(url.manageBuildingURL, {
        params: {
          id: id,
        },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {
      return e.message;
    }
  };

  //FEEDS MANAGEMENT
  const getFeeds = async (id = null) => {
    try {
      const response = await axios.get(url.manageFeedsURL, {
        params: {
          id: id ? id : "all",
        },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {
      return e.message;
    }
  };
  const addFeeds = async (newFeeds) => {
    try {
      const fd_register = new FormData();
      fd_register.append("method", "add");
      fd_register.append("feeds_name", newFeeds.name);
      fd_register.append("feeds_description", newFeeds.description);
      const response = await axios.post(url.manageFeedsURL, fd_register);
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {
      return e.message;
    }
  };
  const updateFeeds = async (feed, id) => {
    try {
      const feeds_data = {
        id: id,
        name: feed.name,
        description: feed.description,
      };
      const response = await axios.put(url.manageFeedsURL, feeds_data);
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {
      return e.message;
    }
  };
  const deleteFeeds = async (id) => {
    try {
      const response = await axios.delete(url.manageFeedsURL, {
        params: {
          id: id,
        },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {
      return e.message;
    }
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
    getFeeds,
    addFeeds,
    signInUser,
    deleteUser,
    updateUser,
    getBuilding,
    addBuilding,
    getUserType,
    updateFeeds,
    deleteFeeds,
    registerUser,
    updateBuilding,
    deleteBuilding,
    getCurrentUser,
    setCurrentUser,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
