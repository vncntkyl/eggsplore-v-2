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
import ChickenPopulation from "./ChickenMaintenance/ChickenPopulation";

export default function ChickenMaintenance() {
  const { toTitle, capitalize, getPath } = useFunction();
  const [currentPanel, setCurrentPanel] = useState(null);

  useEffect(() => {
    const panel = localStorage.getItem("chicken_maintenance_panel");

    if (panel) {
      setCurrentPanel(panel);
      if (panel !== getPath()) {
        localStorage.removeItem("chicken_maintenance_panel");
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
          "chicken_population",
          "feeds_consumption",
          "feeds_inventory",
          "medication_intake",
          "medication_inventory",
        ].map((link, index) => {
          return (
            <Link
              key={index}
              to={`/chicken_maintenance/${link}`}
              onClick={() =>
                localStorage.setItem(
                  "chicken_maintenance_panel",
                  `/chicken_maintenance/${link}`
                )
              }
              className="p-2 group/link"
            >
              <div
                className={classNames(
                  " flex flex-row items-center justify-between rounded w-full transition-all duration-300 p-2",
                  getPath() === "/chicken_maintenance" && "border-b-4",
                  getPath() === `/chicken_maintenance/${link}`
                    ? "bg-tertiary"
                    : "group-hover/link:bg-default"
                )}
              >
                <span>{capitalize(toTitle(link))}</span>
                <GrNext
                  className={classNames(
                    "transition-all ",
                    getPath() === `/chicken_maintenance/${link}`
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
          <Route path="/chicken_population/*" element={<ChickenPopulation />} />
          <Route path="/feeds_consumption/*" element={<></>} />
          <Route path="/feeds_inventory/*" element={<></>} />
          <Route path="/medication_intake/*" element={<></>} />
          <Route path="/medication_inventory/*" element={<></>} />
        </Routes>
      </div>
    </div>
  );
}
