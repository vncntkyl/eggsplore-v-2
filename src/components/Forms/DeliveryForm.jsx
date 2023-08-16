/* eslint-disable react/prop-types */
import React from "react";
import { useFunction } from "../../context/FunctionContext";
import TextInput from "./TextInput";
import Button from "./Button";

export default function DeliveryForm({
  modalTitle,
  deliveryInformation,
  handleClose,
  handleRegistration,
  handleUpdate,
  setDeliveryInformation,
  setSelectedInvoices,
  selectedInvoices = [],
  salesInvoices,
}) {
  const { capitalize, toTitle } = useFunction();

  const generateField = (label) => {
    return (
      <TextInput
        name={label}
        type={
          ["departure_date", "target_arrival", "actual_arrival"].includes(label)
            ? "date"
            : label.includes("expense")
            ? "number"
            : "text"
        }
        id={label}
        value={deliveryInformation[label]}
        withLabel={
          label.includes("name")
            ? capitalize(toTitle(label.replace(/_name/g, "")))
            : label.includes("expense")
            ? capitalize(toTitle(label.replace(/_expense/g, "")))
            : capitalize(toTitle(label))
        }
        onChange={(e) =>
          setDeliveryInformation((current) => {
            return {
              ...current,
              [label]: label.includes("expense")
                ? parseFloat(e.target.value)
                : e.target.value,
            };
          })
        }
        classes="p-1 items-center justify-between"
        labelClasses="whitespace-nowrap w-1/2 text-start"
        inputClasses="bg-default rounded px-2 w-1/2 disabled:text-gray-500"
      />
    );
  };
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={
        modalTitle === "add delivery information"
          ? handleRegistration
          : handleUpdate
      }
    >
      <table>
        <tbody>
          <tr>
            <td colSpan={2}>{generateField("location")}</td>
            <td colSpan={2}>{generateField("departure_date")}</td>
          </tr>
          <tr>
            <td colSpan={2}>{generateField("driver_name")}</td>
            <td colSpan={2}>{generateField("target_arrival")}</td>
          </tr>
          <tr>
            <td colSpan={2}>{generateField("assistant_driver_name")}</td>
          </tr>
          <tr>
            <td colSpan={4}>
              <hr />
            </td>
          </tr>
          <tr>
            <td className="font-semibold text-start text-[1.1rem]" colSpan={4}>
              Expenses
            </td>
          </tr>
          <tr>
            <td colSpan={2}>{generateField("driver_expense")}</td>
            <td colSpan={2}>{generateField("gas_expense")}</td>
          </tr>
          <tr>
            <td colSpan={2}>{generateField("assistant_driver_expense")}</td>
            <td colSpan={2}>{generateField("toll_gate_expense")}</td>
          </tr>
          <tr>
            <td colSpan={2}>{generateField("parking_expense")}</td>
            <td colSpan={2}>{generateField("tenor_and_load_expense")}</td>
          </tr>
          <tr>
            <td colSpan={2}>{generateField("food_expense")}</td>
          </tr>
          <tr>
            <td>
              <hr />
            </td>
          </tr>
          <tr>
            <td className="font-semibold text-start text-[1.1rem]" colSpan={5}>
              Select Sales Invoices
            </td>
          </tr>
          <tr>
            <div className="max-h-[125px] border-2 px-1 overflow-y-auto">
              {salesInvoices.map((invoice, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-row items-center w-full"
                  >
                    <input
                      type="checkbox"
                      name="invoice"
                      id={invoice.invoice_no}
                      value={invoice.invoice_no}
                      onChange={(e) => {
                        let updatedList = [...selectedInvoices];
                        if (e.target.checked) {
                          updatedList.push(invoice);
                        } else {
                          updatedList = updatedList.filter((item) => item.sales_id != invoice.sales_id);
                        }
                        setSelectedInvoices(updatedList);
                      }}
                      className="peer/invoice hidden"
                    />
                    <label
                      htmlFor={invoice.invoice_no}
                      className="peer-checked/invoice:bg-gray-400 w-full text-start"
                    >
                      {invoice.invoice_no}
                    </label>
                  </div>
                );
              })}
            </div>
          </tr>
        </tbody>
      </table>

      <div className="flex items-center justify-end gap-2">
        <Button
          type="submit"
          value={
            modalTitle === "add delivery information" ? "Submit" : "Update"
          }
          className="bg-tertiary p-1 px-2 rounded-md hover:bg-main hover:text-white transition-all"
        />
        <Button
          value="Cancel"
          onClick={() => handleClose()}
          className="bg-gray-200 text-gray-700 p-1 px-2 rounded-md"
        />
      </div>
    </form>
  );
}
