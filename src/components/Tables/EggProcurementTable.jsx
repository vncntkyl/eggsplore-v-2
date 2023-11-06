import React, { useEffect, useState } from "react";
import { useFunction } from "../../context/FunctionContext";
import { useAuth } from "../../context/authContext";
import { format } from "date-fns";
import { Button } from "../Forms";
import { HiPencilAlt } from "react-icons/hi";

export default function EggProcurementTable({
  procurementHeaders = [],
  setProcurement,
  setModal,
  refresh,
  filter = "all",
}) {
  const [procurementLogs, setProcurementLogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const { capitalize, toTitle } = useFunction();

  const { retrieveEggProcurement } = useAuth();
  useEffect(() => {
    if (filter === "range") return;
    const setup = async () => {
      const response = await retrieveEggProcurement(filter);
      setProcurementLogs(response);
      setLoading(false);
    };
    setup();
   
  }, [refresh, filter]);

  return !loading && procurementLogs ? (
    <table className="w-full rounded-md">
      <thead>
        <tr>
          {Object.keys(procurementHeaders)
            .filter(
              (key) =>
                !["log_date", "update", "egg_procurement_id"].includes(key)
            )
            .map((header, key) => {
              return (
                <th key={key} className="p-2 bg-main text-white sticky top-0">
                  {capitalize(toTitle(header))}
                </th>
              );
            })}
          <th className="p-2 bg-main text-white sticky top-0">Actions</th>
        </tr>
      </thead>
      <tbody>
        {procurementLogs.map((item, index) => {
          return (
            <tr key={index}>
              <td className="p-2" align="center">
                {format(new Date(item.date_procured), "MMM d, yyyy")}
              </td>
              <td className="p-2" align="center">
                {capitalize(item.egg_type)}
              </td>
              <td className="p-2" align="center">
                {item.quantity}
              </td>
              <td className="p-2" align="center">
                {item.supplier}
              </td>
              <td className="p-2" align="center">
                {item.amount}
              </td>
              <td className="p-2" align="center">
                <Button
                  onClick={() => {
                    setProcurement({
                      egg_procurement_id: item.egg_procurement_id,
                      date_procured: item.date_procured,
                      egg_type: item.egg_type,
                      quantity: item.quantity,
                      supplier: item.supplier,
                      amount: item.amount,
                      update: true,
                    });
                    setModal("edit egg production");
                  }}
                  className="bg-yellow p-1 rounded"
                  value={<HiPencilAlt className="text-white" />}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  ) : (
    <>No procurement information found</>
  );
}
