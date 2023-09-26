import { useEffect, useState } from "react";
import MedicationIntakeTable from "../../Tables/MedicationIntakeTable";
import { Alert, Modal } from "../../Containers";
import { useFunction } from "../../../context/FunctionContext";
import { useAuth } from "../../../context/authContext";
import { BigTextInput, Button, TextInput } from "../../Forms";

export default function MedicationIntake() {
  const [selectedIntake, setIntake] = useState(null);
  const [modalTitle, setModalTitle] = useState(null);
  const [medicineList, setMedicineList] = useState([]);
  const [medicineQuantity, setMedicineQuantity] = useState(0);
  const [alert, toggleAlert] = useState({
    type: "success",
    title: "",
    message: "",
    show: false,
  });
  const [buildings, setBuildings] = useState([]);

  const [refresh, doRefresh] = useState(0);
  const { capitalize, toTitle } = useFunction();
  const { getMedicine, getBuilding, updateMedicationIntake } = useAuth();

  const handleClose = () => {
    setModalTitle(null);
    setIntake(null);
    setMedicineQuantity(0);
    toggleAlert({
      type: "success",
      title: "",
      message: "",
      show: false,
    });
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    const response = await updateMedicationIntake(selectedIntake);
    setModalTitle(null);
    if (response === 1) {
      toggleAlert({
        type: "success",
        title: "Medication Update Success",
        message: "Successfully updated medication intake.",
        show: true,
      });
    } else {
      toggleAlert({
        type: "warning",
        title: "Medication Update Error",
        message:
          "There has been an error on updating medication intake. Please try again.",
        show: true,
      });
    }
    doRefresh((count) => (count = count + 1));
  };

  const calculateRemaining = (e, label) => {
    const intakeCount = parseInt(document.querySelector("#intake").value);
    const disposedCount = parseInt(document.querySelector("#disposed").value);
    setIntake((data) => ({
      ...data,
      [label]: parseInt(e.target.value),
      remaining: medicineQuantity - (intakeCount + disposedCount),
    }));
  };

  useEffect(() => {
    const setup = async () => {
      const medicineResponse = await getMedicine();
      setMedicineList(medicineResponse);
      const buildingResponse = await getBuilding();
      setBuildings(buildingResponse);
    };
    setup();
    const realtimeData = setInterval(setup, 5000);

    return () => {
      clearInterval(realtimeData);
    };
  }, [refresh]);
  return (
    <>
      <div className="overflow-auto">
        <MedicationIntakeTable
          refresh={refresh}
          setIntake={setIntake}
          setModal={setModalTitle}
          setMedicineQuantity={setMedicineQuantity}
        />
      </div>
      {modalTitle && (
        <Modal
          className="w-[500px] max-w-lg"
          title={capitalize(modalTitle)}
          onClose={() => handleClose()}
          content={
            <>
              <form onSubmit={handleUpdate} className="flex flex-col gap-2">
                {Object.keys(selectedIntake)
                  .filter((key) => !key.includes("date") && key !== "id")
                  .map((label, index) => {
                    return label === "medicine_id" ? (
                      <div key={index} className="flex gap-2 p-1 items-center">
                        <label
                          htmlFor={label}
                          className="whitespace-nowrap text-start w-1/2"
                        >
                          Medicine
                        </label>
                        <select
                          id={label}
                          disabled
                          className="w-full rounded px-2 outline-none border-none p-1 bg-default"
                          onChange={(e) =>
                            setIntake((current) => ({
                              ...current,
                              medicine_id: parseInt(e.target.value),
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
                                selected={
                                  med.medicine_id === selectedIntake[label]
                                }
                              >
                                {med.medicine_name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    ) : label === "remarks" ? (
                      <BigTextInput
                        id={label}
                        key={index}
                        withLabel={capitalize(toTitle(label)) + ":"}
                        value={selectedIntake[label]}
                        orientation="row"
                        classes="p-1 items-start"
                        labelClasses="whitespace-nowrap text-start w-1/2"
                        inputClasses="w-full rounded px-2 h-full resize-none min-h-[100px] bg-default"
                        onChange={(e) =>
                          setIntake((data) => ({
                            ...data,
                            [label]: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <TextInput
                        key={index}
                        name={label}
                        type={label.includes("date") ? "date" : "number"}
                        id={label}
                        withLabel={
                          label === "building_id"
                            ? "Building No."
                            : capitalize(toTitle(label))
                        }
                        disabled={
                          label === "building_id" || label === "remaining"
                        }
                        value={
                          label === "building_id"
                            ? buildings.find(
                                (bldg) => bldg.id == selectedIntake[label]
                              ).number
                            : selectedIntake[label]
                        }
                        onChange={(e) => {
                          calculateRemaining(e, label);
                        }}
                        classes="p-1 items-center justify-between"
                        labelClasses="whitespace-nowrap text-start w-1/2"
                        inputClasses="bg-default rounded px-2 disabled:text-gray-600"
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
