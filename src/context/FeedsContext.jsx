import { buildURLs as url } from "./config";
import axios from "axios";

const getFeedsConsumption = async (id = null) => {
  try {
    const response = await axios.get(url.manageFeedsURL, {
      params: {
        id: id ? id : "all",
        feeds_consumption: true,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.log(e.message);
  }
};
const getFeedQuantity = async () => {
  try {
    const response = await axios.get(url.manageFeedsURL, {
      params: {
        feedsCurrentQuantity: true,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.log(e.message);
  }
};
const getFeedsInventory = async (dateFilter) => {
  try {
    const response = await axios.get(url.manageFeedsURL, {
      params: {
        feeds_inventory: true,
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
const getFeedsAndMedicineOverview = async () => {
  try {
    const response = await axios.get(url.manageFeedsURL, {
      params: {
        feeds_medicine: true,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.log(e.message);
  }
};
const getFeedsAndMedicineSummary = async () => {
  try {
    const response = await axios.get(url.manageFeedsURL, {
      params: {
        feeds_medicine_summary: true,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.log(e.message);
  }
};
const getMaintenanceReport = async (start_date, end_date) => {
  try {
    const response = await axios.get(url.manageFeedsURL, {
      params: {
        maintenance_report: true,
        start: start_date,
        end: end_date,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.log(e.message);
  }
};
const getFeedsReport = async (start_date, end_date) => {
  try {
    const response = await axios.get(url.manageFeedsURL, {
      params: {
        feeds_report: true,
        start: start_date,
        end: end_date,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.log(e.message);
  }
};
const retrieveFeedsDisposed = async () => {
  try {
    const response = await axios.get(url.manageFeedsURL, {
      params: {
        feedsDisposed: true,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.log(e.message);
  }
};
const addFeedsInventory = async (newInventory) => {
  try {
    const feedsData = new FormData();
    feedsData.append("method", "add inventory");
    feedsData.append("feeds_data", JSON.stringify(newInventory));
    const response = await axios.post(url.manageFeedsURL, feedsData);
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.log(e.message);
  }
};
const updateFeedsInventory = async (feeds_data) => {
  const updatedFeeds = { ...feeds_data };
  delete updatedFeeds.update;
  updatedFeeds.updateInventory = true;
  console.log(updatedFeeds);
  try {
    const response = await axios.put(url.manageFeedsURL, updatedFeeds);
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.log(e.message);
  }
};
const addFeedsConsumption = async (newFeedsConsumption) => {
  try {
    const fd = new FormData();
    fd.append("method", "add consumption");
    fd.append("data", JSON.stringify(newFeedsConsumption));

    const response = await axios.post(url.manageFeedsURL, fd);
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.log(e.message);
  }
};
const updateFeedsConsumption = async (feedsConsumption) => {
  try {
    const updateIntake = { ...feedsConsumption };
    updateIntake.updateConsumption = true;

    const response = await axios.put(url.manageFeedsURL, updateIntake);
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.log(e.message);
  }
};
export const values = {
  getFeedsReport,
  getFeedQuantity,
  getFeedsConsumption,
  addFeedsConsumption,
  getFeedsInventory,
  addFeedsInventory,
  updateFeedsConsumption,
  updateFeedsInventory,
  getMaintenanceReport,
  getFeedsAndMedicineOverview,
  getFeedsAndMedicineSummary,
  retrieveFeedsDisposed,
};
