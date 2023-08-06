/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { useFunction } from "../../context/FunctionContext";
import { format } from "date-fns";
import { Button } from "../Forms";
import { HiPencilAlt } from "react-icons/hi";

export default function ChickenMaintenanceTable({
  refresh,
  filter = "all",
  setModal = null,
  setChicken = null,
}) {
  const { getCurrentUser, retrieveProduction, getBuilding } = useAuth();
  const { capitalize, toTitle } = useFunction();
  const [procurementData, setProcurementData] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const user = JSON.parse(getCurrentUser());
    const setup = async () => {
      const buildingResponse = await getBuilding();
      setBuildings(buildingResponse);
      setCurrentUser(user);

      const response = await retrieveProduction("ep_chicken", filter);
      setProcurementData(
        user.user_type == "admin"
          ? response.map((res) => ({
              id: res.chicken_id,
              user_id: res.staff_id,
              building_id: res.building_id,
              population: res.chicken_count,
              mortality: res.mortality_count,
              missing: res.missing_count,
              remaining: res.remaining,
              remarks: res.remarks,
              date_procured: res.date_procured,
              date_logged: res.log_date,
            }))
          : response
              .filter((data) => data.staff_id === user.user_id)
              .map((res) => ({
                id: res.chicken_id,
                user_id: res.staff_id,
                building_id: res.building_id,
                population: res.chicken_count,
                mortality: res.mortality_count,
                missing: res.missing_count,
                remaining: res.remaining,
                remarks: res.remarks,
                date_procured: res.date_procured,
                date_logged: res.log_date,
              }))
      );
      setLoading(false);
    };
    setup();
    const realtimeData = setInterval(setup, 1000);

    return () => {
      clearInterval(realtimeData);
    };
  }, [refresh, filter]);
  return !loading && procurementData.length > 0 ? (
    <table className="w-full rounded-md shadow-md overflow-hidden bg-white">
      <thead>
        <tr className="bg-main text-white">
          {Object.keys(procurementData[0])
            .filter((k) => k !== "id" && k !== "user_id")
            .map((procurement, index) => {
              return (
                procurement !== "date_logged" && (
                  <th key={index} className="whitespace-nowrap p-2">
                    {procurement === "building_id"
                      ? "Building No."
                      : capitalize(toTitle(procurement))}
                  </th>
                )
              );
            })}
          {currentUser.user_type === "admin" && (
            <th className="whitespace-nowrap p-2">Action</th>
          )}
        </tr>
      </thead>
      <tbody>
        {procurementData.map((procurement, index) => {
          return (
            <tr key={index} align="center" className="hover:bg-default">
              <td className="p-2">
                {
                  buildings.find(
                    (building) => building.id == procurement.building_id
                  ).number
                }
              </td>
              <td className="p-2">{procurement.population}</td>
              <td className="p-2">{procurement.mortality}</td>
              <td className="p-2">{procurement.missing}</td>
              <td className="p-2">{procurement.remaining}</td>
              <td className="p-2">{procurement.remarks || '--'}</td>
              <td className="p-2">
                {format(new Date(procurement.date_procured), "MMM d, yyyy")}
              </td>
              {currentUser.user_type === "admin" && (
                <td align="center" className="p-2">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      onClick={() => {
                        setModal("edit chicken information");
                        setChicken(procurement);
                      }}
                      className="bg-yellow p-1 rounded"
                      value={<HiPencilAlt className="text-white" />}
                    />
                  </div>
                </td>
              )}
              {/* <td className="p-2">
                {format(
                  new Date(procurement.date_logged),
                  "MMM d, yyyy hh:mmaaa"
                )}
              </td> */}
            </tr>
          );
        })}
      </tbody>
    </table>
  ) : (
    <>No chicken information found.</>
  );
}
