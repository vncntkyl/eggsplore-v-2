import { buildURLs as url } from "./config";
import axios from "axios";

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
const getMedicineInventory = async (dateFilter) => {
  try {
    const response = await axios.get(url.manageMedicineURL, {
      params: {
        medicine_inventory: true,
        filter:
          typeof dateFilter === "object"
            ? JSON.stringify(dateFilter)
            : dateFilter,
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
const getMedicineReport = async (start, end) => {
  try {
    const response = await axios.get(url.manageMedicineURL, {
      params: {
        medicine_report: true,
        start_date: start,
        end_date: end,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.log(e.message);
  }
};
const getMedicineDisposed = async () => {
  try {
    const response = await axios.get(url.manageMedicineURL, {
      params: {
        medicineDisposed: true,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.log(e.message);
  }
};
export const values = {
  getMedicineReport,
  getMedicineQuantity,
  getMedicationIntake,
  addMedicationIntake,
  getMedicineInventory,
  addMedicineInventory,
  updateMedicationIntake,
  updateMedicineInventory,
  getMedicineDisposed,
};
