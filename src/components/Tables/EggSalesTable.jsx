import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { useFunction } from "../../context/FunctionContext";
import { Button } from "../Forms";
import { AiOutlineEye } from "react-icons/ai";

export default function EggSalesTable() {
  const [eggSalesData, setEggSalesData] = useState([]);
  const { retrieveEggSales } = useAuth();
  const { capitalize, toTitle } = useFunction();

  useEffect(() => {
    const setup = async () => {
      const response = await retrieveEggSales();
      setEggSalesData(response);
    };
    setup();
    const realtimeData = setInterval(setup, 1000);

    return () => {
      clearInterval(realtimeData);
    };
  }, []);
  return eggSalesData.length > 0 ? (
    <table className="w-full rounded-md">
      <thead>
        <tr>
          {Object.keys(eggSalesData[0]).map((key, index) => {
            return (
              <th key={index} className="p-2 bg-main text-white sticky top-0">
                {key === "sold" ? "Egg Trays Sold" : capitalize(toTitle(key))}
              </th>
            );
          })}
          <th className="p-2 bg-main text-white sticky top-0">Action</th>
        </tr>
      </thead>
      <tbody>
        {eggSalesData.map((data, key) => {
          return (
            <tr key={key}>
              <td align="center" className="p-2">
                {data.week}
              </td>
              <td align="center" className="p-2">
                {data.sold}
              </td>
              <td align="center" className="p-2">
                {Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP",
                }).format(data.profit)}
              </td>
              <td align="center" className="p-2">
                <Button
                  onClick={() => {
                    // setProcurement({
                    //   egg_procurement_id: item.egg_procurement_id,
                    //   date_procured: item.date_procured,
                    //   egg_type: item.egg_type,
                    //   quantity: item.quantity,
                    //   supplier: item.supplier,
                    //   amount: item.amount,
                    //   update: true,
                    // });
                    // setModal("edit egg production");
                  }}
                  className="bg-yellow p-1 rounded"
                  value={<AiOutlineEye className="text-white" />}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  ) : (
    <>No sales information found.</>
  );
}
