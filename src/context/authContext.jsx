/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { developmentURLs as url } from "./config";
import { values as poultryManagement } from "./PoultryContext";
import { values as medicineManagement } from "./MedicineContext";
import { values as feedsManagement } from "./FeedsContext";
import { values as salesManagement } from "./SalesContext";
import { values as deliveryManagement } from "./DeliveryContext";
import { values as financialManagement } from "./FinancialContext";

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
  const updateUser = async (user, buildings, id) => {
    try {
      const fd = new FormData();
      fd.append("userdata", user);
      fd.append("buildingdata", buildings);
      fd.append("user_id", id);
      const response = await axios.post(url.manageUserURL, fd);
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {
      return e.message;
    }
  };
  const updatePassword = async (old, updated, id) => {
    try {
      const fd = new FormData();
      fd.append("update_password", true);
      fd.append("currentPassword", old);
      fd.append("newPassword", updated);
      fd.append("userId", id);
      const response = await axios.post(url.manageUserURL, fd);
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {
      return e.message;
    }
  };
  const resetPassword = async (old, updated, id) => {
    try {
      const fd = new FormData();
      fd.append("resetPassword", true);
      fd.append("newPassword", updated);
      fd.append("userId", id);
      const response = await axios.post(url.manageUserURL, fd);
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {
      return e.message;
    }
  };
  const getCurrentUser = () => {
    return localStorage.getItem("currentUser");
  };
  const getUserType = () => {
    if (localStorage.getItem("currentUser")) {
      return JSON.parse(localStorage.getItem("currentUser")).user_type;
    }
    return null;
  };
  const getNotifications = async () => {
    try {
      const response = await axios.get(url.manageUserURL, {
        params: {
          user_notifications: true,
        },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {
      return e.message;
    }
  };

  const checkEmail = async (email) => {
    try {
      const data = new FormData();
      data.append("checkEmail", email);
      const emailResponse = await axios.post(url.manageUserURL, data);
      if (emailResponse.status === 200) {
        return emailResponse.data;
      }
    } catch (e) {
      return e.message;
    }
  };
  //BUILDING MANAGEMENT
  const getBuilding = async (id = null, user_id = null) => {
    try {
      const params = {
        getBuilding: id ? id : "all",
      };
      if (user_id !== null) {
        params.user = user_id;
      }
      const response = await axios.get(url.manageBuildingURL, {
        params: params,
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

  //MEDICINE MANAGEMENT
  const getMedicine = async (id = null) => {
    try {
      const response = await axios.get(url.manageMedicineURL, {
        params: {
          id: id ? id : "all",
        },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  const addMedicine = async (newMedicine) => {
    try {
      const fd = new FormData();
      fd.append("method", "add");
      fd.append("medicine_name", newMedicine.medicine_name);
      fd.append("dosage_instructions", newMedicine.dosage_instructions);
      fd.append("usage_indication", newMedicine.usage_indication);

      const response = await axios.post(url.manageMedicineURL, fd);
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  const updateMedicine = async (medicine, id) => {
    try {
      const medicine_data = {
        medicine_id: id,
        medicine_name: medicine.medicine_name,
        dosage_instructions: medicine.dosage_instructions,
        usage_indication: medicine.usage_indication,
      };
      const response = await axios.put(url.manageMedicineURL, medicine_data);
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  const deleteMedicine = async (id) => {
    try {
      const response = await axios.delete(url.manageMedicineURL, {
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

  //LOCATION MANAGEMENT
  const getLocation = async (id = null) => {
    try {
      const response = await axios.get(url.manageLocationsURL, {
        params: {
          id: id ? id : "all",
        },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  const addLocation = async (newLocation) => {
    try {
      const fd = new FormData();
      fd.append("method", "add");
      fd.append("location_name", newLocation.location_name);
      const response = await axios.post(url.manageLocationsURL, fd);
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  const updateLocation = async (location, id) => {
    try {
      const location_data = {
        location_id: id,
        location_name: location.location_name,
      };
      const response = await axios.put(url.manageLocationsURL, location_data);
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  const deleteLocation = async (id) => {
    try {
      const response = await axios.delete(url.manageLocationsURL, {
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

  const checkPasswordStrength = (password) => {
    // Define regex patterns for each requirement
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /\d/;
    const symbolRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;

    // Check each requirement
    const hasUppercase = uppercaseRegex.test(password);
    const hasLowercase = lowercaseRegex.test(password);
    const hasNumber = numberRegex.test(password);
    const hasSymbol = symbolRegex.test(password);
    const isLengthValid = password.length >= 8;

    // Generate prompts based on requirements
    const prompts = [];

    if (!hasUppercase) {
      prompts.push("Include at least one uppercase letter.");
    }

    if (!hasLowercase) {
      prompts.push("Include at least one lowercase letter.");
    }

    if (!hasNumber) {
      prompts.push("Include at least one number.");
    }

    if (!hasSymbol) {
      prompts.push("Include at least one symbol.");
    }

    if (!isLengthValid) {
      prompts.push("Ensure the password is at least 8 characters long.");
    }

    return prompts;
  };
  useEffect(() => {
    if (localStorage.getItem("currentUser")) {
      setCurrentUser(JSON.parse(localStorage.getItem("currentUser")));
    } else {
      navigate("/login");
    }
  }, [localStorage]);

  const values = {
    currentUser,
    navigate,
    getUser,
    getFeeds,
    addFeeds,
    signInUser,
    deleteUser,
    updateUser,
    checkEmail,
    getLocation,
    addLocation,
    getBuilding,
    getMedicine,
    addMedicine,
    addBuilding,
    getUserType,
    updateFeeds,
    deleteFeeds,
    registerUser,
    resetPassword,
    updatePassword,
    updateLocation,
    deleteLocation,
    updateMedicine,
    deleteMedicine,
    updateBuilding,
    deleteBuilding,
    getCurrentUser,
    setCurrentUser,
    getNotifications,
    checkPasswordStrength,
    ...salesManagement,
    ...feedsManagement,
    ...poultryManagement,
    ...deliveryManagement,
    ...medicineManagement,
    ...financialManagement,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
