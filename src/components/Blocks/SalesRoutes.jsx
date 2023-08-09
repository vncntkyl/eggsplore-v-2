import { Link, Route, Routes } from "react-router-dom";
import { useFunction } from "../../context/FunctionContext";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { GrNext } from "react-icons/gr";
import SalesInvoice from "./Sales/SalesInvoice";

export default function Sales() {
  const { toTitle, capitalize, getPath } = useFunction();
  const [currentPanel, setCurrentPanel] = useState(null);

  useEffect(() => {
    const panel = localStorage.getItem("sales_panel");

    if (panel) {
      setCurrentPanel(panel);
      if (panel !== getPath()) {
        localStorage.removeItem("sales_panel");
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
        {["egg_sales", "sales_invoice"].map((link, index) => {
          return (
            <Link
              key={index}
              to={`/sales/${link}`}
              onClick={() =>
                localStorage.setItem("sales_panel", `/sales/${link}`)
              }
              className="p-2 group/link"
            >
              <div
                className={classNames(
                  " flex flex-row items-center justify-between rounded w-full transition-all duration-300 p-2",
                  getPath() === "/sales" && "border-b-4",
                  getPath() === `/sales/${link}`
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
                    getPath() === `/sales/${link}`
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
          <Route path="/egg_sales/*" element={<></>} />
          <Route path="/sales_invoice/*" element={<SalesInvoice />} />
        </Routes>
      </div>
    </div>
  );
}
