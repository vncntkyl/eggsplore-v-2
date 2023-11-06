/* eslint-disable react/prop-types */
import NotificationDropdown from "../Containers/NotificationDropdown";
import { Button } from "../Forms";
import avatar_1 from "../../assets/avatar_1.png";
import { BsChevronDown } from "react-icons/bs";
import doorbell from "../../assets/doorbell.png";
import classNames from "classnames";
import { useRef, useState } from "react";
import { useFunction } from "../../context/FunctionContext";
import UserDropdown from "../Containers/UserDropdown";
import { Alert, Modal } from "../Containers";
import { useAuth } from "../../context/authContext";
import { GiHamburgerMenu } from "react-icons/gi";

export default function Navbar({ isStaff, user, toggleSidebar }) {
  const { capitalize } = useFunction();
  const [modal, setModal] = useState(null);
  const [alert, toggleAlert] = useState({
    type: "success",
    title: "",
    message: "",
    show: false,
  });
  const [notification, toggleNotification] = useState(false);
  const [userPanel, toggleUserPanel] = useState(false);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitStatus, setSubmitStatus] = useState(true);
  const currentPasswordRef = useRef();
  const { updatePassword, getCurrentUser } = useAuth();
  const NotificationBell = () => {
    return <img src={doorbell} className="w-1/2 text-center" />;
  };

  const changePassword = async (e) => {
    e.preventDefault();
    const userID = JSON.parse(getCurrentUser()).user_id;

    const response = await updatePassword(
      currentPasswordRef.current.value,
      newPassword,
      userID
    );
    console.log(response);
    setModal(null);
    if (response === 1) {
      toggleAlert({
        type: "success",
        title: "Password Update Success",
        message: "Successfully updated your password.",
        show: true,
      });
    } else {
      toggleAlert({
        type: "warning",
        title: "Password Update Error",
        message:
          "There has been an error on updating your password. Please try again.",
        show: true,
      });
    }
  };

  const UserToggle = () => {
    return (
      <div className="flex flex-row gap-2 items-center w-full">
        <img src={avatar_1} alt="" className="w-[40px] h-[40px]" />
        <div className="text-black hidden lg:block">
          {capitalize(user.first_name + " " + user.last_name)}
        </div>
        <BsChevronDown
          className={classNames(
            "transition-[transform]",
            userPanel ? "rotate-180" : "rotate-0"
          )}
        />
      </div>
    );
  };
  return (
    <>
      <div
        className={classNames(
          "fixed top-0 h-navbar bg-white w-full shadow-md z-[2]",
          !isStaff && "pl-0 lg:pl-sidebar"
        )}
      >
        <div
          className={classNames(
            "h-navbar flex flex-row items-center  px-4",
            isStaff
              ? "xl:px-sidebar-1/2 2xl:px-sidebar justify-between"
              : "justify-between"
          )}
        >
          {isStaff && (
            <h1 className="mr-auto text-main text-[1.2rem] font-semibold">
              Edwin and Lina Poultry Farm
            </h1>
          )}
          {/* NOTIFICATION CONTAINER */}
          {!isStaff && (
            <>
              <Button
                value={<GiHamburgerMenu className="text-main text-xl lg:hidden" />}
                className="mr-auto"
                onClick={() => toggleSidebar(true)}
              />
              <div className="relative">
                <Button
                  type="button"
                  value={<NotificationBell />}
                  onClick={() => toggleNotification((prev) => !prev)}
                  className="p-0 lg:p-2 items-center justify-end"
                />
                {notification && (
                  <NotificationDropdown
                    toggleNotification={toggleNotification}
                  />
                )}
              </div>
            </>
          )}
          <span className="h-2/3 border-2" />
          {/* USER PANEL CONTAINER */}
          <div className="relative">
            <Button
              type="button"
              value={<UserToggle />}
              onClick={() => toggleUserPanel((prev) => !prev)}
              className="p-2 w-full"
            />
            {userPanel && (
              <UserDropdown setModal={setModal} closePanel={toggleUserPanel} />
            )}
          </div>
        </div>
      </div>
      {modal && (
        <Modal
          title={capitalize(modal)}
          onClose={() => setModal(null)}
          className={"w-full mx-1 max-w-[400px]"}
          content={
            <>
              <form onSubmit={changePassword}>
                <div className="flex flex-col md:flex-row gap-2 p-1 items-start md:items-center justify-between">
                  <label
                    htmlFor="currentPassword"
                    className="whitespace-nowrap text-left md:text-start"
                  >
                    Enter current password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    className="outline-none border-none p-1 w-full md:w-1/2 bg-default rounded px-2"
                    ref={currentPasswordRef}
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-2 p-1 items-start md:items-center justify-between">
                  <label
                    htmlFor="newPassword"
                    className="whitespace-nowrap text-left md:text-start"
                  >
                    Enter new password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                    }}
                    className="outline-none border-none p-1 w-full md:w-1/2 bg-default rounded px-2"
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-2 p-1 items-start md:items-center justify-between">
                  <label
                    htmlFor="confirmPassword"
                    className="whitespace-nowrap text-left md:text-start"
                  >
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="outline-none border-none p-1 w-full md:w-1/2 bg-default rounded px-2"
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (e.target.value === newPassword) {
                        setSubmitStatus(false);
                      } else {
                        setSubmitStatus(true);
                      }
                    }}
                    disabled={newPassword === null}
                  />
                </div>
                {submitStatus && confirmPassword.length > 0 && (
                  <p className="text-start text-[.9rem] text-red-500">
                    Passwords do not match
                  </p>
                )}
                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="submit"
                    value="Update"
                    disabled={submitStatus}
                    className="bg-tertiary p-1 px-2 rounded-md hover:bg-main hover:text-white transition-all
                     disabled:bg-default disabled:text-gray-500 disabled:hover:text-gray-500"
                  />
                  <Button
                    value="Cancel"
                    onClick={() => setModal(null)}
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
          onClose={() =>
            toggleAlert({
              type: "success",
              title: "",
              message: "",
              show: false,
            })
          }
        />
      )}
    </>
  );
}
