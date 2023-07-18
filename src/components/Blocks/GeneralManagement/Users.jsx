import Toggle from "../../Fragments/Toggle";
import { useEffect, useState } from "react";
import { Button, TextInput } from "../../Forms";
import {
  AiFillCaretDown,
  AiFillCaretUp,
  AiFillDelete,
  AiFillPlusCircle,
} from "react-icons/ai";
import { HiPencilAlt } from "react-icons/hi";
import { useFunction } from "../../../context/FunctionContext";
import { useAuth } from "../../../context/authContext";
import { Modal, Alert } from "../../Containers";

export default function Users() {
  const [activePanel, setActivePanel] = useState("admin");
  const [refresh, doRefresh] = useState(0);
  const [modalTitle, setModalTitle] = useState(null);
  const [showBldgDropdown, toggleBldgDropdown] = useState(false);
  const [users, setUsers] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [newUser, setNewUser] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    building_no: [],
    username: "",
    password: "",
  });
  const [alert, toggleAlert] = useState({
    type: "success",
    title: "",
    message: "",
    show: false,
  });
  const [userBuildings, setUserBuildings] = useState([]);
  const [selectedUser, setUser] = useState(null);

  const { capitalize, getFullName, toTitle } = useFunction();
  const { getUser, getBuilding, registerUser, deleteUser, updateUser } =
    useAuth();

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log(newUser);
    // const response = await updateUser(
    //   JSON.stringify(newUser),
    //   selectedUser.user_id
    // );
    // setModalTitle(null);
    // console.log(response);
    // if (response === 1) {
    //   toggleAlert({
    //     type: "success",
    //     title: "Account Update Complete",
    //     message: "User has been updated.",
    //     show: true,
    //   });
    // } else {
    //   toggleAlert({
    //     type: "warning",
    //     title: "Update Error",
    //     message:
    //       "There has been an error on updating the account. Please try again.",
    //     show: true,
    //   });
    // }
    // doRefresh((count) => (count = count + 1));
  };
  const handleRegistration = async (e) => {
    e.preventDefault();
    const user = { ...newUser, user_type: activePanel, status: 1 };
    const response = await registerUser(user);
    setModalTitle(null);
    if (response === 1) {
      toggleAlert({
        type: "success",
        title: "Registration Complete",
        message: "New " + activePanel + " has been registered.",
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

  const handleClose = () => {
    setModalTitle(null);
    setUser(null);
    toggleAlert({
      type: "success",
      title: "",
      message: "",
      show: false,
    });
    setNewUser({
      first_name: "",
      middle_name: "",
      last_name: "",
      building_no: "",
      username: "",
      password: "",
    });
  };

  const handleDelete = async () => {
    const response = await deleteUser(selectedUser.user_id);
    setModalTitle(null);
    if (response == 1) {
      toggleAlert({
        type: "success",
        title: "Deletion Complete",
        message: `User ${capitalize(selectedUser.first_name)} ${capitalize(
          selectedUser.last_name
        )} has been deleted.`,
        show: true,
      });
    } else {
      toggleAlert({
        type: "warning",
        title: "Deletion Error",
        message:
          "There has been an error on account deletion. Please try again.",
        show: true,
      });
    }
    doRefresh((count) => (count = count + 1));
  };

  useEffect(() => {
    const setup = async () => {
      const response = await getUser();
      setUsers(response);
      const building_designations = await getBuilding("relation");
      setUserBuildings(building_designations);
      const buildings = await getBuilding();
      setBuildings(buildings);
    };

    setup();
    const realtimeData = setInterval(setup, 1000);

    return () => {
      clearInterval(realtimeData);
    };
  }, [refresh]);

  return (
    <>
      <div>
        <div className="flex flex-row items-center justify-between">
          <Toggle
            option_1="admin"
            option_2="staff"
            setSelection={setActivePanel}
          />
          <Button
            onClick={() => setModalTitle("register user")}
            value={
              <div className="flex items-center gap-1">
                <AiFillPlusCircle />
                <span>{`Register ${capitalize(activePanel)}`}</span>
              </div>
            }
            className={
              "bg-main text-white p-1 px-2 rounded-full text-[.9rem] transition-all hover:bg-tertiary hover:text-main"
            }
          />
        </div>
        {/* USER TABLE */}
        <div className="py-2">
          <table className="w-full rounded-md shadow-md overflow-hidden">
            <thead>
              <tr className="bg-main text-white">
                {activePanel === "admin" ? (
                  <>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Action</th>
                  </>
                ) : (
                  <>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Building Designation</th>
                    <th>Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {users
                .filter((user) => user.user_type === activePanel)
                .map((user) => {
                  return (
                    <tr key={user.user_id} className="hover:bg-slate-200">
                      <td align="center" className="p-2">
                        {capitalize(getFullName(user))}
                      </td>
                      <td align="center" className="p-2">
                        {user.username}
                      </td>
                      {activePanel === "staff" && (
                        <td align="center" className="p-2">
                          {userBuildings
                            .filter((ub) => ub.user_id === user.user_id)
                            .map((bldg) => bldg.number)
                            .join(",")}
                        </td>
                      )}
                      <td align="center" className="p-2">
                        <div className="flex items-center justify-center gap-1">
                          {activePanel === "staff" && (
                            <Button
                              onClick={() => {
                                setUser(user);
                                setNewUser({
                                  first_name: user.first_name,
                                  middle_name: user.middle_name,
                                  last_name: user.last_name,
                                  building_no: [
                                    ...userBuildings
                                      .filter(
                                        (ub) => ub.user_id === user.user_id
                                      )
                                      .map((bldg) => {
                                        return bldg.number;
                                      }),
                                  ],
                                  username: user.username,
                                  update: true,
                                });
                                setModalTitle("edit user");
                              }}
                              className="bg-yellow p-1 rounded"
                              value={<HiPencilAlt className="text-white" />}
                            />
                          )}
                          <Button
                            className="bg-red-light p-1 rounded"
                            onClick={() => {
                              setUser(user);
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
          content={
            ["register user", "edit user"].includes(modalTitle) ? (
              <>
                <form
                  autoComplete="off"
                  className="flex flex-col gap-2"
                  onSubmit={
                    Object.keys(newUser).includes("update")
                      ? handleUpdate
                      : handleRegistration
                  }
                >
                  {Object.keys(newUser)
                    .filter((key) =>
                      activePanel !== "admin"
                        ? key !== "update"
                        : key !== "building_no" && key !== "update"
                    )
                    .map((lbl, index) => {
                      return lbl !== "building_no" ? (
                        <TextInput
                          type={lbl !== "password" ? "text" : "password"}
                          key={index}
                          id={lbl}
                          value={
                            modalTitle === "edit user" ? newUser[lbl] : null
                          }
                          withLabel={capitalize(toTitle(lbl))}
                          orientation="row"
                          classes="p-1 items-center justify-between"
                          labelClasses="whitespace-nowrap w-1/3 text-start"
                          inputClasses="bg-default w-2/3 rounded px-2"
                          onChange={(e) => {
                            setNewUser((current) => ({
                              ...current,
                              [lbl]: e.target.value,
                            }));
                          }}
                        />
                      ) : (
                        <div className="flex flex-row gap-2 items-center justify-between relative max--h-[30px] p-1">
                          <span>Buildings</span>
                          <Button
                            value={
                              <>
                                <p>Select Building/s</p>
                                {showBldgDropdown ? (
                                  <AiFillCaretDown />
                                ) : (
                                  <AiFillCaretUp />
                                )}
                              </>
                            }
                            className="bg-default p-1 px-2 w-full flex flex-row items-center justify-between rounded"
                            onClick={() => {
                              toggleBldgDropdown((prev) => !prev);
                            }}
                          />
                          {showBldgDropdown && (
                            <div className="flex flex-col gap-2 p-1 bg-default absolute right-0 top-full max-h-[50px] overflow-y-scroll">
                              {buildings.map((bldg, index) => {
                                return (
                                  <div key={index}>
                                    <input
                                      type="checkbox"
                                      id={bldg.id}
                                      value={bldg.id}
                                      checked={
                                        bldg.id == newUser.building_no[index]
                                      }
                                      className="hidden peer/option"
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const checked = e.target.checked;

                                        if (checked) {
                                          const tempUser = { ...newUser };
                                          tempUser.building_no.push(value);
                                          setNewUser(tempUser);
                                        } else {
                                          const tempUser = { ...newUser };
                                          tempUser.building_no =
                                            tempUser.building_no.filter(
                                              (bldg) => bldg != value
                                            );
                                          setNewUser(tempUser);
                                        }
                                      }}
                                    />
                                    <label
                                      htmlFor={bldg.id}
                                      className="cursor-pointer peer-checked/option:bg-default-dark w-[90%] p-2 select-none"
                                    >
                                      Building {bldg.number}
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="submit"
                      value={newUser.update ? "Save Changes" : "Register"}
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
                  Are you sure to remove user{" "}
                  <span className="font-semibold">
                    {capitalize(
                      selectedUser.first_name + " " + selectedUser.last_name
                    )}
                    ?
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
