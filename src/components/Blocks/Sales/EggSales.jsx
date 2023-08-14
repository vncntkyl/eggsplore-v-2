import React, { useState } from "react";
import DatePicker from "../../Fragments/DatePicker";
import EggSalesTable from "../../Tables/EggSalesTable";

export default function EggSales() {
  const [selectedFilter, selectDateFilter] = useState("all");
  const [modalTitle, setModalTitle] = useState(null);
  const [dateRange, setRange] = useState({ start_date: "", end_date: "" });

  return (
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
      </div>
      <div className="max-h-[300px] overflow-hidden rounded-md overflow-y-auto shadow-md">
        <EggSalesTable />
      </div>
    </div>
  );
}
