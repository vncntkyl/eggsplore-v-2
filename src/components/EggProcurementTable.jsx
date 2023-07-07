import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { useFunction } from "../context/FunctionContext";
import { format } from "date-fns";

export default function EggProcurementTable({ refresh }) {
  const { getCurrentUser, retrieveEggProcurement } = useAuth();
  const { capitalize, toTitle } = useFunction();
  const [procurementData, setProcurementData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const user = JSON.parse(getCurrentUser());
    const setup = async () => {
      const response = await retrieveEggProcurement(
        user.user_type,
        user.user_id
      );
      setProcurementData(
        response.map((res) => {
          return {
            id: res.egg_production_id,
            building_no: res.building_id,
            user_id: res.user_id,
            egg_tray_count: res.egg_count,
            date_procured: res.date_produced,
            date_logged: res.log_date,
          };
        })
      );
      setLoading(false);
    };
    setup();
    const realtimeData = setInterval(setup, 1000);

    return () => {
      clearInterval(realtimeData);
    };
  }, [refresh]);
  return (
    !loading && (
      <table className="w-full rounded-md shadow-md overflow-hidden">
        <thead>
          <tr className="bg-main text-white">
            {Object.keys(procurementData[0])
              .filter((k) => k !== "id" && k !== "user_id")
              .map((procurement, index) => {
                return <th key={index}>{capitalize(toTitle(procurement))}</th>;
              })}
          </tr>
        </thead>
        <tbody>
          {procurementData.map((procurement, index) => {
            return (
              <tr key={index} align="center">
                <td className="p-2">{procurement.building_no}</td>
                <td className="p-2">{procurement.egg_tray_count}</td>
                <td className="p-2">
                  {format(new Date(procurement.date_procured), "MMM d, yyyy")}
                </td>
                <td className="p-2">
                  {format(
                    new Date(procurement.date_logged),
                    "MMM d, yyyy hh:mmaaa"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    )
  );
}
