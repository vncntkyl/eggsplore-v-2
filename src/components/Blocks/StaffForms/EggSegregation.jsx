import { useEffect, useState } from "react";
import { Button, TextInput } from "../../Forms";
import { useFunction } from "../../../context/FunctionContext";
import { format } from "date-fns";
import { useAuth } from "../../../context/authContext";
import EggProductionTable from "../../Tables/EggProductionTable";
import { Alert, Modal } from "../../Containers";
// eslint-disable-next-line react/prop-types
export default function EggSegregation({ building }) {
  const [refresh, doRefresh] = useState(0);
  const [modalTitle, setModalTitle] = useState(null);
  const [currentBuilding, setCurrentBuilding] = useState([]);
  const [eggProductionList, setEggProductionList] = useState([]);
  const [selectedProduction, setSelectedProduction] = useState(null);
  const [eggData, setEggData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    building_number: 0,
    unsorted_egg_production: 0,
    no_weight: 0,
    pewee: 0,
    pullet: 0,
    brown: 0,
    small: 0,
    medium: 0,
    large: 0,
    extra_large: 0,
    jumbo: 0,
    crack: 0,
    soft_shell: 0,
  });
  const [currentTotal, setCurrentTotal] = useState(0);
  const [alert, toggleAlert] = useState({
    type: "success",
    title: "",
    message: "",
    show: false,
  });

  const handleInputChange = (label, value) => {
    const keysToExclude = [
      "unsorted_egg_production",
      "building_number",
      "date",
    ];
    const total = Object.keys(eggData)
      .filter((key) => !keysToExclude.includes(key))
      .reduce((acc, key) => acc + eggData[key], 0);
    if (label.includes("date")) {
      setEggData((data) => ({
        ...data,
        [label]: value,
      }));
    } else if (label === "unsorted_egg_production") {
      setEggData((data) => ({
        ...data,
        [label]: parseInt(value),
      }));
    } else if (
      parseInt(value) >= 0 &&
      total <
        parseInt(eggData.unsorted_egg_production)
    ) {
      setEggData((data) => ({
        ...data,
        [label]: parseInt(value),
      }));
    }
  };
  const { toTitle, capitalize } = useFunction();
  const { getCurrentUser, getBuilding, retrieveEggsForSegregation } = useAuth();

  const handleSubmit = async () => {
    console.log(eggData, currentTotal);
    // setModalTitle(null);
    // const building_id = document.querySelector("#building_id");
    // const id = parseInt(building_id.value);

    // const data = {
    //   date: eggData.date,
    //   count: eggData.egg_tray_count,
    //   defect: eggData.defect_egg_trays_count,
    //   building: id,
    //   staff: JSON.parse(getCurrentUser()).user_id,
    //   log_date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    // };
    // try {
    //   const response = await insertEggProduction(data, "staff_add");
    //   if (response === 1) {
    //     toggleAlert({
    //       type: "success",
    //       title: "Procurement Success",
    //       message: "You have successfully submitted!",
    //       show: true,
    //     });
    //   } else {
    //     toggleAlert({
    //       type: "warning",
    //       title: "Procurement Error",
    //       message:
    //         "There has been an error on submitting your procurement. Please try again.",
    //       show: true,
    //     });
    //   }
    //   doRefresh((count) => (count = count + 1));
    // } catch (e) {
    //   console.log(e.message);
    // }
  };

  const handleClose = () => {
    setModalTitle(null);
    toggleAlert({ type: "success", title: "", message: "", show: false });
    setEggData({
      date: format(new Date(), "yyyy-MM-dd"),
      building_number: 0,
      unsorted_egg_production: 0,
      no_weight: 0,
      pewee: 0,
      pullet: 0,
      brown: 0,
      small: 0,
      medium: 0,
      large: 0,
      extra_large: 0,
      jumbo: 0,
      crack: 0,
      soft_shell: 0,
    });
  };

  useEffect(() => {
    const user = JSON.parse(getCurrentUser());
    const setup = async () => {
      const response = await getBuilding(building);
      setCurrentBuilding(response);
      const eggListResponse = await retrieveEggsForSegregation(user.user_id);
      setEggProductionList(eggListResponse);
    };
    setup();
  }, [refresh, building]);

  return (
    <>
      <div className="p-2 flex flex-col gap-2 w-full animate-fade">
        <div className="w-full">
          <p className="text-[1.2rem] font-semibold">Egg Segregation</p>
          <form
            className="flex flex-col gap-2 bg-default p-2 rounded-md"
            onSubmit={(e) => {
              e.preventDefault();
              setModalTitle("Confirmation");
            }}
          >
            <div className="flex flex-row gap-2 bg-default p-2">
              <div className="flex flex-col gap-2 bg-default p-2 w-1/2">
                {Object.keys(eggData)
                  .splice(0, 7)
                  .map((eggKey, index) => {
                    return eggKey === "building_number" ? (
                      <>
                        <TextInput
                          type="hidden"
                          value={currentBuilding.id}
                          id="building_id"
                        />
                        <TextInput
                          id={eggKey}
                          key={index}
                          withLabel={capitalize(toTitle(eggKey)) + ":"}
                          value={currentBuilding.number}
                          type="number"
                          disabled={true}
                          orientation="row"
                          classes="p-1 items-center "
                          labelClasses="whitespace-nowrap w-full text-start"
                          inputClasses="w-full rounded px-2"
                        />
                      </>
                    ) : eggKey === "unsorted_egg_production" ? (
                      <div key={index} className="flex flex-col gap-2">
                        <div className="flex gap-2 p-1 items-center">
                          <label
                            htmlFor={eggKey}
                            className="whitespace-nowrap w-full text-start"
                          >
                            Egg Production Details
                          </label>
                          <select
                            id={eggKey}
                            className="w-full rounded px-2 outline-none border-none p-1"
                            onChange={(e) => {
                              setSelectedProduction(e.target.value);
                              setEggData((current) => ({
                                ...current,
                                unsorted_egg_production: eggProductionList.find(
                                  (egg) =>
                                    egg.egg_production_id ===
                                    parseInt(e.target.value)
                                ).eggs,
                              }));
                            }}
                          >
                            <option
                              value=""
                              selected={!selectedProduction}
                              disabled
                            >
                              Select Egg Production Type
                            </option>
                            {eggProductionList.map((egg, index) => {
                              return (
                                <option
                                  key={index}
                                  value={egg.egg_production_id}
                                  selected={
                                    egg.egg_production_id === eggData[eggKey]
                                  }
                                >
                                  {`production #${egg.egg_production_id} - ${egg.date_produced}`}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        <div className="flex flex-row items-center justify-between">
                          <span className="w-1/2 p-1">Egg Trays: </span>
                          <span className="w-1/2 p-1 px-2">
                            {eggData.unsorted_egg_production != 0
                              ? eggProductionList.find(
                                  (egg) =>
                                    egg.eggs === eggData.unsorted_egg_production
                                )
                                ? eggProductionList.find(
                                    (egg) =>
                                      egg.eggs ===
                                      eggData.unsorted_egg_production
                                  ).eggs
                                : 0
                              : 0}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <TextInput
                        id={eggKey}
                        key={index}
                        withLabel={capitalize(toTitle(eggKey)) + ":"}
                        value={eggData[eggKey]}
                        type={eggKey.includes("date") ? "date" : "number"}
                        orientation="row"
                        classes="p-1 items-center "
                        labelClasses="whitespace-nowrap w-full text-start"
                        inputClasses="w-full rounded px-2"
                        onChange={(e) =>
                          handleInputChange(eggKey, e.target.value)
                        }
                      />
                    );
                  })}
              </div>
              <div className="flex flex-col gap-2 bg-default p-2 w-1/2">
                {Object.keys(eggData)
                  .splice(7, 15)
                  .map((eggKey, index) => {
                    return (
                      <TextInput
                        id={eggKey}
                        key={index}
                        withLabel={capitalize(toTitle(eggKey)) + ":"}
                        value={eggData[eggKey]}
                        type={eggKey.includes("date") ? "date" : "number"}
                        orientation="row"
                        classes="p-1 items-center "
                        labelClasses="whitespace-nowrap w-full text-start"
                        inputClasses="w-full rounded px-2"
                        onChange={(e) =>
                          setEggData((data) => ({
                            ...data,
                            [eggKey]: parseInt(e.target.value),
                          }))
                        }
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
          <p className="text-[1.2rem] font-semibold">Egg Production Logs</p>
          <div className="max-h-[300px] overflow-hidden rounded-md overflow-y-auto shadow-md">
            <EggProductionTable refresh={refresh} />
          </div>
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
