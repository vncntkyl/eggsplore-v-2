import { Link, Route, Routes } from "react-router-dom";
import { useFunction } from "../../context/FunctionContext";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { GrNext } from "react-icons/gr";
import Users from "./GeneralManagement/Users";
import Buildings from "./GeneralManagement/Buildings";
import Feeds from "./GeneralManagement/Feeds";
import Medicine from "./GeneralManagement/Medicine";
import Locations from "./GeneralManagement/Locations";

export default function GeneralManagement() {
  const { toTitle, capitalize, getPath } = useFunction();
  const [currentPanel, setCurrentPanel] = useState(null);

  useEffect(() => {
    const panel = localStorage.getItem("general_management_panel");

    if (panel) {
      setCurrentPanel(panel);
      if (panel !== getPath()) {
        localStorage.removeItem("general_management_panel");
      }
    }
  }, [getPath]);
  return (
    <div
      className={classNames(
        "p-2 flex flex-col xl:flex-row bg-white shadow-md rounded-md",
        getPath() === currentPanel && "gap-2"
      )}
    >
      {/* MANAGEMENT MENU */}
      <div
        className={classNames(
          "flex bg-white overflow-auto whitespace-nowrap",
          getPath() === currentPanel
            ? "hidden w-full flex-row xl:flex xl:w-1/4 xl:flex-col"
            : "w-full flex-col"
        )}
      >
        {[
          "users",
          "buildings_and_delivery_locations",
          "feeds",
          "medications",
        ].map((link, index) => {
          return (
            <Link
              key={index}
              to={`/general_management/${link}`}
              onClick={() =>
                localStorage.setItem(
                  "general_management_panel",
                  `/general_management/${link}`
                )
              }
              className="p-2 group/link"
            >
              <div
                className={classNames(
                  " flex flex-row items-center justify-between rounded w-full transition-all duration-300 p-2",
                  getPath() === "/general_management" && "border-b-4",
                  getPath() === `/general_management/${link}`
                    ? "bg-tertiary"
                    : "group-hover/link:bg-default"
                )}
              >
                <span>
                  {link !== "buildings"
                    ? capitalize(toTitle(link))
                    : capitalize("buildings and Delivery Locations")}
                </span>
                <GrNext
                  className={classNames(
                    "transition-all ",
                    getPath() === `/general_management/${link}`
                      ? "block"
                      : "animate-slide-right hidden group-hover/link:block"
                  )}
                />
              </div>
            </Link>
          );
        })}
      </div>
      {/* MANAGEMENT PANEL */}
      {getPath() === currentPanel && (
        <div className="bg-default-dark w-[.3rem] rounded-full" />
      )}
      <div
        className={classNames(
          "bg-white animate-fade",
          getPath() === currentPanel
            ? "w-full xl:w-3/4"
            : "w-[0%] overflow-hidden pointer-events-none"
        )}
      >
        <Routes>
          <Route path="/users/*" element={<Users />} />
          <Route
            path="/buildings_and_delivery_locations/*"
            element={
              <>
                <div className="flex flex-col gap-2 ">
                  <Buildings />
                  <Locations />
                </div>
              </>
            }
          />
          <Route path="/feeds/*" element={<Feeds />} />
          <Route path="/medications/*" element={<Medicine />} />
        </Routes>
      </div>
    </div>
  );
}
