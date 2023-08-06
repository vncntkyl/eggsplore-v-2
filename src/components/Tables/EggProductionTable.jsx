/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { useFunction } from "../../context/FunctionContext";
import { format } from "date-fns";
import { HiPencilAlt } from "react-icons/hi";
import { Button } from "../Forms";

export default function EggProductionTable({
  refresh,
  filter = "all",
  setModal,
  selectEgg,
}) {
  const { getCurrentUser, retrieveEggProduction, getBuilding, getUser } =
    useAuth();
  const { capitalize, toTitle } = useFunction();
  const [productionData, setProductionData] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(getCurrentUser());
    const setup = async () => {
      const buildingResponse = await getBuilding();
      setBuildings(buildingResponse);
      const userResponse = await getUser();
      setUsers(userResponse);
      const response = await retrieveEggProduction(filter);
      if (user.user_type === "admin") {
        setProductionData(
          response.map((res) => {
            return {
              id: res.egg_production_id,
              building_id: res.building_id,
              user_id: res.user_id,
              egg_tray_count: res.egg_count,
              defect_egg_trays_count: res.defect_count,
              date_procured: res.date_produced,
            };
          })
        );
      } else {
        setProductionData(
          response
            .filter((items) => items.user_id === user.user_id)
            .map((res) => {
              return {
                id: res.egg_production_id,
                building_id: res.building_id,
                user_id: res.user_id,
                egg_tray_count: res.egg_count,
                defect_egg_trays_count: res.defect_count,
                date_procured: res.date_produced,
                date_logged: res.log_date,
              };
            })
        );
      }

      setLoading(false);
    };
    setup();
    const realtimeData = setInterval(setup, 1000);

    return () => {
      clearInterval(realtimeData);
    };
  }, [refresh, filter]);
  return !loading && productionData.length > 0 ? (
    <table className="w-full rounded-md">
      <thead>
        <tr>
          {Object.keys(productionData[0])
            .filter((k) => k !== "id" && k !== "user_id")
            .map((production, index) => {
              return (
                <th key={index} className="p-2 bg-main text-white sticky top-0">
                  {production === "building_id"
                    ? "Building No."
                    : production.includes("count")
                    ? capitalize(
                        production
                          .split("_")
                          .filter((word) => word !== "count")
                          .join(" ")
                      )
                    : capitalize(toTitle(production))}
                </th>
              );
            })}
          {JSON.parse(getCurrentUser()).user_type === "admin" && (
            <>
              <th className="p-2 bg-main text-white sticky top-0">Staff</th>
              <th className="p-2 bg-main text-white sticky top-0">Actions</th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {productionData.map((production, index) => {
          return (
            <tr key={index} align="center">
              <td className="p-2">
                {
                  buildings.find(
                    (building) => building.id == production.building_id
                  ).number
                }
              </td>
              <td className="p-2">{production.egg_tray_count}</td>
              <td className="p-2">{production.defect_egg_trays_count}</td>
              <td className="p-2">
                {format(new Date(production.date_procured), "MMM d, yyyy")}
              </td>
              {JSON.parse(getCurrentUser()).user_type !== "admin" && (
                <td className="p-2">
                  {format(
                    new Date(production.date_logged),
                    "MMMM d, yyyy hh:mmaaa"
                  )}
                </td>
              )}
              {JSON.parse(getCurrentUser()).user_type === "admin" && (
                <>
                  <td className="p-2">
                    {capitalize(
                      users.find((user) => user.user_id === production.user_id)
                        .first_name
                    )}
                  </td>
                  <td className="p-2">
                    <Button
                      onClick={() => {
                        selectEgg({ ...production, update: true });
                        setModal("edit egg production");
                      }}
                      className="bg-yellow p-1 rounded"
                      value={<HiPencilAlt className="text-white" />}
                    />
                  </td>
                </>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  ) : (
    <>No egg production information found.</>
  );
}
