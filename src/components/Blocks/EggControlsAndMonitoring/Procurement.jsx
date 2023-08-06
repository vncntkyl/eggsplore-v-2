import React, { useState } from "react";
import DatePicker from "../../Fragments/DatePicker";

export default function Procurement() {
    const [selectedFilter, selectDateFilter] = useState("all");
    const [modalTitle, setModalTitle] = useState(null);
    const [dateRange, setRange] = useState({ start_date: "", end_date: "" });
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
        </div>
      </div>
    </div>
  );
}
