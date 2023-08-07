import React, { useState } from "react";
import { useFunction } from "../../context/FunctionContext";

export default function EggProcurementTable({
  procurementHeaders = [],
  setProcurement,
  refresh,
  filter = "all",
}) {
  const [procurementLogs, setProcurementLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { capitalize, toTitle } = useFunction();

  return !loading ? (
    <table className="w-full rounded-md">
      <thead>
        <tr>
          {Object.keys(procurementHeaders).filter(key => key !== "log_date").map((header, key) => {
            return (
              <th key={key} className="p-2 bg-main text-white sticky top-0">
                {capitalize(toTitle(header))}
              </th>
            );
          })}
          <th className="p-2 bg-main text-white sticky top-0">Actions</th>
        </tr>
      </thead>
    </table>
  ) : (
    <>No procurement information found</>
  );
}
