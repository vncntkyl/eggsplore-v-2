import { useEffect, useState } from "react";
import { BigTextInput, Button, TextInput } from "../../Forms";
import { useFunction } from "../../../context/FunctionContext";
import { format } from "date-fns";
import { useAuth } from "../../../context/authContext";
import { Alert, Modal } from "../../Containers";
import ChickenMaintenanceTable from "../../Tables/ChickenMaintenanceTable";
// eslint-disable-next-line react/prop-types
export default function ChickenManagement({ building }) {
  const [refresh, doRefresh] = useState(0);
  const [modalTitle, setModalTitle] = useState(null);
  const [currentBuilding, setCurrentBuilding] = useState([]);
  const [chickenData, setChickenData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    building_number: 0,
    population: 0,
    mortality: 0,
    missing: 0,
    remaining: 0,
    remarks: "",
  });
  const [alert, toggleAlert] = useState({
    type: "success",
    title: "",
    message: "",
    show: false,
  });

  const { toTitle, capitalize } = useFunction();
  const {
    insertChickenMaintenance,
    getCurrentUser,
    getBuilding,
    retrieveChickenPopulation,
  } = useAuth();

  const handleSubmit = async () => {
    setModalTitle(null);
    const building_id = document.querySelector("#building_id");
    const id = parseInt(building_id.value);

    const data = {
      date: chickenData.date,
      count: chickenData.egg_tray_count,
      building: id,
      population: chickenData.population,
      mortality: chickenData.mortality,
      missing: chickenData.missing,
      remaining: chickenData.remaining,
      remarks: chickenData.remarks,
      staff: JSON.parse(getCurrentUser()).user_id,
      log_date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    };
    try {
      const response = await insertChickenMaintenance(data, "staff_add");
      console.log(response);
      if (response === 1) {
        toggleAlert({
          type: "success",
          title: "Procurement Success",
          message: "You have successfully submitted!",
          show: true,
        });
      } else {
        toggleAlert({
          type: "warning",
          title: "Procurement Error",
          message:
            "There has been an error on submitting your procurement. Please try again.",
          show: true,
        });
      }
      doRefresh((count) => (count = count + 1));
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleClose = () => {
    setModalTitle(null);
    toggleAlert({ type: "success", title: "", message: "", show: false });
    setChickenData({
      date: format(new Date(), "yyyy-MM-dd"),
      building_number: building,
      population: chickenData.remaining,
      mortality: 0,
      missing: 0,
      remaining: chickenData.remaining,
      remarks: "",
    });
  };

  const handleInputChange = (e, chickenKey, exception = null) => {
    const population = parseInt(document.querySelector("#population").value);
    const mortality_count = parseInt(
      document.querySelector("#mortality").value
    );
    const missing_count = parseInt(document.querySelector("#missing").value);

    setChickenData((data) => ({
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
  useEffect(() => {
    const setup = async () => {
      const response = await getBuilding(building);
      setCurrentBuilding(response);
      const populationData = await retrieveChickenPopulation();
      const chickenPopulationData = populationData.find(
        (data) => data.building_id === building
      );
      setChickenData({
        date: format(new Date(), "yyyy-MM-dd"),
        building_number: response.number,
        population: chickenPopulationData
          ? parseInt(chickenPopulationData.current_population)
          : 0,
        mortality: 0,
        missing: 0,
        remaining: chickenPopulationData
          ? parseInt(chickenPopulationData.current_population)
          : 0,
        remarks: "",
      });
    };
    setup();
  }, [building, refresh]);
  return (
    <>
      <div className="p-2 flex flex-col gap-2 w-full animate-fade">
        <div className="w-full">
          <p className="text-[1.2rem] font-semibold">Chicken Management</p>
          <form
            className="flex flex-col gap-2 bg-default p-2 rounded-md"
            onSubmit={(e) => {
              e.preventDefault();
              setModalTitle("Confirmation");
            }}
          >
            <div className="flex flex-row gap-2">
              <div className="w-full flex flex-col gap-2 bg-default p-2 rounded-md">
                {Object.keys(chickenData)
                  .slice(0, 4)
                  .map((chickenKey, index) => {
                    return chickenKey === "building_number" ? (
                      <>
                        <TextInput
                          type="hidden"
                          value={currentBuilding.id}
                          id="building_id"
                        />
                        <TextInput
                          id={chickenKey}
                          key={index}
                          withLabel={capitalize(toTitle(chickenKey)) + ":"}
                          value={currentBuilding.number}
                          type="number"
                          disabled={true}
                          orientation="row"
                          classes="p-1 items-center "
                          labelClasses="whitespace-nowrap w-full text-start"
                          inputClasses="w-full rounded px-2"
                        />
                      </>
                    ) : (
                      <TextInput
                        id={chickenKey}
                        key={index}
                        withLabel={capitalize(toTitle(chickenKey)) + ":"}
                        value={chickenData[chickenKey]}
                        type={chickenKey === "date" ? "date" : "number"}
                        orientation="row"
                        classes="p-1 items-center "
                        labelClasses="whitespace-nowrap w-full text-start"
                        inputClasses="w-full rounded px-2"
                        onChange={(e) =>
                          handleInputChange(e, chickenKey, "date")
                        }
                      />
                    );
                  })}
              </div>
              <div className=" w-full flex flex-col gap-2 bg-default p-2 rounded-md">
                {Object.keys(chickenData)
                  .slice(4, 8)
                  .map((chickenKey, index) => {
                    return chickenKey === "remarks" ? (
                      <BigTextInput
                        id={chickenKey}
                        key={index}
                        withLabel={capitalize(toTitle(chickenKey)) + ":"}
                        value={chickenData[chickenKey]}
                        orientation="row"
                        classes="p-1 items-start"
                        labelClasses="whitespace-nowrap w-full text-start"
                        inputClasses="w-full rounded px-2 h-full resize-none min-h-[100px]"
                        onChange={(e) =>
                          setChickenData((data) => ({
                            ...data,
                            [chickenKey]: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <TextInput
                        id={chickenKey}
                        key={index}
                        withLabel={capitalize(toTitle(chickenKey)) + ":"}
                        value={chickenData[chickenKey]}
                        type="number"
                        orientation="row"
                        classes="p-1 items-center "
                        labelClasses="whitespace-nowrap w-full text-start"
                        inputClasses="w-full rounded px-2"
                        disabled={chickenKey === "remaining"}
                        onChange={(e) => {
                          handleInputChange(e, chickenKey)

                        }}
                      />
                    );
                  })}
              </div>
            </div>
            <Button
              type="submit"
              value="Submit"
              className="bg-tertiary p-1 px-2 w-fit rounded-md hover:bg-main hover:text-white transition-all"
            />
          </form>
        </div>
        <div className="w-full">
          <p className="text-[1.2rem] font-semibold">
            Chicken Maintenance Logs
          </p>
          <ChickenMaintenanceTable refresh={refresh} />
        </div>
      </div>
      {modalTitle && (
        <Modal
          title={capitalize(modalTitle)}
          onClose={() => handleClose()}
          content={
            <>
              <p>Are you sure to submit this information?</p>
              <div className="flex items-center justify-end gap-2">
                <Button
                  value="Confirm"
                  onClick={() => handleSubmit()}
                  className="bg-tertiary p-1 px-2 rounded-md hover:bg-main hover:text-white transition-all"
                />
                <Button
                  value="Cancel"
                  onClick={() => handleClose()}
                  className="bg-gray-200 text-gray-700 p-1 px-2 rounded-md"
                />
              </div>
            </>
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
