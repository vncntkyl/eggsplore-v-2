import { useEffect, useState } from "react";
import { AiFillDelete, AiFillPlusCircle } from "react-icons/ai";
import { BigTextInput, Button, TextInput } from "../../Forms";
import { useFunction } from "../../../context/FunctionContext";
import { useAuth } from "../../../context/authContext";
import { HiPencilAlt } from "react-icons/hi";
import { Alert, Modal } from "../../Containers";

export default function Medicine() {
  const { capitalize, toTitle } = useFunction();
  const { getMedicine, addMedicine, updateMedicine, deleteMedicine } =
    useAuth();

  const [refresh, doRefresh] = useState(0);
  const [medicine, setMedicine] = useState([]);
  const [modalTitle, setModalTitle] = useState(null);
  const [selectedMedicine, selectMedicine] = useState(null);
  const [alert, toggleAlert] = useState({
    type: "success",
    title: "",
    message: "",
    show: false,
  });
  const [newMedicine, setNewMedicine] = useState({
    medicine_name: "",
    dosage_instructions: "",
    usage_indication: "",
  });
  const handleRegistration = async (e) => {
    e.preventDefault();
    const response = await addMedicine(newMedicine);
    setModalTitle(null);
    if (response === 1) {
      toggleAlert({
        type: "success",
        title: "Registration Complete",
        message: "New medicine has been registered.",
        show: true,
      });
    } else {
      toggleAlert({
        type: "warning",
        title: "Registration Error",
        message:
          "There has been an error on medicine registration. Please try again.",
        show: true,
      });
    }
    doRefresh((count) => (count = count + 1));
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    const response = await updateMedicine(
      newMedicine,
      selectedMedicine.medicine_id
    );
    setModalTitle(null);
    if (response === 1) {
      toggleAlert({
        type: "success",
        title: "Medicine Update Complete",
        message: "Medicine information has been updated.",
        show: true,
      });
    } else {
      toggleAlert({
        type: "warning",
        title: "Update Error",
        message:
          "There has been an error on updating the medicine information. Please try again.",
        show: true,
      });
    }
    doRefresh((count) => (count = count + 1));
  };
  const handleDelete = async () => {
    const response = await deleteMedicine(selectedMedicine.medicine_id);
    setModalTitle(null);
    if (response == 1) {
      toggleAlert({
        type: "success",
        title: "Deletion Complete",
        message: `${capitalize(
          selectedMedicine.medicine_name
        )} has been deleted.`,
        show: true,
      });
    } else {
      toggleAlert({
        type: "warning",
        title: "Deletion Error",
        message: "An error has occured. Please try again.",
        show: true,
      });
    }
    doRefresh((count) => (count = count + 1));
  };

  const handleClose = () => {
    setModalTitle(null);
    selectMedicine(null);
    toggleAlert({
      type: "success",
      title: "",
      message: "",
      show: false,
    });
    setNewMedicine({
      medicine_name: "",
      dosage_instructions: "",
      usage_indication: "",
    });
  };

  useEffect(() => {
    const setup = async () => {
      const response = await getMedicine();
      setMedicine(response);
    };
    setup();
    const realtimeData = setInterval(setup, 5000);

    return () => {
      clearInterval(realtimeData);
    };
  }, [refresh]);

  return (
    <>
      <div>
        <div className="flex flex-row items-center justify-between">
          <Button
            onClick={() => setModalTitle("add medicine")}
            value={
              <div className="flex items-center gap-1">
                <AiFillPlusCircle />
                <span>Add Medicine</span>
              </div>
            }
            className={
              "bg-main text-white p-1 px-2 rounded-full text-[.9rem] transition-all hover:bg-tertiary hover:text-main"
            }
          />
        </div>
        <div className="py-2 overflow-x-auto">
          <table className="w-full rounded-md shadow-md overflow-hidden">
            <thead>
              <tr className="bg-main text-white">
                <th>Medicine Name</th>
                <th>Dosage Instructions</th>
                <th>Usage Indication</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicine.map((med) => {
                return (
                  <tr key={med.medicine_id} className="hover:bg-slate-200">
                    <td align="center" className="p-2 w-1/6">
                      {capitalize(med.medicine_name)}
                    </td>
                    <td align="center" className="p-2 w-2/6">
                      {med.dosage_instructions}
                    </td>
                    <td align="center" className="p-2 w-2/6">
                      {med.usage_indication}
                    </td>
                    <td align="center" className="p-2 w-1/6">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          onClick={() => {
                            selectMedicine(med);
                            setNewMedicine({
                              medicine_name: med.medicine_name,
                              dosage_instructions: med.dosage_instructions,
                              usage_indication: med.usage_indication,
                              update: true,
                            });
                            setModalTitle("edit medicine");
                          }}
                          className="bg-yellow p-1 rounded"
                          value={<HiPencilAlt className="text-white" />}
                        />
                        <Button
                          className="bg-red-light p-1 rounded"
                          onClick={() => {
                            selectMedicine(med);
                            setModalTitle("confirmation");
                          }}
                          value={<AiFillDelete className="text-white" />}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {modalTitle && (
        <Modal
          title={capitalize(modalTitle)}
          onClose={() => handleClose()}
          className={["add medicine", "edit medicine"].includes(modalTitle) ? "w-[95%] max-w-[750px]" : "w-[95%] max-w-[300px]"}
          content={
            ["add medicine", "edit medicine"].includes(modalTitle) ? (
              <>
                <form
                  autoComplete="off"
                  className="flex flex-col gap-2"
                  onSubmit={
                    Object.keys(newMedicine).includes("update")
                      ? handleUpdate
                      : handleRegistration
                  }
                >
                  {Object.keys(newMedicine)
                    .filter((key) => key !== "update")
                    .map((lbl, index) => {
                      return lbl === "medicine_name" ? (
                        <TextInput
                          key={index}
                          id={lbl}
                          value={
                            modalTitle === "edit medicine"
                              ? newMedicine[lbl]
                              : null
                          }
                          withLabel={capitalize(toTitle(lbl))}
                          orientation="row"
                          classes="p-1 items-center justify-between"
                          labelClasses="whitespace-nowrap w-1/3 text-start"
                          inputClasses="bg-default w-2/3 rounded px-2"
                          onChange={(e) => {
                            setNewMedicine((current) => ({
                              ...current,
                              [lbl]: e.target.value,
                            }));
                          }}
                        />
                      ) : (
                        <BigTextInput
                          key={index}
                          id={lbl}
                          value={
                            modalTitle === "edit medicine"
                              ? newMedicine[lbl]
                              : null
                          }
                          withLabel={capitalize(toTitle(lbl))}
                          classes="p-1 items-start justify-between"
                          labelClasses="whitespace-nowrap w-1/3 text-start"
                          inputClasses="bg-default w-2/3 rounded px-2 min-w-[400px] min-h-[150px]"
                          onChange={(e) => {
                            setNewMedicine((current) => ({
                              ...current,
                              [lbl]: e.target.value,
                            }));
                          }}
                        />
                      );
                    })}
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="submit"
                      value={newMedicine.update ? "Save Changes" : "Register"}
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
                <p>
                  Are you sure to remove{" "}
                  <span className="font-semibold">
                    {capitalize(selectedMedicine.medicine_name)}?
                  </span>
                </p>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    value="Delete"
                    onClick={() => handleDelete()}
                    className="bg-tertiary p-1 px-2 rounded-md hover:bg-main hover:text-white transition-all"
                  />
                  <Button
                    value="Cancel"
                    onClick={() => handleClose()}
                    className="bg-gray-200 text-gray-700 p-1 px-2 rounded-md"
                  />
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
