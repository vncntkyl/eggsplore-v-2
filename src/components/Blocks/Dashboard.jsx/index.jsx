import { useState } from "react";
import { Button } from "../../Forms";
import { AiFillPrinter } from "react-icons/ai";
import { format } from "date-fns";
// import CurrentDateTime from "../../Fragments/CurrentDateTime";
import DashboardCards from "../../Fragments/DashboardCards";
import DashboardGraphs from "../../Fragments/DashboardGraphs";
export default function Dashboard() {
  const [modalTitle, setModalTitle] = useState(null);

  return (
    <>
      <div className="flex flex-row justify-between items-center w-full">
        <p className="font-semibold">
          {/* As of <CurrentDateTime /> */}
          {format(new Date(), "MMMM dd, yyyy")}
        </p>
        <Button
          onClick={() => setModalTitle("create income statement")}
          value={
            <div className="flex items-center gap-1">
              <AiFillPrinter />
              <span>Generate Report</span>
            </div>
          }
          className={
            "bg-main text-white p-1 px-2 rounded-full text-[.9rem] transition-all hover:bg-tertiary hover:text-main"
          }
        />
      </div>
      {/* CARDS */}
      <DashboardCards />
      {/* GRAPHS */}
      <DashboardGraphs />
    </>
  );
}
