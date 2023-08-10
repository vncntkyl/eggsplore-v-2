import { developmentURLs as url } from "./config";
import axios from "axios";

const retrieveSalesInvoice = async (dateFilter) => {
  try {
    const response = await axios.get(url.manageSalesURL, {
      params: {
        retrieve: "sales_invoice_logs",
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
const retrieveLatestInvoice = async () => {
  try {
    const response = await axios.get(url.manageSalesURL, {
      params: {
        retrieve: "latest_invoice",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    return e.message;
  }
};
const insertSalesInvoice = async (data) => {
  try {
    const salesFD = new FormData();
    salesFD.append("method", "create_invoice");
    salesFD.append("invoice_data", JSON.stringify(data));
    const response = await axios.post(url.manageSalesURL, salesFD);
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    return e.message;
  }
};
const retrieveItems = async (sales_id = null) => {
  try {
    const response = await axios.get(url.manageSalesURL, {
      params: {
        retrieve: "invoice_items",
        sales_id: sales_id ? sales_id : 0,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    return e.message;
  }
};
export const values = {
  insertSalesInvoice,
  retrieveSalesInvoice,
  retrieveLatestInvoice,
  retrieveItems,
};
