/* eslint-disable react/prop-types */
import { AiFillCalendar, AiFillPlusCircle } from "react-icons/ai";
import { Button, TextInput } from "../../Forms";
import { useEffect, useState } from "react";
import { Alert, Modal } from "../../Containers";
import { useFunction } from "../../../context/FunctionContext";
import { format } from "date-fns";
import classNames from "classnames";
import { useAuth } from "../../../context/authContext";

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
  const { retrieveSalesFromRange } = useAuth();
  const handleSubmit = (e) => {
    e.preventDefault();
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

  const DefaultField = ({ id, value }) => {
    return (
      <div className="p-1 px-12 flex flex-row items-center justify-between">
        <label htmlFor={id}>{capitalize(toTitle(id))}</label>
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
  const InputField = ({ id, value }) => {
    return (
      <div className="p-1 px-12 flex flex-row items-center justify-between">
        <label htmlFor={id}>{capitalize(toTitle(id))}</label>
        <input
          type="number"
          id={id}
          min={0}
          step={0.01}
          value={value}
          onChange={(e) => {
            setSalesData((current) => {
              return {
                ...current,
                [id]: parseFloat(e.target.value),
              };
            });
          }}
          className="bg-default rounded px-2 p-1 outline-none"
        />
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col gap-4 items-end px-48">
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
                  <InputField id="labor" value={salesData.labor} />
                  <InputField
                    id="other_direct_cost"
                    value={salesData.other_direct_cost}
                  />
                </div>
                {/* <Header title="Gross Profit" />
                <Header title="Operating Expenses" /> */}
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
