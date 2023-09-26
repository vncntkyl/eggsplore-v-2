import React, { useEffect, useState } from "react";
import DatePicker from "../../Fragments/DatePicker";
import EggSalesTable from "../../Tables/EggSalesTable";
import { Modal } from "../../Containers";
import { useFunction } from "../../../context/FunctionContext";
import { Button, TextInput } from "../../Forms";
import { useAuth } from "../../../context/authContext";
import { format, getWeekOfMonth } from "date-fns";

export default function EggSales() {
  const [selectedFilter, selectDateFilter] = useState("all");
  const [modalTitle, setModalTitle] = useState(null);
  const [dateRange, setRange] = useState({ start_date: "", end_date: "" });
  const [eggSalesInformation, setEggSalesInformation] = useState(null);
  const [eggSalesReport, setEggSalesReport] = useState(null);
  const [total, setTotal] = useState({
    quantity: 0,
    amount: 0,
  });

  const { retrieveEggsSold } = useAuth();
  const { capitalize, toTitle } = useFunction();
  const handleClose = () => {
    setModalTitle(null);
    setEggSalesInformation(null);
  };

  const handleDateChange = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const startDate = formData.get("start_date");
    const endDate = formData.get("end_date");

    setRange({
      start_date: startDate,
      end_date: endDate,
    });
    setModalTitle(null);
  };
  useEffect(() => {
    const setup = async () => {
      const response = await retrieveEggsSold(
        format(new Date(eggSalesInformation.date), "w")
      );

      setEggSalesReport(response);
      setTotal({
        quantity: response.reduce(
          (total, item) => parseInt(total) + parseInt(item.total_quantity),
          0
        ),
        amount: response.reduce(
          (total, item) => parseFloat(total) + parseFloat(item.total_amount),
          0
        ),
      });
    };
    if (eggSalesInformation) {
      setup();
    }
  }, [eggSalesInformation, retrieveEggsSold]);
  return (
    <>
      <div className="flex flex-row items-center justify-start p-2 gap-2">
        <p className="whitespace-nowrap">Date Filter: </p>
        <DatePicker
          dateRange={dateRange}
          setModalTitle={setModalTitle}
          selectDateFilter={selectDateFilter}
          selectedFilter={selectedFilter}
          setRange={setRange}
          rangeAndMonthOnly
        />
      </div>
      <div className="max-h-[300px] overflow-auto rounded-md overflow-y-auto shadow-md">
        <EggSalesTable
          setEggSalesInformation={setEggSalesInformation}
          setModal={setModalTitle}
        />
      </div>
      {modalTitle && (
        <Modal
          title={capitalize(modalTitle)}
          onClose={() => handleClose()}
          content={
            modalTitle === "date range picker" ? (
              <>
                <form
                  onSubmit={handleDateChange}
                  className="flex flex-col gap-2"
                >
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
                      value="Show Records"
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
            ) : (
              <>
                <div>
                  <div className="flex gap-2">
                    <p className="font-semibold">Date:</p>
                    {`Week ${getWeekOfMonth(
                      new Date(eggSalesInformation.date)
                    )} of ${format(
                      new Date(eggSalesInformation.date),
                      "MMMM, yyyy"
                    )}`}
                  </div>
                  {eggSalesReport && (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2">
                          <th className="p-2 px-8">Classification</th>
                          <th className="p-2 px-8">Quantity</th>
                          <th className="p-2 px-8">Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {eggSalesReport.map((sale, key) => {
                          return (
                            <tr key={key}>
                              <td align="left" className="p-2 px-8">
                                {capitalize(sale.egg_type_name)}
                              </td>
                              <td align="left" className="p-2 px-8">
                                {sale.total_quantity == 0
                                  ? "--"
                                  : sale.total_quantity}
                              </td>
                              <td align="left" className="p-2 px-8">
                                {sale.total_amount == 0
                                  ? "--"
                                  : Intl.NumberFormat("en-PH", {
                                      style: "currency",
                                      currency: "PHP",
                                    }).format(sale.total_amount)}
                              </td>
                            </tr>
                          );
                        })}
                        <tr>
                          <td colSpan={3}>
                            <div className="border-b-2" />
                          </td>
                        </tr>
                        <tr>
                          <td align="left" className="p-2 px-8">Total</td>
                          <td align="left" className="p-2 px-8">{total.quantity}</td>
                          <td align="left" className="p-2 px-8">
                            {Intl.NumberFormat("en-PH", {
                              style: "currency",
                              currency: "PHP",
                            }).format(total.amount)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )
          }
        />
      )}
    </>
  );
}
