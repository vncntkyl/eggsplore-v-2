import { buildURLs as url } from "./config";
import axios from "axios";

const retrieveDeliveryInformation = async (dateFilter) => {
  try {
    const response = await axios.get(url.manageDeliveryURL, {
      params: {
        retrieve: "delivery_monitoring",
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
const insertDeliveryInformation = async (deliveryData, invoices) => {
  try {
    const deliveryForm = new FormData();
    deliveryForm.append("method", "insert_delivery_info");
    deliveryForm.append("deliveryData", JSON.stringify(deliveryData));
    deliveryForm.append("invoices", JSON.stringify(invoices));
    const response = await axios.post(url.manageDeliveryURL, deliveryForm);
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    return e.message;
  }
};
const updateDeliveryInformation = async (deliveryData, invoices) => {
  try {
    const deliveryInformation = {
      update: true,
      deliveryData: deliveryData,
      invoices: invoices,
    };
    const response = await axios.put(
      url.manageDeliveryURL,
      deliveryInformation
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.log(e.message);
  }
};
const updateDeliveryStatus = async (
  column,
  value,
  id,
  target_arrival = null
) => {
  try {
    const deliveryInformation = {
      column: column,
      value: value,
      delivery_id: id,
      target_arrival: target_arrival,
    };
    const response = await axios.put(
      url.manageDeliveryURL,
      deliveryInformation
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.log(e.message);
  }
};

export const values = {
  retrieveDeliveryInformation,
  insertDeliveryInformation,
  updateDeliveryInformation,
  updateDeliveryStatus,
};
