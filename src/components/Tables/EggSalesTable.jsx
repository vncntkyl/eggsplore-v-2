import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { useFunction } from "../../context/FunctionContext";
import { Button } from "../Forms";
import { AiOutlineEye } from "react-icons/ai";
import { format } from "date-fns";

export default function EggSalesTable({ setEggSalesInformation, setModal }) {
  const [eggSalesData, setEggSalesData] = useState([]);
  const { retrieveEggSales } = useAuth();
  const { capitalize, toTitle } = useFunction();

  useEffect(() => {
    const setup = async () => {
      const response = await retrieveEggSales();
      setEggSalesData(response);
    };
    setup();
   
  }, []);
  return eggSalesData.length > 0 ? (
    <table className="w-full rounded-md">
      <thead>
        <tr>
          {Object.keys(eggSalesData[0]).map((key, index) => {
            return (
              <th key={index} className="p-2 bg-main text-white whitespace-nowrap sticky top-0">
                {key === "sold" ? "Egg Trays Sold" : key === "date" ? "Week" :capitalize(toTitle(key))}
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
                {format(new Date(data.date),"w")}
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
                    setEggSalesInformation(data);
                    setModal("view egg sales");
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
