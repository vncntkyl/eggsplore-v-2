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
const retrieveEggSales = async () => {
  try {
    const response = await axios.get(url.manageSalesURL, {
      params: {
        retrieve: "egg_sales",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    return e.message;
  }
};
const retrieveSalesOverview = async () => {
  try {
    const response = await axios.get(url.manageSalesURL, {
      params: {
        retrieve: "sales_overview",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    return e.message;
  }
};
const retrieveEggsSold = async (week) => {
  try {
    const response = await axios.get(url.manageSalesURL, {
      params: {
        retrieve: "eggs_sold",
        week: week,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    return e.message;
  }
};
const retrieveDeliveryInvoice = async (dispatch_id) => {
  try {
    const response = await axios.get(url.manageSalesURL, {
      params: {
        retrieve: "delivery_invoice",
        dispatch_id: dispatch_id,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    return e.message;
  }
};
const retrieveSalesInvoiceForDispatch = async () => {
  try {
    const response = await axios.get(url.manageSalesURL, {
      params: {
        retrieve: "invoice_for_dispatch",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    return e.message;
  }
};
const retrieveSalesSummaryReport = async (st, en) => {
  try {
    const response = await axios.get(url.manageSalesURL, {
      params: {
        retrieve: "sales_summary_report",
        start: st,
        end: en,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    return e.message;
  }
};
const updateSalesInvoice = async (sales_data) => {
  try {
    const salesInformation = {
      data: sales_data,
    };
    const response = await axios.put(url.manageSalesURL, salesInformation);
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.log(e.message);
  }
};
const updateSalesDeliveryInvoice = async (sales_id, dispatch_id) => {
  try {
    const salesInformation = {
      sales_id: sales_id,
      dispatch_id: dispatch_id,
    };
    const response = await axios.put(url.manageSalesURL, salesInformation);
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.log(e.message);
  }
};
const getInvoicesForDelivery = async (delivery_id) => {
  try {
    const response = await axios.get(url.manageSalesURL, {
      params: {
        retrieve: "dispatch_invoices",
        delivery_id: delivery_id,
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
  retrieveItems,
  retrieveEggSales,
  retrieveEggsSold,
  insertSalesInvoice,
  retrieveSalesInvoice,
  updateSalesInvoice,
  retrieveLatestInvoice,
  retrieveSalesOverview,
  getInvoicesForDelivery,
  retrieveDeliveryInvoice,
  updateSalesDeliveryInvoice,
  retrieveSalesSummaryReport,
  retrieveSalesInvoiceForDispatch,
};
