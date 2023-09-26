import { useEffect, useState } from "react";
import DatePicker from "../../Fragments/DatePicker";
import { Alert, Modal } from "../../Containers";
import { AiFillPlusCircle } from "react-icons/ai";
import { Button, TextInput } from "../../Forms";
import { format } from "date-fns";
import EggProcurementTable from "../../Tables/EggProcurementTable";
import { useFunction } from "../../../context/FunctionContext";
import { useAuth } from "../../../context/authContext";
export default function Procurement() {
  const [refresh, doRefresh] = useState(0);
  const [selectedFilter, selectDateFilter] = useState("all");
  const [modalTitle, setModalTitle] = useState(null);
  const [alert, toggleAlert] = useState({
    type: "success",
    title: "",
    message: "",
    show: false,
  });
  const [dateRange, setRange] = useState({ start_date: "", end_date: "" });
  const [selectedType, setType] = useState("brown");
  const [eggTypes, setEggTypes] = useState();
  const [procurementInformation, setProcurementInformation] = useState({
    date_procured: format(new Date(), "yyyy-MM-dd"),
    egg_type: "Brown Egg",
    quantity: 0,
    supplier: "",
    amount: 0,
  });
  const { capitalize, toTitle } = useFunction();
  const {
    retrieveEggClasifications,
    insertEggProcurement,
    updateEggProcurement,
  } = useAuth();

  const handleClose = () => {
    setModalTitle(null);
    selectDateFilter("all");
    toggleAlert({
      type: "success",
      title: "",
      message: "",
      show: false,
    });
    setProcurementInformation({
      date_procured: format(new Date(), "yyyy-MM-dd"),
      egg_type: "Brown Egg",
      quantity: 0,
      supplier: "",
      amount: 0,
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
    const data = { ...procurementInformation };
    if (data.egg_type === "Brown Egg") {
      data.egg_type = "brown";
    }
    data.log_date = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const response = await insertEggProcurement(data);
    setModalTitle(null);
    if (response === 1) {
      toggleAlert({
        type: "success",
        title: "Add Procurement Success",
        message: "Successfully added procured egg.",
        show: true,
      });
    } else {
      toggleAlert({
        type: "warning",
        title: "Add Procurement Error",
        message:
          "There has been an error on adding procured egg. Please try again.",
        show: true,
      });
    }
    doRefresh((count) => (count = count + 1));
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = { ...procurementInformation };
    if (data.egg_type === "Brown Egg") {
      data.egg_type = "brown";
    }
    const response = await updateEggProcurement(data);
    console.log(response);
    setModalTitle(null);
    if (response === 1) {
      toggleAlert({
        type: "success",
        title: "Update Procurement Success",
        message: "Successfully added procured egg.",
        show: true,
      });
    } else {
      toggleAlert({
        type: "warning",
        title: "Add Procurement Error",
        message:
          "There has been an error on updating procured egg. Please try again.",
        show: true,
      });
    }
    doRefresh((count) => (count = count + 1));
  };

  useEffect(() => {
    const setup = async () => {
      const response = await retrieveEggClasifications();
      setEggTypes(response);
    };
    setup();
    const realtimeData = setInterval(setup, 5000);

    return () => {
      clearInterval(realtimeData);
    };
  }, [refresh]);
  return (
    <>
      <div className="bg-white p-2 rounded-md">
        <span className="font-semibold text-gray-800 text-[1.1rem]">
          Egg Procurement
        </span>
        <div>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-2 gap-2">
            <div className="flex flex-row gap-2 items-center">
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
            <Button
              onClick={() => setModalTitle("add procured egg")}
              value={
                <div className="flex items-center gap-1 px-1">
                  <AiFillPlusCircle />
                  <span className="whitespace-nowrap">Add Procured Egg</span>
                </div>
              }
              className={
                "bg-main text-white p-1 px-2 rounded-full text-[1rem] transition-all hover:bg-tertiary hover:text-main"
              }
            />
          </div>
          <div className="w-full px-2">
            <div className="max-h-[300px] overflow-auto rounded-md overflow-y-auto shadow-md">
              <EggProcurementTable
                procurementHeaders={procurementInformation}
                refresh={refresh}
                setModal={setModalTitle}
                setProcurement={setProcurementInformation}
                filter={
                  selectedFilter === "range" && dateRange.end_date != ""
                    ? dateRange
                    : selectedFilter
                }
              />
            </div>
          </div>
        </div>
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
                <form
                  className="flex flex-col gap-2"
                  onSubmit={
                    modalTitle === "add procured egg"
                      ? handleSubmit
                      : handleUpdate
                  }
                >
                  {Object.keys(procurementInformation)
                    .filter(
                      (key) =>
                        !["egg_procurement_id", "update", "log_date"].includes(
                          key
                        )
                    )
                    .map((label, index) => {
                      return label.includes("date") ? (
                        <TextInput
                          key={index}
                          name={label}
                          type="date"
                          id={label}
                          value={procurementInformation[label]}
                          withLabel={capitalize(toTitle(label))}
                          classes="p-1 items-center justify-between"
                          labelClasses="whitespace-nowrap text-start"
                          inputClasses="bg-default rounded px-2"
                        />
                      ) : label === "egg_type" ? (
                        <div key={index} className="flex flex-col gap-2">
                          <div className="flex gap-2 p-1 items-center">
                            <label
                              htmlFor={label}
                              className="whitespace-nowrap w-1/2 text-start"
                            >
                              Egg Type
                            </label>
                            <select
                              id={label}
                              className="bg-default rounded p-2 w-full disabled:text-gray-500"
                              onChange={(e) => {
                                setType(e.target.value);
                                setProcurementInformation((current) => ({
                                  ...current,
                                  egg_type: e.target.value,
                                }));
                              }}
                            >
                              <option
                                value=""
                                selected={!selectedType}
                                disabled
                              >
                                Select Egg Type
                              </option>
                              {eggTypes.map((type, index) => {
                                return (
                                  <option
                                    key={index}
                                    value={selectedType}
                                    selected={
                                      type.egg_type_name === selectedType
                                    }
                                  >
                                    {capitalize(type.egg_type_name)}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      ) : (
                        <TextInput
                          key={index}
                          name={label}
                          id={label}
                          type={
                            ["quantity", "amount"].includes(label)
                              ? "number"
                              : "text"
                          }
                          withLabel={capitalize(toTitle(label))}
                          value={procurementInformation[label]}
                          disabled={label.includes("id")}
                          classes="p-1 items-center justify-between"
                          labelClasses="whitespace-nowrap text-start w-1/2"
                          inputClasses="bg-default rounded px-2 w-1/2 disabled:text-gray-500"
                          onChange={(e) =>
                            setProcurementInformation((current) => ({
                              ...current,
                              [label]: ["quantity", "amount"].includes(label)
                                ? parseInt(e.target.value)
                                : e.target.value,
                            }))
                          }
                        />
                      );
                    })}
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="submit"
                      value={
                        modalTitle === "add procured egg" ? "Submit" : "Update"
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
