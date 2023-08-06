import { useEffect, useState } from "react";
import { Button, TextInput } from "../../Forms";
import { useFunction } from "../../../context/FunctionContext";
import { format } from "date-fns";
import { useAuth } from "../../../context/authContext";
import EggProductionTable from "../../Tables/EggProductionTable";
import { Alert, Modal } from "../../Containers";
// eslint-disable-next-line react/prop-types
export default function EggProduction({ building }) {
  const [refresh, doRefresh] = useState(0);
  const [modalTitle, setModalTitle] = useState(null);
  const [currentBuilding, setCurrentBuilding] = useState([]);

  const [eggData, setEggData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    building_number: 0,
    egg_tray_count: 0,
    defect_egg_trays_count: 0,
  });
  const [alert, toggleAlert] = useState({
    type: "success",
    title: "",
    message: "",
    show: false,
  });

  const { toTitle, capitalize } = useFunction();
  const { insertEggProduction, getCurrentUser, getBuilding } = useAuth();

  const handleSubmit = async () => {
    setModalTitle(null);
    const building_id = document.querySelector("#building_id");
    const id = parseInt(building_id.value);

    const data = {
      date: eggData.date,
      count: eggData.egg_tray_count,
      defect: eggData.defect_egg_trays_count,
      building: id,
      staff: JSON.parse(getCurrentUser()).user_id,
      log_date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    };
    try {
      const response = await insertEggProduction(data, "staff_add");
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
    setEggData({
      date: format(new Date(), "yyyy-MM-dd"),
      building_number: building,
      egg_tray_count: 0,
      defect_egg_trays_count: 0,
    });
  };

  useEffect(() => {
    const setup = async () => {
      const response = await getBuilding(building);
      setCurrentBuilding(response);

      setEggData({
        date: format(new Date(), "yyyy-MM-dd"),
        building_number: response.number,
        egg_tray_count: 0,
        defect_egg_trays_count: 0,
      });
    };
    setup();
  }, [building]);
  return (
    <>
      <div className="p-2 flex flex-col gap-2 w-full animate-fade">
        <div className="w-full">
          <p className="text-[1.2rem] font-semibold">Egg Production</p>
          <form
            className="flex flex-col gap-2 bg-default p-2 rounded-md"
            onSubmit={(e) => {
              e.preventDefault();
              setModalTitle("Confirmation");
            }}
          >
            {Object.keys(eggData).map((eggKey, index) => {
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
              ) : (
                <TextInput
                  id={eggKey}
                  key={index}
                  withLabel={capitalize(toTitle(eggKey)) + ":"}
                  value={eggData[eggKey]}
                  type={eggKey === "date" ? "date" : "number"}
                  orientation="row"
                  classes="p-1 items-center "
                  labelClasses="whitespace-nowrap w-full text-start"
                  inputClasses="w-full rounded px-2"
                  onChange={(e) =>
                    setEggData((data) => ({
                      ...data,
                      [eggKey]:
                        eggKey === "egg_tray_count"
                          ? parseInt(e.target.value)
                          : e.target.value,
                    }))
                  }
                />
              );
            })}
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
