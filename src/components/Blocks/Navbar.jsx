/* eslint-disable react/prop-types */
import NotificationDropdown from "../Containers/NotificationDropdown";
import { Button } from "../Forms";
import avatar_1 from "../../assets/avatar_1.png";
import { BsChevronDown } from "react-icons/bs";
import doorbell from "../../assets/doorbell.png";
import classNames from "classnames";
import { useState } from "react";
import { useFunction } from "../../context/FunctionContext";
import UserDropdown from "../Containers/UserDropdown";
// import OutsideTrigger from "./OutsideTrigger";

export default function Navbar({ isStaff, user }) {
  const { capitalize } = useFunction();

  const [notification, toggleNotification] = useState(false);
  const [userPanel, toggleUserPanel] = useState(false);

  const NotificationBell = () => {
    return <img src={doorbell} className="w-1/2 text-center" />;
  };

  const UserToggle = () => {
    return (
      <div className="flex flex-row gap-2 items-center">
        <img src={avatar_1} alt="" className="w-[40px] h-[40px]" />
        <div className="text-black">
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
    <div
      className={classNames(
        "fixed top-0 h-navbar bg-white w-full shadow-md",
        !isStaff && "pl-sidebar"
      )}
    >
      <div
        className={classNames(
          "h-navbar flex flex-row items-center  px-4",
          isStaff ? "xl:px-sidebar justify-between" : "justify-end"
        )}
      >
        {isStaff && (
          <h1 className="mr-auto text-main text-[1.2rem] font-semibold">
            Edwin and Lina Poultry Farm
          </h1>
        )}
        {/* NOTIFICATION CONTAINER */}
        {!isStaff && (
          <div className="relative">
            <Button
              type="button"
              value={<NotificationBell />}
              onClick={() => toggleNotification((prev) => !prev)}
              className="p-0 items-center justify-end"
            />
            {notification && <NotificationDropdown />}
          </div>
        )}
        <span className="h-2/3 border-2" />
        {/* USER PANEL CONTAINER */}
        <div className="relative">
          <Button
            type="button"
            value={<UserToggle />}
            onClick={() => toggleUserPanel((prev) => !prev)}
            className="p-2"
          />
          {userPanel && <UserDropdown />}
        </div>
      </div>
    </div>
  );
}
