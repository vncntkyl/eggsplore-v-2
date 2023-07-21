import { developmentURLs as url } from "./config";
import axios from "axios";

//EGG MANAGEMENT
export const insertEggProcurement = async (eggData, method) => {
  try {
    const eggFD = new FormData();
    eggFD.append("method", method);
    eggFD.append("egg_data", JSON.stringify(eggData));
    const response = await axios.post(url.manageEggsURL, eggFD);
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    return e.message;
  }
};
export const retrieveEggProcurement = async (
  type = "admin",
  selectionType = "all"
) => {
  try {
    const response = await axios.get(url.manageEggsURL, {
      params: {
        retrieve: "procurement",
        type: type,
        selectionType: selectionType,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    return e.message;
  }
};

//CHICK MANAGEMENT

export const retrieveProcurement = async (table, dateFilter) => {
  try {
    const response = await axios.get(url.manageChickenURL, {
      params: {
        retrieve: table,
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
    return e.message;
  }
};

export const addChickProcurement = async (procurement) => {
  try {
    const procurementData = new FormData();
    procurementData.append("procurementDate", procurement.date_procured);
    procurementData.append("chickCount", procurement.no_of_new_chicks);
    procurementData.append("supplier", procurement.supplier);
    procurementData.append("type", "chick");

    const response = await axios.post(url.manageChickenURL, procurementData);
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    return e.message;
  }
};

export const updateChickProcurement = async (procurement, id) => {
  try {
    const procurementData = {
      procurement_id: id,
      procurementDate: procurement.date_procured,
      chickCount: procurement.no_of_new_chicks,
      supplier: procurement.supplier,
    };
    const response = await axios.put(url.manageChickenURL, procurementData);
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.log(e.message);
  }
};

//CHICKEN MANAGEMENT
export const insertChickenMaintenance = async (chickenData, method) => {
  try {
    const chickenForm = new FormData();
    chickenForm.append("method", method);
    chickenForm.append("type", "chicken");
    chickenForm.append("chickenData", JSON.stringify(chickenData));
    const response = await axios.post(url.manageChickenURL, chickenForm);
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    return e.message;
  }
};
