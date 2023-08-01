/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { developmentURLs as url } from "./config";
import {
  insertEggProcurement,
  retrieveEggProcurement,
  retrieveProcurement,
  addChickProcurement,
  updateChickProcurement,
  insertChickenMaintenance,
  retrieveChickenPopulation,
  updateChickenPopulation,
} from "./PoultryManagement";

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
  const getCurrentUser = () => {
    return localStorage.getItem("currentUser");
  };
  const getUserType = () => {
    if (localStorage.getItem("currentUser")) {
      return JSON.parse(localStorage.getItem("currentUser")).user_type;
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
  const getMedicationIntake = async (id = null) => {
    try {
      const response = await axios.get(url.manageMedicineURL, {
        params: {
          id: id ? id : "all",
          medication_intake: true,
        },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  const getMedicineQuantity = async () => {
    try {
      const response = await axios.get(url.manageMedicineURL, {
        params: {
          medicineCurrentQuantity: true,
        },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  const getMedicineInventory = async () => {
    try {
      const response = await axios.get(url.manageMedicineURL, {
        params: {
          medicine_inventory: true,
        },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  const addMedicineInventory = async (newInventory) => {
    try {
      const medicineData = new FormData();
      medicineData.append("method", "add inventory");
      medicineData.append("medicine_data", JSON.stringify(newInventory));
      const response = await axios.post(url.manageMedicineURL, medicineData);
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
  const addMedicationIntake = async (newMedicationIntake) => {
    try {
      const fd = new FormData();
      fd.append("method", "add intake");
      fd.append("data", JSON.stringify(newMedicationIntake));

      const response = await axios.post(url.manageMedicineURL, fd);
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  const updateMedicationIntake = async (medicationIntake) => {
    try {
      const updateIntake = { ...medicationIntake };
      updateIntake.updateIntake = true;
      console.log(updateIntake);

      const response = await axios.put(url.manageMedicineURL, updateIntake);
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
  const updateMedicineInventory = async (medicine_data) => {
    const updatedMedicine = { ...medicine_data };
    delete updatedMedicine.update;
    updatedMedicine.updateInventory = true;
    console.log(updatedMedicine);
    try {
      const response = await axios.put(url.manageMedicineURL, updatedMedicine);
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
    updateLocation,
    deleteLocation,
    updateMedicine,
    deleteMedicine,
    updateBuilding,
    deleteBuilding,
    getCurrentUser,
    setCurrentUser,
    getMedicineQuantity,
    getMedicationIntake,
    addMedicationIntake,
    retrieveProcurement,
    addChickProcurement,
    getMedicineInventory,
    addMedicineInventory,
    insertEggProcurement,
    retrieveEggProcurement,
    updateChickProcurement,
    updateMedicationIntake,
    updateChickenPopulation,
    updateMedicineInventory,
    insertChickenMaintenance,
    retrieveChickenPopulation,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
