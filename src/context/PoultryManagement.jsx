import { developmentURLs as url } from "./config";
import axios from "axios";

//EGG MANAGEMENT
const insertEggProduction = async (eggData, method) => {
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
const retrieveEggProduction = async (dateFilter) => {
  try {
    const response = await axios.get(url.manageEggsURL, {
      params: {
        retrieve: "production",
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

const updateEggProduction = async (eggData) => {
  try {
    const response = await axios.put(
      url.manageEggsURL,
      JSON.stringify(eggData)
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    return e.message;
  }
};

const retrieveEggsForSegregation = async (user_id) => {
  try {
    const response = await axios.get(url.manageEggsURL, {
      params: {
        retrieve: "unsorted_egg_production",
        user_id: user_id,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    return e.message;
  }
};
const insertEggSegregation = async (data) => {
  try {
    const eggFD = new FormData();
    eggFD.append("method", "add_segregation");
    eggFD.append("segregation_data", JSON.stringify(data));
    const response = await axios.post(url.manageEggsURL, eggFD);
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    return e.message;
  }
};

const retrieveSegregationLogs = async (user) => {
  try {
    const response = await axios.get(url.manageEggsURL, {
      params: {
        retrieve: "segregation_logs",
        user_id: user,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    return e.message;
  }
};

const retrieveEggClasifications = async () => {
  try {
    const response = await axios.get(url.manageEggsURL, {
      params: {
        retrieve: "egg_classifications",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    return e.message;
  }
};

const retrieveEggProcurement = async (dateFilter) => {
  try {
    const response = await axios.get(url.manageEggsURL, {
      params: {
        retrieve: "egg_procurement",
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

const insertEggProcurement = async (data) => {
  try {
    const eggFD = new FormData();
    eggFD.append("method", "procure_egg");
    eggFD.append("procurement_data", JSON.stringify(data));
    const response = await axios.post(url.manageEggsURL, eggFD);
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    return e.message;
  }
};
const updateEggProcurement = async (eggData) => {
  eggData.adminUpdate = true;
  try {
    const response = await axios.put(
      url.manageEggsURL,
      JSON.stringify(eggData)
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    return e.message;
  }
};
//CHICK MANAGEMENT

const retrieveProduction = async (table, dateFilter) => {
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

const addChickProcurement = async (procurement) => {
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

const updateChickProcurement = async (procurement, id) => {
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
const insertChickenMaintenance = async (chickenData, method) => {
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
const retrieveChickenPopulation = async () => {
  try {
    const response = await axios.get(url.manageChickenURL, {
      params: { retrievePopulation: true },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    return e.message;
  }
};
const updateChickenPopulation = async (chickendata) => {
  try {
    const response = await axios.put(url.manageChickenURL, {
      chicken_data: JSON.stringify(chickendata),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    return e.message;
  }
};

export const values = {
  retrieveProduction,
  addChickProcurement,
  insertEggProduction,
  updateEggProduction,
  insertEggSegregation,
  insertEggProcurement,
  updateEggProcurement,
  retrieveEggProduction,
  retrieveEggProcurement,
  updateChickProcurement,
  retrieveSegregationLogs,
  updateChickenPopulation,
  insertChickenMaintenance,
  retrieveChickenPopulation,
  retrieveEggClasifications,
  retrieveEggsForSegregation,
};
