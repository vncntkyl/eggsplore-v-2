import React, { useState } from "react";
import DatePicker from "../../Fragments/DatePicker";
import { Button } from "../../Forms";
import { AiFillPlusCircle } from "react-icons/ai";
import { format } from "date-fns";
import EggProcurementTable from "../../Tables/EggProcurementTable";

export default function Procurement() {
  const [refresh, setRefresh] = useState(0);
  const [selectedFilter, selectDateFilter] = useState("all");
  const [modalTitle, setModalTitle] = useState(null);
  const [dateRange, setRange] = useState({ start_date: "", end_date: "" });
  const [procurementInformation, setProcurementInformation] = useState({
    date_procured: format(new Date(), "yyyy-MM-dd"),
    egg_type: "Brown Egg",
    quantity: 0,
    supplier: "",
    amount: 0,
    log_date: format(new Date(), "MMMM d, yyyy hh:mmaaa"),
  });
  return (
    <div className="bg-white p-2 rounded-md">
      <span className="font-semibold text-gray-800 text-[1.1rem]">
        Egg Procurement
      </span>
      <div>
        <div className="flex flex-row items-center justify-start p-2 gap-2">
          <p className="whitespace-nowrap">Date Filter: </p>
          <DatePicker
            dateRange={dateRange}
            setModalTitle={setModalTitle}
            selectDateFilter={selectDateFilter}
            selectedFilter={selectedFilter}
            setRange={setRange}
            rangeAndMonthOnly
          />
          <Button
            onClick={() => setModalTitle("add procured egg")}
            value={
              <div className="flex items-center gap-1 px-1">
                <AiFillPlusCircle />
                <span className="whitespace-nowrap">Add Procured Egg</span>
              </div>
            }
            className={
              "bg-main text-white p-1 px-2 rounded-full text-[1rem] transition-all hover:bg-tertiary hover:text-main"
            }
          />
        </div>
        <div className="w-full px-2">
          <div className="max-h-[300px] overflow-hidden rounded-md overflow-y-auto shadow-md">
            <EggProcurementTable
              procurementHeaders={procurementInformation}
              refresh={refresh}
              setModal={setModalTitle}
              setProcurement={setProcurementInformation}
              filter={
                selectedFilter === "range" && dateRange.end_date != ""
                  ? dateRange
                  : selectedFilter
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
