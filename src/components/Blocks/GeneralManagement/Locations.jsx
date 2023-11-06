import { useEffect, useState } from "react";
import { useFunction } from "../../../context/FunctionContext";
import { useAuth } from "../../../context/authContext";
import { Button, TextInput } from "../../Forms";
import { AiFillDelete, AiFillPlusCircle } from "react-icons/ai";
import { HiPencilAlt } from "react-icons/hi";
import { Alert, Modal } from "../../Containers";

export default function Locations() {
  const { capitalize, toTitle } = useFunction();
  const { getLocation, addLocation, updateLocation, deleteLocation } =
    useAuth();

  const [refresh, doRefresh] = useState(0);
  const [locations, setLocations] = useState([]);
  const [modalTitle, setModalTitle] = useState(null);
  const [selectedLocation, setLocation] = useState(null);
  const [alert, toggleAlert] = useState({
    type: "success",
    title: "",
    message: "",
    show: false,
  });
  const [newLocation, setNewLocation] = useState({
    location_name: "",
  });
  const handleUpdate = async (e) => {
    e.preventDefault();
    const response = await updateLocation(
      newLocation,
      selectedLocation.location_id
    );
    setModalTitle(null);
    if (response === 1) {
      toggleAlert({
        type: "success",
        title: "Location Update Complete",
        message: "Location information has been updated.",
        show: true,
      });
    } else {
      toggleAlert({
        type: "warning",
        title: "Update Error",
        message:
          response,
        show: true,
      });
    }
    doRefresh((count) => (count = count + 1));
  };
  const handleRegistration = async (e) => {
    e.preventDefault();
    const response = await addLocation(newLocation);
    setModalTitle(null);
    if (response === 1) {
      toggleAlert({
        type: "success",
        title: "Registration Complete",
        message: "New delivery location has been registered.",
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
    const response = await deleteLocation(selectedLocation.location_id);
    setModalTitle(null);
    if (response == 1) {
      toggleAlert({
        type: "success",
        title: "Deletion Complete",
        message: `${capitalize(
          selectedLocation.location_name
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
    setLocation(null);
    toggleAlert({
      type: "success",
      title: "",
      message: "",
      show: false,
    });
    setNewLocation({ location_name: "" });
  };
  useEffect(() => {
    const setup = async () => {
      const response = await getLocation();
      setLocations(response);
    };
    setup();
   
  }, [refresh]);
  return (
    <>
      <div>
        <p className="font-semibold text-[1.1rem] mb-1 text-main">
          Delivery Locations Management
        </p>
        <div className="flex flex-row items-center justify-between">
          <Button
            onClick={() => setModalTitle("add location")}
            value={
              <div className="flex items-center gap-1">
                <AiFillPlusCircle />
                <span>Add Location</span>
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
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location) => {
                return (
                  <tr key={location.location_id} className="hover:bg-slate-200">
                    <td align="center" className="p-2">
                      {location.location_name}
                    </td>
                    <td align="center" className="p-2">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          onClick={() => {
                            setLocation(location);
                            setNewLocation({
                              location_name: location.location_name,
                              update: true,
                            });
                            setModalTitle("edit location");
                          }}
                          className="bg-yellow p-1 rounded"
                          value={<HiPencilAlt className="text-white" />}
                        />
                        <Button
                          className="bg-red-light p-1 rounded"
                          onClick={() => {
                            setLocation(location);
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
            ["add location", "edit location"].includes(modalTitle) ? (
              <>
                <form
                  autoComplete="off"
                  className="flex flex-col gap-2"
                  onSubmit={
                    Object.keys(newLocation).includes("update")
                      ? handleUpdate
                      : handleRegistration
                  }
                >
                  {Object.keys(newLocation)
                    .filter((key) => key !== "update")
                    .map((lbl, index) => {
                      return (
                        <TextInput
                          key={index}
                          id={lbl}
                          value={
                            modalTitle === "edit location"
                              ? newLocation[lbl]
                              : null
                          }
                          withLabel={capitalize(toTitle(lbl))}
                          orientation="row"
                          classes="p-1 items-center justify-between"
                          labelClasses="whitespace-nowrap w-1/3 text-start"
                          inputClasses="bg-default w-2/3 rounded px-2"
                          onChange={(e) => {
                            setNewLocation((current) => ({
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
                      value={newLocation.update ? "Save Changes" : "Register"}
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
                    {capitalize(selectedLocation.location_name)}?
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
