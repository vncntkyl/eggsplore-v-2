/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useFunction } from "../../context/FunctionContext";
import { useAuth } from "../../context/authContext";
import { format } from "date-fns";
import { Button } from "../Forms";
import { HiPencilAlt } from "react-icons/hi";

export default function EggInventoryTable({
  inventoryHeaders = [],
  setInventory,
  setModal,
  refresh,
  filter = "all",
}) {
  const [inventoryLogs, setInventoryLogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const { capitalize, toTitle } = useFunction();

  const { retrieveEggInventory, retrieveEggSales } = useAuth();
  useEffect(() => {
    const setup = async () => {
      const response = await retrieveEggInventory(filter);
      const salesInfo = await retrieveEggSales();
      setInventoryLogs(
        response.map((item) => {
          const sales = salesInfo.find((sales) => format(new Date(sales.date),"w") == item.week);
          return {
            week: item.week,
            egg_produced: item.total_combined_eggs,
            egg_sold: sales ? sales.sold : 0,
            remaining_eggs: sales
              ? item.total_combined_eggs - sales.sold
              : item.total_combined_eggs,
          };
        })
      );
      setLoading(false);
    };
    setup();
   
  }, [refresh, filter]);

  return !loading && inventoryLogs ? (
    <table className="w-full rounded-md">
      <thead>
        <tr>
          {Object.keys(inventoryHeaders)
            .filter(
              (key) => !["log_date", "update", "egg_inventory_id"].includes(key)
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
        {inventoryLogs.map((item, index) => {
          return (
            <tr key={index}>
              <td className="p-2" align="center">
                {item.week}
              </td>
              <td className="p-2" align="center">
                {capitalize(item.egg_produced)}
              </td>
              <td className="p-2" align="center">
                {item.egg_sold}
              </td>
              <td className="p-2" align="center">
                {item.remaining_eggs}
              </td>
              <td className="p-2" align="center">
                <Button
                  onClick={() => {
                    setInventory({
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
    <>No inventory information found</>
  );
}
