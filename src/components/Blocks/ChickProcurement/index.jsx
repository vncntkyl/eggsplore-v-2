import { useEffect, useState } from "react";
import { Button, TextInput } from "../../Forms";
import { AiFillPlusCircle } from "react-icons/ai";
import { useAuth } from "../../../context/authContext";
import { format } from "date-fns";
import { HiPencilAlt } from "react-icons/hi";
import { Modal, Alert } from "../../Containers";
import { useFunction } from "../../../context/FunctionContext";

export default function ChickProcurement() {
  const [modalTitle, setModalTitle] = useState(null);
  const [chicks, setChicks] = useState([]);
  const [refresh, doRefresh] = useState(0);
  const [selectedProcurement, selectProcurement] = useState([]);
  const [newProcurement, setNewProcurement] = useState({
    date_procured: "",
    no_of_new_chicks: 0,
    supplier: "",
  });
  const [alert, toggleAlert] = useState({
    type: "success",
    title: "",
    message: "",
    show: false,
  });

  const { retrieveProduction, addChickProcurement, updateChickProcurement } =
    useAuth();
  const { capitalize, toTitle } = useFunction();

  const handleClose = () => {
    setModalTitle(null);
    selectProcurement([]);
    toggleAlert({
      type: "success",
      title: "",
      message: "",
      show: false,
    });
    setNewProcurement({
      date_procured: "",
      no_of_new_chicks: 0,
      supplier: "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const response = await updateChickProcurement(
      newProcurement,
      selectedProcurement.chick_id
    );
    setModalTitle(null);
    if (response === 1) {
      toggleAlert({
        type: "success",
        title: "Procurement Update Success",
        message: "Successfully updated the procurement information.",
        show: true,
      });
    } else {
      toggleAlert({
        type: "warning",
        title: "Procurement Update Error",
        message:
          "There has been an error on updating chick procurement. Please try again.",
        show: true,
      });
    }
    doRefresh((count) => (count = count + 1));
  };
  const handleRegistration = async (e) => {
    e.preventDefault();
    const response = await addChickProcurement(newProcurement);
    setModalTitle(null);
    if (response === 1) {
      toggleAlert({
        type: "success",
        title: "Procurement Success",
        message: "New batch of chicks has been procured.",
        show: true,
      });
    } else {
      toggleAlert({
        type: "warning",
        title: "Procurement Error",
        message:
          "There has been an error on chick procurement. Please try again.",
        show: true,
      });
    }
    doRefresh((count) => (count = count + 1));
  };

  useEffect(() => {
    const setup = async () => {
      const response = await retrieveProduction("ep_chicks");
      setChicks(response);
    };

    setup();
    const realtimeData = setInterval(setup, 1000);

    return () => {
      clearInterval(realtimeData);
    };
  }, [refresh]);

  return (
    <>
      <div className="flex flex-col gap-4 items-end px-32">
        <Button
          onClick={() => setModalTitle("add new chicks")}
          value={
            <div className="flex items-center gap-1">
              <AiFillPlusCircle />
              <span>Add New Chicks</span>
            </div>
          }
          className={
            "bg-main text-white p-1 px-2 rounded-full text-[.9rem] transition-all hover:bg-tertiary hover:text-main"
          }
        />
        {/* CHICK PROCUREMENT TABLE */}
        <div className="w-full">
          <table className="w-full rounded-md shadow-md overflow-hidden bg-white">
            <thead>
              <tr className="bg-main text-white">
                <th>Batch No.</th>
                <th>No. of New Chicks</th>
                <th>Supplier</th>
                <th>Date Procured</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {chicks.map((chick, index) => {
                return (
                  <tr key={index}>
                    <td className="p-2" align="center">
                      {chick.batch_number}
                    </td>
                    <td className="p-2" align="center">
                      {chick.chick_count}
                    </td>
                    <td className="p-2" align="center">
                      {chick.supplier}
                    </td>
                    <td className="p-2" align="center">
                      {format(new Date(chick.date_procured), "MMMM d, yyyy")}
                    </td>
                    <td className="p-2" align="center">
                      <Button
                        onClick={() => {
                          selectProcurement(chick);
                          setModalTitle("edit procurement");
                          setNewProcurement({
                            date_procured: chick.date_procured,
                            no_of_new_chicks: chick.chick_count,
                            supplier: chick.supplier,
                            update: true,
                          });
                        }}
                        className="bg-yellow p-1 rounded"
                        value={<HiPencilAlt className="text-white" />}
                      />
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
          content={
            <>
              <form
                autoComplete="off"
                className="flex flex-col gap-2"
                onSubmit={
                  Object.keys(newProcurement).includes("update")
                    ? handleUpdate
                    : handleRegistration
                }
              >
                {Object.keys(newProcurement).map((lbl, index) => {
                  return (
                    lbl !== "update" && (
                      <TextInput
                        key={index}
                        type={
                          lbl === "date_procured"
                            ? "date"
                            : lbl === "supplier"
                            ? "text"
                            : "number"
                        }
                        id={lbl}
                        value={
                          modalTitle === "edit procurement"
                            ? newProcurement[lbl]
                            : null
                        }
                        withLabel={capitalize(toTitle(lbl))}
                        orientation="row"
                        classes="p-1 items-center justify-between"
                        labelClasses="whitespace-nowrap text-start"
                        inputClasses="bg-default rounded px-2"
                        onChange={(e) => {
                          setNewProcurement((current) => ({
                            ...current,
                            [lbl]: e.target.value,
                          }));
                        }}
                      />
                    )
                  );
                })}
                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="submit"
                    value={newProcurement.update ? "Save Changes" : "Register"}
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
