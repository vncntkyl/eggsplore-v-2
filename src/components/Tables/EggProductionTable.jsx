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
  bldgFilter = -1,
}) {
  const { getCurrentUser, retrieveEggProduction, getBuilding, getUser } =
    useAuth();
  const { capitalize, toTitle } = useFunction();
  const [productionData, setProductionData] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const showFilteredResults = (obj, user, bldgFilter = -1) => {
    if (user.user_type !== "admin") {
      if (bldgFilter !== -1) {
        return obj.filter(
          (items) =>
            items.user_id === user.user_id && items.building_id == bldgFilter
        );
      } else {
        return obj.filter((items) => items.user_id === user.user_id);
      }
    } else {
      return obj;
    }
  };
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
              egg: res.egg_count,
              egg_tray: res.egg_tray_count,
              soft_shell: res.soft_shell_count,
              soft_shell_tray: res.soft_shell_tray_count,
              crack: res.crack_count,
              crack_tray: res.crack_tray_count,
              date_procured: res.date_produced,
            };
          })
        );
      } else {
        setProductionData(
          showFilteredResults(response, user, bldgFilter).map((res) => {
            return {
              id: res.egg_production_id,
              building_id: res.building_id,
              user_id: res.user_id,
              egg: res.egg_count,
              egg_tray: res.egg_tray_count,
              soft_shell: res.soft_shell_count,
              soft_shell_tray: res.soft_shell_tray_count,
              crack: res.crack_count,
              crack_tray: res.crack_tray_count,
              date_procured: res.date_produced,
              date_logged: res.log_date,
            };
          })
        );
      }

      setLoading(false);
    };
    setup();
  }, [refresh, filter, bldgFilter]);
  return !loading && productionData.length > 0 ? (
    <div className="overflow-auto">
      <table className="w-full rounded-md">
        <thead>
          <tr className=" sticky top-0">
            {Object.keys(productionData[0])
              .filter((k) => k !== "id" && k !== "user_id")
              .map((production, index) => {
                return (
                  <th
                    key={index}
                    className="p-2 bg-main text-white sticky top-0"
                  >
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
                <td className="p-2">{production.egg}</td>
                <td className="p-2">{production.egg_tray}</td>
                <td className="p-2">{production.soft_shell}</td>
                <td className="p-2">{production.soft_shell_tray}</td>
                <td className="p-2">{production.crack}</td>
                <td className="p-2">{production.crack_tray}</td>
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
                        users.find(
                          (user) => user.user_id === production.user_id
                        )?users.find(
                          (user) => user.user_id === production.user_id
                        ).first_name : "---"
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
    </div>
  ) : (
    <>No egg production information found.</>
  );
}
