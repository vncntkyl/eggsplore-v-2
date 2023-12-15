import { useEffect, useState } from "react";
import { useFunction } from "../../../context/FunctionContext";
import { useAuth } from "../../../context/authContext";
import { AiFillDelete, AiFillPlusCircle } from "react-icons/ai";
import { Button, TextInput } from "../../Forms";
import { HiPencilAlt } from "react-icons/hi";
import { Modal, Alert } from "../../Containers";

export default function Buildings() {
  const [refresh, doRefresh] = useState(0);
  const [buildings, setBuildings] = useState([]);
  const [modalTitle, setModalTitle] = useState(null);
  const [selectedBuilding, setBuilding] = useState(null);
  const [alert, toggleAlert] = useState({
    type: "success",
    title: "",
    message: "",
    show: false,
  });
  const [newBuilding, setNewBuilding] = useState({
    number: 0,
    capacity: 0,
  });

  const { capitalize, toTitle } = useFunction();
  const { getBuilding, addBuilding, updateBuilding, deleteBuilding } =
    useAuth();

  const handleUpdate = async (e) => {
    e.preventDefault();
    const response = await updateBuilding(newBuilding, selectedBuilding.id);
    setModalTitle(null);
    if (response === 1) {
      toggleAlert({
        type: "success",
        title: "Building Update Complete",
        message: "Building information has been updated.",
        show: true,
      });
    } else {
      toggleAlert({
        type: "warning",
        title: "Update Error",
        message:
          "There has been an error on updating the building information. Please try again.",
        show: true,
      });
    }
    doRefresh((count) => (count = count + 1));
  };
  const handleRegistration = async (e) => {
    e.preventDefault();
    const response = await addBuilding(newBuilding);
    setModalTitle(null);
    if (response === 1) {
      toggleAlert({
        type: "success",
        title: "Registration Complete",
        message: "New building has been registered.",
        show: true,
      });
    } else {
      toggleAlert({
        type: "warning",
        title: "Registration Error",
        message: "There has been an error on registration. Please try again.",
        show: true,
      });
    }
    doRefresh((count) => (count = count + 1));
  };
  const handleDelete = async () => {
    const response = await deleteBuilding(selectedBuilding.id);
    setModalTitle(null);
    if (response == 1) {
      toggleAlert({
        type: "success",
        title: "Deletion Complete",
        message: `${capitalize(selectedBuilding.number)} has been deleted.`,
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
    setBuilding(null);
    toggleAlert({
      type: "success",
      title: "",
      message: "",
      show: false,
    });
    setNewBuilding({ number: 0, capacity: 0 });
  };

  useEffect(() => {
    const setup = async () => {
      const response = await getBuilding();
      setBuildings(response);
    };
    setup();
  }, [refresh]);

  return (
    <>
      <div>
        <p className="font-semibold text-[1.1rem] mb-1 text-main">
          Building Management
        </p>
        <div className="flex flex-row items-center justify-between">
          <Button
            onClick={() => setModalTitle("add building")}
            value={
              <div className="flex items-center gap-1">
                <AiFillPlusCircle />
                <span>Add Building</span>
              </div>
            }
            className={
              "bg-main text-white p-1 px-2 rounded-full text-[.9rem] transition-all hover:bg-tertiary hover:text-main"
            }
          />
        </div>
        <div className="py-2">
          <table className="w-full rounded-md shadow-md overflow-hidden">
            <thead>
              <tr className="bg-main text-white">
                <th>Building No. </th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {buildings.map((bldg) => {
                return (
                  <tr key={bldg.id} className="hover:bg-slate-200">
                    <td align="center" className="p-2">
                      {bldg.number}
                    </td>
                    <td align="center" className="p-2">
                      {bldg.capacity}
                    </td>
                    <td align="center" className="p-2">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          onClick={() => {
                            setBuilding(bldg);
                            setNewBuilding({
                              number: bldg.number,
                              capacity: bldg.capacity,
                              update: true,
                            });
                            setModalTitle("edit building");
                          }}
                          className="bg-yellow p-1 rounded"
                          value={<HiPencilAlt className="text-white" />}
                        />
                        <Button
                          className="bg-red-light p-1 rounded"
                          onClick={() => {
                            setBuilding(bldg);
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
          className="w-[95%] max-w-[300px]"
          content={
            ["add building", "edit building"].includes(modalTitle) ? (
              <>
                <form
                  autoComplete="off"
                  className="flex flex-col gap-2"
                  onSubmit={
                    Object.keys(newBuilding).includes("update")
                      ? handleUpdate
                      : handleRegistration
                  }
                >
                  {Object.keys(newBuilding)
                    .filter((key) => key !== "update")
                    .map((lbl, index) => {
                      return (
                        <TextInput
                          type="number"
                          key={index}
                          id={lbl}
                          value={
                            modalTitle === "edit building"
                              ? newBuilding[lbl]
                              : null
                          }
                          important
                          withLabel={capitalize(toTitle(lbl))}
                          orientation="row"
                          classes="p-1 items-center justify-between"
                          labelClasses="whitespace-nowrap w-1/3 text-start"
                          inputClasses="bg-default w-2/3 rounded px-2"
                          onChange={(e) => {
                            setNewBuilding((current) => ({
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
                      value={newBuilding.update ? "Save Changes" : "Register"}
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
                    Building #{selectedBuilding.number}?
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
