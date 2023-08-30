/* eslint-disable react/prop-types */
import React from "react";
import { useFunction } from "../../context/FunctionContext";
import TextInput from "./TextInput";
import Button from "./Button";
import { format } from "date-fns";
import Badge from "../Fragments/Badge";

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
        disabled={modalTitle === "view delivery information"}
        value={
          modalTitle === "view delivery information" ||
          modalTitle === "edit delivery information"
            ? ["departure_date", "target_arrival", "actual_arrival"].includes(
                label
              )
              ? format(new Date(deliveryInformation[label]), "yyyy-MM-dd")
              : deliveryInformation[label]
            : deliveryInformation[label]
        }
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
        labelClasses="whitespace-nowrap w-1/2 text-start font-semibold"
        inputClasses="bg-default rounded px-2 w-1/2 disabled:bg-transparent"
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
          {modalTitle === "view delivery information" && (
            <tr>
              <td colSpan={2}>{generateField("dispatch_id")}</td>
              <td colSpan={2}>
                <div className="flex flex-row items-center gap-2">
                  <p className="font-semibold">Delivery Status </p>
                  <Badge
                    type={
                      deliveryInformation.status === "delayed"
                        ? "warning"
                        : deliveryInformation.status === "on time"
                        ? "success"
                        : deliveryInformation.status === "cancelled"
                        ? "failure"
                        : "default"
                    }
                    message={deliveryInformation.status}
                    className="w-fit p-1 text-[.8rem] font-semibold"
                  />
                </div>
              </td>
            </tr>
          )}
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
            <td colSpan={4}>
              <hr />
            </td>
          </tr>
          <tr>
            <td className="font-semibold text-start text-[1.1rem]" colSpan={5}>
              {modalTitle === "view delivery information"
                ? "Sales Invoices"
                : "Select Sales Invoices"}
            </td>
          </tr>
          <tr>
            {modalTitle === "view delivery information" ? (
              <>
                <ul className="border-2">
                  {selectedInvoices.map((invoice, index) => {
                    return <li key={index}>{invoice.invoice_no}</li>;
                  })}
                </ul>
              </>
            ) : (
              <>
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
                          checked={selectedInvoices.find(
                            (selectedInvoice) =>
                              selectedInvoice.invoice_no === invoice.invoice_no
                          )}
                          id={invoice.invoice_no}
                          value={invoice.invoice_no}
                          onChange={(e) => {
                            let updatedList = [...selectedInvoices];
                            if (e.target.checked) {
                              updatedList.push(invoice);
                            } else {
                              updatedList = updatedList.filter(
                                (item) => item.sales_id != invoice.sales_id
                              );
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
              </>
            )}
          </tr>
        </tbody>
      </table>

      {!modalTitle.includes("view") && (
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
      )}
    </form>
  );
}
