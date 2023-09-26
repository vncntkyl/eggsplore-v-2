import React, { useState } from "react";
import DatePicker from "../../Fragments/DatePicker";
import EggInventoryTable from "../../Tables/EggInventoryTable";

export default function Inventory() {
  const [selectedFilter, selectDateFilter] = useState("all");
  const [refresh, doRefresh] = useState(0);
  const [modalTitle, setModalTitle] = useState(null);
  const [inventoryItem, setInventoryItem] = useState({
    week: "",
    egg_produced: 0,
    egg_sold: 0,
    remaining_eggs: 0,
  });
  const [dateRange, setRange] = useState({ start_date: "", end_date: "" });

  return (
    <div className="bg-white p-2 rounded-md">
      <span className="font-semibold text-gray-800 text-[1.1rem]">
        Egg Inventory
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
        <div className="w-full px-2">
            <div className="max-h-[300px] overflow-auto rounded-md overflow-y-auto shadow-md">
              <EggInventoryTable
                inventoryHeaders={inventoryItem}
                refresh={refresh}
                setModal={setModalTitle}
                // setProcurement={setProcurementInformation}
                // filter={
                //   selectedFilter === "range" && dateRange.end_date != ""
                //     ? dateRange
                //     : selectedFilter
                // }
              />
            </div>
          </div>
      </div>
    </div>
  );
}
