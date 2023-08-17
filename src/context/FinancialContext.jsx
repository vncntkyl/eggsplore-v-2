import { developmentURLs as url } from "./config";
import axios from "axios";

const retrieveMonthlyIncome = async () => {
  try {
    const response = await axios.get(url.manageFinancialsURL, {
      params: {
        retrieve: "monthly income",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.log(e.message);
  }
};
const retrieveSalesFromRange = async (startDate, endDate) => {
  try {
    const response = await axios.get(url.manageFinancialsURL, {
      params: {
        retrieve: "sales",
        start_date: startDate,
        end_date: endDate,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.log(e.message);
  }
};
const createIncomeStatement = async (incomeStatement) => {
  try {
    const incomeStatementData = new FormData();
    incomeStatementData.append(
      "create_income",
      JSON.stringify(incomeStatement)
    );

    const response = await axios.post(
      url.manageFinancialsURL,
      incomeStatementData
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    return e.message;
  }
};

export const values = {
  retrieveMonthlyIncome,
  retrieveSalesFromRange,
  createIncomeStatement,
};
