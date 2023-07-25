import { useEffect, useState } from "react";
import { BigTextInput, Button, TextInput } from "../../Forms";
import { useFunction } from "../../../context/FunctionContext";
import { format } from "date-fns";
import { useAuth } from "../../../context/authContext";
import { Alert, Modal } from "../../Containers";
import MedicationIntakeTable from "../../MedicationIntakeTable";
// eslint-disable-next-line react/prop-types
export default function MedicineManagement({ building }) {
  const [refresh, doRefresh] = useState(0);
  const [modalTitle, setModalTitle] = useState(null);
  const [currentBuilding, setCurrentBuilding] = useState([]);
  const [medicineList, setMedicineList] = useState([]);

  const [medicineData, setMedicineData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    building_number: 0,
    medicine: 0,
    intake: 0,
    disposed: 0,
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
  const { getCurrentUser, getBuilding, getMedicine, addMedicationIntake } = useAuth();

  const handleSubmit = async () => {
    setModalTitle(null);
    const building_id = document.querySelector("#building_id");
    const id = parseInt(building_id.value);

    const data = {
      date: medicineData.date,
      count: medicineData.egg_tray_count,
      building: id,
      medicine_id: medicineData.medicine,
      intake: medicineData.intake,
      disposed: medicineData.disposed,
      remaining: medicineData.remaining,
      remarks: medicineData.remarks,
      staff: JSON.parse(getCurrentUser()).user_id,
      log_date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    };
    try {
      const response = await addMedicationIntake(data);
      console.log(response);
      if (response === 1) {
        toggleAlert({
          type: "success",
          title: "Medication Update Success",
          message: "You have successfully updated the remaining medicine!",
          show: true,
        });
      } else {
        toggleAlert({
          type: "warning",
          title: "Medication Update Error",
          message:
            "There has been an error on updating the remaining medicine. Please try again.",
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
    setMedicineData({
      date: format(new Date(), "yyyy-MM-dd"),
      building_number: building,
      medicine: 0,
      intake: 0,
      disposed: 0,
      remaining: 0,
      remarks: "",
    });
  };

  useEffect(() => {
    const setup = async () => {
      const response = await getBuilding(building);
      setCurrentBuilding(response);
      const meds = await getMedicine();
      setMedicineList(meds);
      setMedicineData({
        date: format(new Date(), "yyyy-MM-dd"),
        building_number: response.number,
        medicine: 0,
        intake: 0,
        disposed: 0,
        remaining: 0,
        remarks: "",
      });
    };
    setup();
  }, [building]);
  return (
    <>
      <div className="p-2 flex flex-row gap-2 w-full animate-fade">
        <div className="w-full">
          <p className="text-[1.2rem] font-semibold">Medicine Management</p>
          <form
            className="flex flex-col gap-2 bg-default p-2 rounded-md"
            onSubmit={(e) => {
              e.preventDefault();
              setModalTitle("Confirmation");
            }}
          >
            <div className="flex flex-row gap-2">
              <div className="w-full flex flex-col gap-2 bg-default p-2 rounded-md">
                {Object.keys(medicineData).map((medicineKey, index) => {
                  return medicineKey === "building_number" ? (
                    <>
                      <TextInput
                        type="hidden"
                        value={currentBuilding.id}
                        id="building_id"
                      />
                      <TextInput
                        id={medicineKey}
                        key={index}
                        withLabel={capitalize(toTitle(medicineKey)) + ":"}
                        value={currentBuilding.number}
                        type="number"
                        disabled={true}
                        orientation="row"
                        classes="p-1 items-center "
                        labelClasses="whitespace-nowrap w-full text-start"
                        inputClasses="w-full rounded px-2"
                      />
                    </>
                  ) : medicineKey === "medicine" ? (
                    <div key={index} className="flex gap-2 p-1 items-center">
                      <label
                        htmlFor={medicineKey}
                        className="whitespace-nowrap w-full text-start"
                      >
                        Medicine
                      </label>
                      <select
                        id={medicineKey}
                        className="w-full rounded px-2 outline-none border-none p-1"
                        onChange={(e) =>
                          setMedicineData((current) => ({
                            ...current,
                            medicine: parseInt(e.target.value),
                          }))
                        }
                      >
                        <option value="" selected disabled>
                          Select Medicine
                        </option>
                        {medicineList.map((medicine, index) => {
                          return (
                            <option
                              key={index}
                              value={medicine.medicine_id}
                              selected={
                                medicine.medicine_id ===
                                medicineData[medicineKey]
                              }
                            >
                              {medicine.medicine_name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  ) : medicineKey === "remarks" ? (
                    <BigTextInput
                      id={medicineKey}
                      key={index}
                      withLabel={capitalize(toTitle(medicineKey)) + ":"}
                      value={setMedicineData[medicineKey]}
                      orientation="row"
                      classes="p-1 items-start"
                      labelClasses="whitespace-nowrap w-full text-start"
                      inputClasses="w-full rounded px-2 h-full resize-none min-h-[100px]"
                      onChange={(e) =>
                        setMedicineData((data) => ({
                          ...data,
                          [medicineKey]: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <TextInput
                      id={medicineKey}
                      key={index}
                      withLabel={capitalize(toTitle(medicineKey)) + ":"}
                      value={medicineData[medicineKey]}
                      type={medicineKey === "date" ? "date" : "number"}
                      orientation="row"
                      classes="p-1 items-center"
                      labelClasses="whitespace-nowrap w-full text-start"
                      inputClasses="w-full rounded px-2"
                      onChange={(e) =>
                        setMedicineData((data) => ({
                          ...data,
                          [medicineKey]:
                            medicineKey === "date"
                              ? e.target.value
                              : parseInt(e.target.value),
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
          <p className="text-[1.2rem] font-semibold">
            Medicine Management Logs
          </p>
          <MedicationIntakeTable refresh={refresh} />
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
