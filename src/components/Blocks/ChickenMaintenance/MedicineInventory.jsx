import { useEffect, useState } from "react";
import { useFunction } from "../../../context/FunctionContext";
import { Button, TextInput } from "../../Forms";
import classNames from "classnames";
import { format } from "date-fns";
import { AiFillCalendar, AiFillPlusCircle } from "react-icons/ai";
import MedicineInventoryTable from "../../Tables/MedicineInventoryTable";
import { Alert, Modal } from "../../Containers";
import { useAuth } from "../../../context/authContext";
import DatePicker from "../../Fragments/DatePicker";

export default function MedicineInventory() {
  const [refresh, doRefresh] = useState(0);
  const [modalTitle, setModalTitle] = useState(null);
  const [alert, toggleAlert] = useState({
    type: "success",
    title: "",
    message: "",
    show: false,
  });
  const [medicine, setMedicine] = useState({
    medicine: 0,
    quantity: 0,
    amount: 0,
    supplier: "",
    date_received: format(new Date(), "yyyy-MM-dd"),
    expiration_date: "",
  });
  const [medicineList, setMedicineList] = useState([]);
  const [selectedFilter, selectDateFilter] = useState("all");
  const [dateRange, setRange] = useState({ start_date: "", end_date: "" });

  const { capitalize, toTitle } = useFunction();
  const { getMedicine, addMedicineInventory, updateMedicineInventory } =
    useAuth();

  const handleClose = () => {
    setModalTitle(null);
    selectDateFilter("all");
    setMedicine({
      medicine: 0,
      quantity: 0,
      amount: "00.00",
      supplier: "",
      date_received: "",
      expiration_date: "",
    });
    toggleAlert({
      type: "success",
      title: "",
      message: "",
      show: false,
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMedicine = { ...medicine };
    newMedicine.log_date = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const response = await addMedicineInventory(newMedicine);
    setModalTitle(null);
    if (response === 1) {
      toggleAlert({
        type: "success",
        title: "Medicine Inventory Success",
        message: "Successfully added new medicine inventory.",
        show: true,
      });
    } else {
      toggleAlert({
        type: "warning",
        title: "Medicine Inventory Error",
        message:
          "There has been an error on adding new medicine inventory. Please try again.",
        show: true,
      });
    }
    doRefresh((count) => (count = count + 1));
  };

  const medicineInventory = () => {
    if (!medicine) return;

    const medicine_information = medicineList.find(
      (med) => med.medicine_id === medicine.medicine
    );
    const inventory_details = { ...medicine };
    const medicineInventory = {
      medicine_name: medicine_information.medicine_name,
      dosage_instructions: medicine_information.dosage_instructions,
      indications_for_use: medicine_information.usage_indication,
      quantity: inventory_details.quantity,
      supplier: inventory_details.supplier,
      amount: inventory_details.amount,
      date_received: inventory_details.date_received,
      expiration_date: inventory_details.expiration_date,
    };
    return medicineInventory;
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    const updateMedicine = { ...medicine };
    updateMedicine.log_date = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const response = await updateMedicineInventory(updateMedicine);
    console.log(response);
    setModalTitle(null);
    if (response === 1) {
      toggleAlert({
        type: "success",
        title: "Medicine Inventory Success",
        message: "Successfully updated medicine inventory.",
        show: true,
      });
    } else {
      toggleAlert({
        type: "warning",
        title: "Medicine Inventory Error",
        message:
          "There has been an error on updating medicine inventory. Please try again.",
        show: true,
      });
    }
    doRefresh((count) => (count = count + 1));
  };

  useEffect(() => {
    const setup = async () => {
      const medicineList = await getMedicine();
      setMedicineList(medicineList);
    };
    const realtimeData = setInterval(setup, 5000);
    return () => {
      clearInterval(realtimeData);
    };
  }, [refresh, selectDateFilter]);
  return (
    <>
      <div>
        <div className="w-full flex flex-col md:flex-row-reverse md:items-center md:justify-end">
          <Button
            onClick={() => setModalTitle("add medicine")}
            value={
              <div className="flex items-center gap-1">
                <AiFillPlusCircle />
                <span>Add Medicine</span>
              </div>
            }
            className={
              "whitespace-nowrap bg-main text-white p-1 px-2 rounded-full text-[.9rem] transition-all w-fit hover:bg-tertiary hover:text-main"
            }
          />
          <div className="w-full overflow-x-auto flex flex-row items-center justify-start p-2 gap-2">
            <p className="whitespace-nowrap">Date Filter: </p>
            <DatePicker
              dateRange={dateRange}
              setModalTitle={setModalTitle}
              selectDateFilter={selectDateFilter}
              selectedFilter={selectedFilter}
              setRange={setRange}
            />
          </div>
        </div>
        <div className="w-full overflow-x-auto shadow-md">
          <MedicineInventoryTable
            refresh={refresh}
            setModal={setModalTitle}
            setMedicine={setMedicine}
            filter={
              selectedFilter === "range" && dateRange.end_date != ""
                ? dateRange
                : selectedFilter
            }
          />
        </div>
      </div>
      {modalTitle && (
        <Modal
          className={"w-[95%] max-w-lg"}
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
                  <div className="flex flex-col md:flex-row gap-2 justify-center">
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
            ) : ["add medicine", "edit medicine information"].includes(
                modalTitle
              ) ? (
              <>
                <form
                  className="flex flex-col gap-2"
                  onSubmit={
                    modalTitle === "add medicine" ? handleSubmit : handleUpdate
                  }
                >
                  {Object.keys(medicine)
                    .filter((key) => key !== "update" && key !== "id")
                    .map((label, index) => {
                      return label === "medicine" ? (
                        <div
                          key={index}
                          className="flex gap-2 p-1 items-center"
                        >
                          <label
                            htmlFor={label}
                            className="whitespace-nowrap text-start"
                          >
                            Medicine
                          </label>
                          <select
                            id={label}
                            required
                            className="w-full rounded px-2 outline-none border-none p-1 bg-default"
                            onChange={(e) =>
                              setMedicine((current) => ({
                                ...current,
                                medicine: parseInt(e.target.value),
                              }))
                            }
                          >
                            <option value="" selected disabled>
                              Select Medicine
                            </option>
                            {medicineList.map((med, index) => {
                              return (
                                <option
                                  key={index}
                                  value={med.medicine_id}
                                  selected={med.medicine_id === medicine[label]}
                                >
                                  {med.medicine_name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      ) : (
                        <TextInput
                          key={index}
                          name={label}
                          important
                          type={
                            label.includes("date")
                              ? "date"
                              : label === "supplier" || label === "amount"
                              ? "text"
                              : "number"
                          }
                          id={label}
                          withLabel={capitalize(toTitle(label))}
                          value={medicine[label]}
                          onChange={(e) => {
                            setMedicine((current) => ({
                              ...current,
                              [label]:
                                label === "supplier" ||
                                label.includes("date") ||
                                label === "amount"
                                  ? e.target.value
                                  : parseInt(e.target.value),
                            }));
                          }}
                          classes="p-1 items-center justify-between"
                          labelClasses="whitespace-nowrap text-start"
                          inputClasses="bg-default rounded px-2"
                        />
                      );
                    })}
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="submit"
                      value={modalTitle === "add medicine" ? "Add" : "Update"}
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
                <div className="text-left flex flex-col gap-2">
                  {Object.keys(medicineInventory()).map((label, index) => {
                    return (
                      <div
                        key={index}
                        className="flex flex-row justify-between"
                      >
                        <span className="w-1/2 font-semibold text-gray-800">
                          {capitalize(toTitle(label))}
                        </span>
                        <span className="w-1/2">
                          {label === "amount"
                            ? Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "PHP",
                              }).format(medicineInventory()[label])
                            : label.includes("date")
                            ? format(
                                new Date(medicineInventory()[label]),
                                "MMMM d, yyyy"
                              )
                            : medicineInventory()[label]}
                        </span>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      value="Edit"
                      onClick={() => setModalTitle("edit medicine information")}
                      className="bg-tertiary p-1 px-2 rounded-md hover:bg-main hover:text-white transition-all"
                    />
                    <Button
                      value="Cancel"
                      onClick={() => handleClose()}
                      className="bg-gray-200 text-gray-700 p-1 px-2 rounded-md"
                    />
                  </div>
                </div>
              </>
            )
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
