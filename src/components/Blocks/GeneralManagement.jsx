import { Link, Route, Routes } from "react-router-dom";
import { useFunction } from "../../context/FunctionContext";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { GrNext } from "react-icons/gr";
import Users from "./GeneralManagement/Users";
import Buildings from "./GeneralManagement/Buildings";
import Feeds from "./GeneralManagement/Feeds";

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
        "p-2 flex flex-row bg-white shadow-md rounded-md",
        getPath() === currentPanel && "gap-2"
      )}
    >
      {/* MANAGEMENT MENU */}
      <div
        className={classNames(
          "flex flex-col bg-white",
          getPath() === currentPanel ? "w-1/4" : "w-full"
        )}
      >
        {[
          "users",
          "buildings",
          "feeds",
          "medications",
          "delivery_locations",
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
                <span>{capitalize(toTitle(link))}</span>
                <GrNext
                  className={classNames(
                    "transition-all",
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
            ? "w-3/4"
            : "w-[0%] overflow-hidden pointer-events-none"
        )}
      >
        <Routes>
          <Route path="/users/*" element={<Users />} />
          <Route path="/buildings/*" element={<Buildings />} />
          <Route path="/feeds/*" element={<Feeds />} />
          <Route path="/medications/*" element={<></>} />
          <Route path="/delivery_locations/*" element={<></>} />
        </Routes>
      </div>
    </div>
  );
}
