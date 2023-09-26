import { Link, Route, Routes } from "react-router-dom";
import { useFunction } from "../../context/FunctionContext";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { GrNext } from "react-icons/gr";
import ChickenPopulation from "./ChickenMaintenance/ChickenPopulation";
import MedicineInventory from "./ChickenMaintenance/MedicineInventory";
import MedicationIntake from "./ChickenMaintenance/MedicationIntake";
import FeedsInventory from "./ChickenMaintenance/FeedsInventory";
import FeedsConsumption from "./ChickenMaintenance/FeedsConsumption";

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
            ? "w-full xl:w-3/4"
            : "w-[0%] overflow-hidden pointer-events-none"
        )}
      >
        <Routes>
          <Route path="/chicken_population/*" element={<ChickenPopulation />} />
          <Route path="/feeds_consumption/*" element={<FeedsConsumption />} />
          <Route path="/feeds_inventory/*" element={<FeedsInventory />} />
          <Route path="/medication_intake/*" element={<MedicationIntake />} />
          <Route
            path="/medication_inventory/*"
            element={<MedicineInventory />}
          />
        </Routes>
      </div>
    </div>
  );
}
