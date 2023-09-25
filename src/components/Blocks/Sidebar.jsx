import { Button } from "../Forms";
import {
  egg_active,
  egg_inactive,
  chick_active,
  truck_active,
  truck_inactive,
  chicken_active,
  chick_inactive,
  settings_active,
  dashboard_active,
  chicken_inactive,
  estimate_active,
  settings_inactive,
  estimate_inactive,
  dashboard_inactive,
  total_sales_active,
  total_sales_inactive,
} from "../../assets";
import classNames from "classnames";
import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useFunction } from "../../context/FunctionContext";

export default function Sidebar({ sidebar, toggleSidebar }) {
  const { navigate } = useAuth();
  const { toLink } = useFunction();

  const [sideMenu, setSideMenu] = useState([
    {
      title: "Dashboard",
      icon: {
        active: dashboard_active,
        inactive: dashboard_inactive,
      },
      isActive: false,
    },
    {
      title: "Chick Procurement",
      icon: {
        active: chick_active,
        inactive: chick_inactive,
      },
      isActive: false,
    },
    {
      title: "Chicken Maintenance",
      icon: {
        active: chicken_active,
        inactive: chicken_inactive,
      },
      isActive: false,
    },
    {
      title: "Eggs Control and Monitoring",
      icon: {
        active: egg_active,
        inactive: egg_inactive,
      },
      isActive: false,
    },
    {
      title: "Eggs Delivery Monitoring",
      icon: {
        active: truck_active,
        inactive: truck_inactive,
      },
      isActive: false,
    },
    {
      title: "Sales",
      icon: {
        active: total_sales_active,
        inactive: total_sales_inactive,
      },
      isActive: false,
    },
    {
      title: "Financials",
      icon: {
        active: estimate_active,
        inactive: estimate_inactive,
      },
      isActive: false,
    },
    {
      title: "General Management",
      icon: {
        active: settings_active,
        inactive: settings_inactive,
      },
      isActive: false,
    },
  ]);
  return (
    <div
      className={classNames(
        "transition-all  duration-200 w-sidebar bg-main fixed top-0 left-0 h-screen z-[3]",
        sidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="h-navbar flex items-center justify-center font-semibold text-white text-[1.25rem] text-center px-2">
        Edwin and Lina Poultry Farm
      </div>
      <div className="w-5/6 mx-auto border-2 border-tertiary" />
      <div className="px-4 lg:pr-0 lg:pl-7 py-2 flex flex-col gap-4">
        {sideMenu.map((item, index) => {
          return (
            <Button
              key={index}
              icon={
                <img
                  src={item.isActive ? item.icon.active : item.icon.inactive}
                  className={classNames(
                    "transition-all w-[40px] p-2 rounded-full",
                    !item.isActive ? "bg-main" : "bg-transparent"
                  )}
                />
              }
              value={item.title}
              onClick={() => {
                const tempMenu = sideMenu.map((menu, menuIndex) => {
                  return {
                    ...menu,
                    isActive: menuIndex === index ? true : false,
                  };
                });
                setSideMenu(tempMenu);
                navigate(`/${toLink(item.title)}`);
                toggleSidebar(false);
              }}
              important
              className={classNames(
                " transition-all font-semibold flex flex-row items-center gap-4 rounded-md lg:rounded-tl-full lg:rounded-bl-full p-2 hover:text-main hover:bg-default",
                !item.isActive
                  ? "bg-transparent text-white"
                  : "text-main bg-default"
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
