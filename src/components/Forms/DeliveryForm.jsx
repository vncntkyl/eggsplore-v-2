/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useFunction } from "../../context/FunctionContext";
import TextInput from "./TextInput";
import Button from "./Button";
import { format } from "date-fns";
import Badge from "../Fragments/Badge";
import { useAuth } from "../../context/authContext";

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
  const { getLocation } = useAuth();
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState(salesInvoices);

  useEffect(() => {
    const setup = async () => {
      const locations = await getLocation();
      setLocations(locations);
    };
    setup();
  }, []);
  const generateField = (label) => {
    return label === "location" ? (
      <div className="p-1 flex gap-2 items-center justify-between">
        <label
          htmlFor={label}
          className="whitespace-nowrap w-1/2 text-start font-semibold"
        >
          Location
        </label>
        <input
          type="text"
          list="locations"
          disabled={modalTitle === "view delivery information"}
          required
          id={label}
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
          onChange={(e) => {
            setSelectedLocation(e.target.value);
            setFilteredInvoices(
              salesInvoices.filter(
                (item) =>
                  item.location.toLowerCase() === e.target.value.toLowerCase()
              )
            );
            setDeliveryInformation((current) => {
              return {
                ...current,
                [label]: label.includes("expense")
                  ? parseFloat(e.target.value)
                  : e.target.value,
              };
            });
          }}
          className="outline-none border-none p-1 bg-default rounded px-2 w-full disabled:text-gray-500"
        />
        <datalist id="locations">
          {locations.map((location, index) => {
            return <option value={location.location_name} key={index} />;
          })}
        </datalist>
      </div>
    ) : (
      <TextInput
        name={label}
        important
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
    locations && (
      <form
        className="flex flex-col gap-2 min-w-[500px] overflow-x-auto"
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
              <td
                className="font-semibold text-start text-[1.1rem]"
                colSpan={4}
              >
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
              <td
                className="font-semibold text-start text-[1.1rem]"
                colSpan={5}
              >
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
                    {selectedLocation.length === 0 ? (
                      <>Please enter a location</>
                    ) : filteredInvoices.length === 0 ? (
                      <>There are no sales invoices available.</>
                    ) : (
                      filteredInvoices.map((invoice, index) => {
                        return (
                          <div
                            key={index}
                            className="flex flex-row items-center w-full"
                          >
                            <input
                              type="checkbox"
                              name="invoice"
                              required
                              checked={selectedInvoices.find(
                                (selectedInvoice) =>
                                  selectedInvoice.invoice_no ===
                                  invoice.invoice_no
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
                      })
                    )}
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
    )
  );
}
