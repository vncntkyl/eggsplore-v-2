import { useEffect, useState } from "react";
import DatePicker from "../../Fragments/DatePicker";
import EggProductionTable from "../../Tables/EggProductionTable";
import { Alert, Modal } from "../../Containers";
import { useFunction } from "../../../context/FunctionContext";
import { Button, TextInput } from "../../Forms";
import { useAuth } from "../../../context/authContext";

export default function Production() {
  const [refresh, doRefresh] = useState(0);
  const [alert, toggleAlert] = useState({
    type: "success",
    title: "",
    message: "",
    show: false,
  });
  const [selectedFilter, selectDateFilter] = useState("all");
  const [modalTitle, setModalTitle] = useState(null);
  const [dateRange, setRange] = useState({ start_date: "", end_date: "" });

  const [buildings, setBuildings] = useState([]);
  const [users, setUsers] = useState([]);
  const [egg, setEgg] = useState(null);

  const { capitalize, toTitle } = useFunction();
  const { getBuilding, getUser, updateEggProduction } = useAuth();

  const handleClose = () => {
    setModalTitle(null);
    selectDateFilter("all");
    toggleAlert({
      type: "success",
      title: "",
      message: "",
      show: false,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = {
      egg_count: egg.egg_tray_count,
      defect_count: egg.defect_egg_trays_count,
      id: egg.id,
    };
    const response = await updateEggProduction(data);
    console.log(response);
    setModalTitle(null);
    if (response === 1) {
      toggleAlert({
        type: "success",
        title: "Update Success",
        message: "Successfully updated egg production.",
        show: true,
      });
    } else {
      toggleAlert({
        type: "warning",
        title: "Update Error",
        message:
          "There has been an error on updating egg production. Please try again.",
        show: true,
      });
    }
    doRefresh((count) => (count = count + 1));
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
      const buildingResponse = await getBuilding();
      setBuildings(buildingResponse);
      const userResponse = await getUser();
      setUsers(userResponse);
    };
    setup();
   
  }, [refresh]);

  return (
    <>
      <div className="bg-white p-2 rounded-md">
        <span className="font-semibold text-gray-800 text-[1.1rem]">
          Egg Production
        </span>
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
          <div className="w-full px-2">
            <div className="max-h-[300px] overflow-hidden rounded-md overflow-y-auto shadow-md">
              <EggProductionTable
                refresh={refresh}
                setModal={setModalTitle}
                selectEgg={setEgg}
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
                <form className="flex flex-col gap-2" onSubmit={handleUpdate}>
                  {Object.keys(egg)
                    .filter(
                      (key) => !["id", "update", "date_procured"].includes(key)
                    )
                    .map((label, index) => {
                      return (
                        <TextInput
                          key={index}
                          name={label}
                          id={label}
                          type={label.includes("count") ? "number" : "text"}
                          withLabel={
                            label === "building_id"
                              ? "Building No."
                              : label === "user_id"
                              ? "Staff"
                              : label.includes("count")
                              ? capitalize(
                                  label
                                    .split("_")
                                    .filter((word) => word !== "count")
                                    .join(" ")
                                )
                              : capitalize(toString(label))
                          }
                          value={
                            label === "building_id"
                              ? buildings.find((bldg) => bldg.id === egg[label])
                                  .number
                              : label === "user_id"
                              ? capitalize(
                                  users.find(
                                    (user) => user.user_id === egg[label]
                                  ).first_name
                                )
                              : egg[label]
                          }
                          disabled={label.includes("id")}
                          classes="p-1 items-center justify-between"
                          labelClasses="whitespace-nowrap text-start w-1/2"
                          inputClasses="bg-default rounded px-2 w-1/2 disabled:text-gray-500"
                          onChange={(e) =>
                            setEgg((current) => ({
                              ...current,
                              [label]: parseInt(e.target.value),
                            }))
                          }
                        />
                      );
                    })}
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="submit"
                      value="Update"
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
