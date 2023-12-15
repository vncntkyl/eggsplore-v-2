import { useEffect, useState } from "react";
import { useFunction } from "../../../context/FunctionContext";
import { useAuth } from "../../../context/authContext";
import { BigTextInput, Button, TextInput } from "../../Forms";
// import { AiFillCalendar } from "react-icons/ai";
// import classNames from "classnames";
import { Alert, Modal } from "../../Containers";
// import { format } from "date-fns";
import ChickenMaintenanceTable from "../../Tables/ChickenMaintenanceTable";
import DatePicker from "../../Fragments/DatePicker";

export default function ChickenPopulation() {
  const [refresh, doRefresh] = useState(0);
  const [selectedChicken, setChicken] = useState(null);
  const [buildings, setBuildings] = useState(null);
  const [alert, toggleAlert] = useState({
    type: "success",
    title: "",
    message: "",
    show: false,
  });
  const [bldg, setBldg] = useState(-1);
  const [selectedFilter, selectDateFilter] = useState("all");
  const [modalTitle, setModalTitle] = useState(null);
  const [dateRange, setRange] = useState({ start_date: "", end_date: "" });
  const { capitalize, toTitle } = useFunction();
  const { updateChickenPopulation, getBuilding } = useAuth();

  const handleClose = () => {
    setModalTitle(null);
    selectDateFilter("all");
    setChicken(null);
    toggleAlert({
      type: "success",
      title: "",
      message: "",
      show: false,
    });
  };

  const handleUpdateChickenPopulation = async (e) => {
    e.preventDefault();
    const response = await updateChickenPopulation(selectedChicken);
    setModalTitle(null);
    if (response === 1) {
      toggleAlert({
        type: "success",
        title: "Chicken Population Update Success",
        message: "Successfully updated the chicken population information.",
        show: true,
      });
    } else {
      toggleAlert({
        type: "warning",
        title: "Chicken Population Update Error",
        message:
          "There has been an error on updating chicken population information. Please try again.",
        show: true,
      });
    }
    doRefresh((count) => (count = count + 1));
  };
  const handleInputChange = (e, chickenKey, exception = null) => {
    const population = parseInt(document.querySelector("#population").value);
    const mortality_count = parseInt(
      document.querySelector("#mortality").value
    );
    const missing_count = parseInt(document.querySelector("#missing").value);

    setChicken((data) => ({
      ...data,
      [chickenKey]: exception
        ? chickenKey === exception
          ? e.target.value
          : parseInt(e.target.value)
        : parseInt(e.target.value),
      remaining: e.target.value
        ? population - (mortality_count + missing_count)
        : population,
    }));
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
      const response = await getBuilding();
      setBuildings(response);
    };
    setup();
  }, []);
  return (
    <>
      <div>
        <div className="flex flex-row items-center justify-start p-2 gap-2">
          <p className="whitespace-nowrap">Date Filter: </p>
          <DatePicker
            dateRange={dateRange}
            setModalTitle={setModalTitle}
            selectDateFilter={selectDateFilter}
            selectedFilter={selectedFilter}
            setRange={setRange}
          />
        </div>
        {buildings && (
          <div className="p-1">
            Filter Building: 
            <select onChange={(e) => setBldg(e.target.value)} className="p-1 px-2 bg-default outline-none rounded">
              {buildings.map((bldg) => {
                return (
                  <option
                    className=" "
                    key={bldg.id}
                    value={bldg.id}
                    selected={bldg === bldg.id}
                  >
                    {"Building " + bldg.number}
                  </option>
                );
              })}
            </select>
          </div>
        )}
        <div className="w-full overflow-x-auto shadow-md">
          <ChickenMaintenanceTable
            refresh={refresh}
            setModal={setModalTitle}
            setChicken={setChicken}
            bldgFilter={bldg}
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
          title={capitalize(modalTitle)}
          onClose={() => handleClose()}
          className="w-[95%] max-w-[500px]"
          content={
            modalTitle !== "edit chicken information" ? (
              <>
                <form
                  onSubmit={handleDateChange}
                  className="flex flex-col gap-2"
                >
                  <span>Select the date range to display the records.</span>
                  <div className="flex flex-col md:flex-row md:justify-center gap-2">
                    {Object.keys(dateRange).map((label, index) => {
                      return (
                        <TextInput
                          key={index}
                          name={label}
                          type="date"
                          important
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
                <form onSubmit={handleUpdateChickenPopulation}>
                  <div className="flex flex-col gap-2">
                    {Object.keys(selectedChicken).map((label, index) => {
                      return (
                        ![
                          "id",
                          "user_id",
                          "date_procured",
                          "date_logged",
                        ].includes(label) &&
                        (label === "remarks" ? (
                          <BigTextInput
                            key={index}
                            name={label}
                            id={label}
                            important
                            value={selectedChicken[label]}
                            withLabel={capitalize(toTitle(label))}
                            classes="p-1 items-center justify-between"
                            labelClasses="whitespace-nowrap text-start"
                            inputClasses="bg-default rounded px-2"
                            onChange={(e) => {
                              setChicken((current) => ({
                                ...current,
                                remarks: e.target.value,
                              }));
                            }}
                          />
                        ) : (
                          <TextInput
                            key={index}
                            name={label}
                            id={label}
                            type="number"
                            important
                            value={selectedChicken[label]}
                            disabled={["building_id", "remaining"].includes(
                              label
                            )}
                            withLabel={capitalize(toTitle(label))}
                            classes="p-1 items-center justify-between"
                            labelClasses="whitespace-nowrap text-start"
                            inputClasses="bg-default rounded px-2 disabled:text-gray-500"
                            onChange={(e) => handleInputChange(e, label)}
                          />
                        ))
                      );
                    })}
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="submit"
                        value="Save Changes"
                        className="bg-tertiary p-1 px-2 rounded-md hover:bg-main hover:text-white transition-all"
                      />
                      <Button
                        value="Cancel"
                        onClick={() => handleClose()}
                        className="bg-gray-200 text-gray-700 p-1 px-2 rounded-md"
                      />
                    </div>
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
