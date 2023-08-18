/* eslint-disable react/prop-types */
import { AiFillCalendar, AiFillPlusCircle } from "react-icons/ai";
import { Button, TextInput } from "../../Forms";
import { useEffect, useState } from "react";
import { Alert, Modal } from "../../Containers";
import { useFunction } from "../../../context/FunctionContext";
import { format } from "date-fns";
import classNames from "classnames";
import { useAuth } from "../../../context/authContext";
import MonthlyIncomeStatement from "./MonthlyIncomeStatement";

export default function Financials() {
  const [modalTitle, setModalTitle] = useState(null);
  const [dateModal, setDateModal] = useState(null);
  const [alert, toggleAlert] = useState({
    type: "success",
    title: "",
    message: "",
    show: false,
  });

  const [salesData, setSalesData] = useState({
    egg_sales: 0,
    medicine_and_feeds_cost: 0,
    labor: 0,
    other_direct_cost: 0,
    total_cost_of_goods_sold: 0,
    gross_profit: 0,
    transport_and_logistics: 0,
    rent_and_utilities: 0,
    insurance: 0,
    repairs_and_maintenance: 0,
    salaries_and_wages: 0,
    other_operating_expenses: 0,
    total_operating_cost: 0,
    net_income_before_tax: 0,
    taxes: 0,
    net_income: 0,
    expenses: 0,
  });
  const [dateRange, setRange] = useState({ start_date: "", end_date: "" });

  const { capitalize, toTitle } = useFunction();
  const { retrieveSalesFromRange, createIncomeStatement } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const incomeStatement = { ...salesData };
    incomeStatement.transport_and_logistics = incomeStatement.expenses
      ? incomeStatement.expenses
      : 0;
    delete incomeStatement.expenses;
    incomeStatement.gross_profit = getGrossProfit();
    incomeStatement.total_cost_of_goods_sold = getTotalGoodsCost();
    incomeStatement.total_operating_cost = getTotalOperatingExpenses();
    incomeStatement.net_income_before_tax = getNetIncomeBeforeTaxes();
    incomeStatement.taxes = getTaxes();
    incomeStatement.net_income = getNetIncome();

    Object.keys(incomeStatement).map((amount) => {
      incomeStatement[amount] = formatValues(incomeStatement[amount]);
    });

    const response = await createIncomeStatement(
      incomeStatement,
      dateRange,
      format(new Date(), "yyyy-MM-dd HH:mm:ss")
    );
    setModalTitle(null);
    setRange({
      start_date: "",
      end_date: "",
    });
    if (response === 1) {
      toggleAlert({
        type: "success",
        title: "Income Statement Creation Success",
        message: "You have successfully created new income statement.",
        show: true,
      });
    } else {
      toggleAlert({
        type: "warning",
        title: "Income Statement Creation Error",
        message:
          "There has been an error on creating income statement. Please try again.",
        show: true,
      });
    }
  };
  const handleClose = () => {
    setDateModal(null);
    setModalTitle(null);
    toggleAlert({
      type: "success",
      title: "",
      message: "",
      show: false,
    });
    setSalesData({
      egg_sales: 0,
      medicine_and_feeds_cost: 0,
      labor: 0,
      other_direct_cost: 0,
      total_cost_of_goods_sold: 0,
      gross_profit: 0,
      transport_and_logistics: 0,
      rent_and_utilities: 0,
      insurance: 0,
      repairs_and_maintenance: 0,
      salaries_and_wages: 0,
      other_operating_expenses: 0,
      total_operating_cost: 0,
      net_income_before_tax: 0,
      taxes: 0,
      net_income: 0,
      expenses: 0,
    });
  };
  const handleDateChange = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const startDate = formData.get("start_date");
    const endDate = formData.get("end_date");

    setRange({
      start_date: startDate,
      end_date: endDate,
    });
    const response = await retrieveSalesFromRange(startDate, endDate);
    setSalesData((current) => {
      return {
        ...current,
        egg_sales: response.egg_sales,
        medicine_and_feeds_cost: response.medicine_and_feeds_cost,
        expenses: response.expenses,
      };
    });
    setDateModal(null);
  };

  const Header = ({ title, className }) => {
    return (
      <span className={classNames(className, "font-semibold text-start")}>
        {title}
      </span>
    );
  };

  const DefaultField = ({ id, value, labelClass, padding = "px-12" }) => {
    return (
      <div
        className={classNames(
          "p-1 flex flex-row items-center justify-between",
          padding
        )}
      >
        <label htmlFor={id} className={labelClass}>
          {capitalize(toTitle(id))}
        </label>
        <input
          type="text"
          id={id}
          disabled
          value={Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
          }).format(value)}
          className="bg-default rounded px-2 p-1 outline-none disabled:bg-white"
        />
      </div>
    );
  };

  const formatValues = (value) => {
    return parseFloat(value).toFixed(2);
  };

  const getTotalGoodsCost = () => {
    return (
      parseFloat(salesData.labor) +
      parseFloat(
        salesData.medicine_and_feeds_cost
          ? salesData.medicine_and_feeds_cost
          : 0
      ) +
      parseFloat(salesData.other_direct_cost)
    );
  };
  const getGrossProfit = () => {
    return (
      parseFloat(salesData.egg_sales ? salesData.egg_sales : 0) -
      parseFloat(getTotalGoodsCost())
    );
  };
  const getTotalOperatingExpenses = () => {
    return (
      parseFloat(salesData.expenses ? salesData.expenses : 0) +
      parseFloat(salesData.rent_and_utilities) +
      parseFloat(salesData.insurance) +
      parseFloat(salesData.repairs_and_maintenance) +
      parseFloat(salesData.salaries_and_wages) +
      parseFloat(salesData.other_operating_expenses)
    );
  };
  const getNetIncomeBeforeTaxes = () => {
    return (
      parseFloat(getGrossProfit()) - parseFloat(getTotalOperatingExpenses())
    );
  };
  const getTaxes = () => {
    return parseFloat(getNetIncomeBeforeTaxes()) * 0.2;
  };
  const getNetIncome = () => {
    return parseFloat(getNetIncomeBeforeTaxes()) - parseFloat(getTaxes());
  };

  return (
    <>
      <div className="flex flex-col gap-4 px-48">
        <div className="flex flex-row justify-between items-center w-full">
          <p className="font-semibold">Income Statement</p>
          <Button
            onClick={() => setModalTitle("create income statement")}
            value={
              <div className="flex items-center gap-1">
                <AiFillPlusCircle />
                <span>Create Income Statement</span>
              </div>
            }
            className={
              "bg-main text-white p-1 px-2 rounded-full text-[.9rem] transition-all hover:bg-tertiary hover:text-main"
            }
          />
        </div>
        <div className="bg-white rounded-md p-2">
          <MonthlyIncomeStatement />
        </div>
      </div>
      {modalTitle && (
        <Modal
          title={capitalize(modalTitle)}
          onClose={() => handleClose()}
          className="min-w-[550px]"
          content={
            <>
              <form onSubmit={handleSubmit} className="w-full">
                <div className="flex flex-row gap-2 items-center pb-2">
                  <Header title="Time Period" />
                  <Button
                    onClick={() => setDateModal("Select Date Range")}
                    value={
                      <div className="flex items-center gap-1">
                        <AiFillCalendar />
                        <span>
                          {Object.values(dateRange).every(
                            (value) => value != ""
                          ) ? (
                            <>
                              {`${format(
                                new Date(dateRange.start_date),
                                "MMMM d, yyyy"
                              )} - ${format(
                                new Date(dateRange.end_date),
                                "MMMM d, yyyy"
                              )}`}
                            </>
                          ) : (
                            "Select Date Range"
                          )}
                        </span>
                      </div>
                    }
                    className={
                      "bg-default p-1 px-2 rounded-md text-[.9rem] transition-all"
                    }
                  />
                </div>
                <hr />
                <div className="max-h-[500px] overflow-y-auto">
                  <div className="flex flex-col">
                    <Header title="Revenue" className="px-6" />
                    <DefaultField id="egg_sales" value={salesData.egg_sales} />
                  </div>
                  <div className="flex flex-col">
                    <Header title="Cost of Goods Sold" className="px-6" />
                    <DefaultField
                      id="feeds_and_medicine"
                      value={salesData.medicine_and_feeds_cost}
                    />
                    {["labor", "other_direct_cost"].map((label, index) => {
                      return (
                        <TextInput
                          key={index}
                          type="number"
                          step={0.01}
                          withLabel={capitalize(toTitle(label))}
                          id={label}
                          name={label}
                          value={salesData[label]}
                          onChange={(e) => {
                            setSalesData((current) => {
                              return {
                                ...current,
                                [label]: parseFloat(e.target.value),
                              };
                            });
                          }}
                          classes={"p-1 px-12 items-center justify-between"}
                          labelClasses={"whitespace-nowrap text-start"}
                          inputClasses={
                            "bg-default rounded p-1 px-2 outline-none"
                          }
                          wfull="w-fit"
                        />
                      );
                    })}
                    {["total_cost_of_goods_sold", "gross_profit"].map(
                      (label, index) => {
                        return (
                          <DefaultField
                            key={index}
                            id={label}
                            value={
                              index === 0
                                ? getTotalGoodsCost()
                                : getGrossProfit()
                            }
                            labelClass={index === 1 && "font-semibold"}
                            padding={index === 1 ? "px-6" : "px-12"}
                          />
                        );
                      }
                    )}
                  </div>
                  <div className="flex flex-col">
                    <Header title="Operating Expenses" className="px-6" />
                    <DefaultField
                      id="transportation_and_logistics"
                      value={salesData.expenses ? salesData.expenses : 0}
                    />
                    {[
                      "rent_and_utilities",
                      "insurance",
                      "repairs_and_maintenance",
                      "salaries_and_wages",
                      "other_operating_expenses",
                    ].map((label, index) => {
                      return (
                        <TextInput
                          key={index}
                          type="number"
                          step={0.01}
                          withLabel={capitalize(toTitle(label))}
                          id={label}
                          name={label}
                          value={salesData[label]}
                          onChange={(e) => {
                            setSalesData((current) => {
                              return {
                                ...current,
                                [label]: parseFloat(e.target.value),
                              };
                            });
                          }}
                          classes={"p-1 px-12 items-center justify-between"}
                          labelClasses={"whitespace-nowrap text-start"}
                          inputClasses={
                            "bg-default rounded p-1 px-2 outline-none"
                          }
                          wfull="w-fit"
                        />
                      );
                    })}
                    <DefaultField
                      id="total_operating_cost"
                      value={getTotalOperatingExpenses()}
                    />
                    {["net_income_before_taxes", "taxes", "net_income"].map(
                      (label, index) => {
                        return (
                          <DefaultField
                            key={index}
                            id={label}
                            value={
                              index === 0
                                ? getNetIncomeBeforeTaxes()
                                : index === 1
                                ? getTaxes()
                                : getNetIncome()
                            }
                            labelClass={"font-semibold"}
                            padding={"px-6"}
                          />
                        );
                      }
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="submit"
                    value="Create"
                    className="bg-tertiary p-1 px-2 rounded-md hover:bg-main hover:text-white transition-all"
                  />
                  <Button
                    value="Cancel"
                    onClick={() => handleClose()}
                    className="bg-gray-200 text-gray-700 p-1 px-2 rounded-md"
                  />
                </div>
              </form>
            </>
          }
        />
      )}
      {dateModal && (
        <Modal
          title={capitalize(modalTitle)}
          onClose={() => {
            setDateModal(null);
          }}
          content={
            <form onSubmit={handleDateChange} className="flex flex-col gap-2">
              <span>Select the date range to display the records.</span>
              <div className="flex flex-row gap-2">
                {Object.keys(dateRange).map((label, index) => {
                  return (
                    <TextInput
                      key={index}
                      name={label}
                      type="date"
                      id={label}
                      withLabel={capitalize(toTitle(label))}
                      classes="p-1 items-center justify-between"
                      labelClasses="whitespace-nowrap text-start"
                      inputClasses="bg-default rounded px-2"
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="submit"
                  value="Save"
                  className="bg-tertiary p-1 px-2 rounded-md hover:bg-main hover:text-white transition-all"
                />
                <Button
                  value="Cancel"
                  onClick={() => handleClose()}
                  className="bg-gray-200 text-gray-700 p-1 px-2 rounded-md"
                />
              </div>
            </form>
          }
        />
      )}
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          title={alert.title}
          onClose={() => handleClose()}
        />
      )}
    </>
  );
}
