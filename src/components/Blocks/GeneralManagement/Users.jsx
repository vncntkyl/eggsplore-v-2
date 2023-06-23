import Toggle from "../../Fragments/Toggle";
import { useEffect, useState } from "react";
import { Button, TextInput } from "../../Forms";
import { AiFillDelete, AiFillPlusCircle } from "react-icons/ai";
import { HiPencilAlt } from "react-icons/hi";
import { useFunction } from "../../../context/FunctionContext";
import { useAuth } from "../../../context/authContext";
import Modal from "../../Containers/Modal";

export default function Users() {
  const [activePanel, setActivePanel] = useState("admin");
  const [modalTitle, setModalTitle] = useState(null);
  const [users, setUsers] = useState([]);
  const [userBuildings, setUserBuildings] = useState([]);
  const { capitalize, getFullName, toTitle } = useFunction();
  const { getUser, getBuilding } = useAuth();

  useEffect(() => {
    const setup = async () => {
      const response = await getUser();
      setUsers(response);
      const building_designations = await getBuilding("relation");
      setUserBuildings(building_designations);
    };
    setup();
  }, []);

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
                    <tr key={user.user_id}>
                      <td align="center" className="p-2">
                        {capitalize(getFullName(user))}
                      </td>
                      <td align="center" className="p-2">
                        {user.username}
                      </td>
                      {activePanel === "staff" && (
                        <td align="center" className="p-2">
                          <div className="flex flex-col">
                            {userBuildings
                              .filter((ub) => ub.user_id === user.user_id)
                              .map((bldg) => {
                                return (
                                  <span key={bldg.id} className="">
                                    {bldg.name}
                                  </span>
                                );
                              })}
                          </div>
                        </td>
                      )}
                      <td align="center" className="p-2">
                        <div className="flex items-center justify-center gap-1">
                          {activePanel === "staff" && (
                            <Button
                              onClick={() => setModalTitle("edit user")}
                              className="bg-yellow p-1 rounded"
                              value={<HiPencilAlt className="text-white" />}
                            />
                          )}
                          <Button
                            className="bg-red-light p-1 rounded"
                            onClick={() => setModalTitle("confirmation")}
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
          onClose={() => setModalTitle(null)}
          content={
            modalTitle === "register user" ? (
              <>
                <form className="flex flex-col gap-2">
                  {["first_name", "middle_name", "last_name", "username"].map(
                    (lbl, index) => {
                      return (
                        <TextInput
                          key={index}
                          id={lbl}
                          withLabel={capitalize(toTitle(lbl))}
                          orientation="row"
                          classes="p-1 items-center justify-between"
                          labelClasses="whitespace-nowrap w-1/3 text-start"
                          inputClasses="bg-default w-2/3 rounded px-2"
                        />
                      );
                    }
                  )}
                  <TextInput
                    type="password"
                    id="password"
                    withLabel="Password"
                    orientation="row"
                    classes="p-1 items-center justify-between"
                    labelClasses="whitespace-nowrap w-1/3 text-start"
                    inputClasses="bg-default w-2/3 rounded px-2"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="submit"
                      value="Register"
                      className="bg-tertiary p-1 px-2 rounded-md hover:bg-main hover:text-white transition-all"
                    />
                    <Button
                      value="Cancel"
                      className="bg-gray-200 text-gray-700 p-1 px-2 rounded-md"
                    />
                  </div>
                </form>
              </>
            ) : modalTitle === "edit user" ? (
              <></>
            ) : (
              <></>
            )
          }
        />
      )}
    </>
  );
}
