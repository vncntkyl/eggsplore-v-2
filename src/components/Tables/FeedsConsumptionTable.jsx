/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { useFunction } from "../../context/FunctionContext";
import { format } from "date-fns";
import { HiPencilAlt } from "react-icons/hi";
import { Button } from "../Forms";

export default function FeedsConsumptionTable({
  refresh,
  setConsumption,
  setModal,
  setFeedsQuantity,
}) {
  const { getFeedsConsumption, getBuilding, getFeeds } = useAuth();
  const { capitalize, toTitle } = useFunction();

  const [feedsConsumption, setConsumptionData] = useState([]);
  const [user, setUser] = useState([]);
  const [feedsList, setFeedsList] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const setup = async () => {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      setUser(user);
      const response = await getFeedsConsumption("all");
    //   setConsumptionData(
    //     user.user_type === "admin"
    //       ? response.map((res) => ({
    //           id: res.id,
    //           building_id: res.building_id,
    //           medicine_id: res.medicine_id,
    //           intake: res.intake,
    //           disposed: res.disposed,
    //           remaining: res.remaining,
    //           remarks: res.remarks,
    //           date_procured: res.date_procured,
    //           date_logged: res.log_date,
    //         }))
    //       : response
    //           .filter((res) => res.staff_id === user.user_id)
    //           .map((res) => ({
    //             building_id: res.building_id,
    //             medicine_id: res.medicine_id,
    //             intake: res.intake,
    //             disposed: res.disposed,
    //             remaining: res.remaining,
    //             remarks: res.remarks,
    //             date_procured: res.date_procured,
    //             date_logged: res.log_date,
    //           }))
    //   );
      const buildingResponse = await getBuilding();
      setBuildings(buildingResponse);
      const medicineResponse = await getFeeds();
      setFeedsList(medicineResponse);

      setLoading(false);
    };
    setup();
    const realtimeData = setInterval(setup, 1000);

    return () => {
      clearInterval(realtimeData);
    };
  }, [refresh]);
  return !loading && feedsConsumption.length > 0 ? (
    <table className="w-full rounded-md shadow-md overflow-hidden">
      <thead>
        <tr className="bg-main text-white">
          {Object.keys(feedsConsumption[0])
            .filter((k) => k !== "id" && k !== "user_id")
            .map((intake, index) => {
              return user.user_type === "admin" ? (
                intake !== "date_logged" && (
                  <th key={index} className="p-2">
                    {intake === "medicine_id"
                      ? "Medicine"
                      : intake === "building_id"
                      ? "Building"
                      : capitalize(toTitle(intake))}
                  </th>
                )
              ) : (
                <th key={index} className="p-2">
                  {intake === "medicine_id"
                    ? "Medicine"
                    : intake === "building_id"
                    ? "Building"
                    : capitalize(toTitle(intake))}
                </th>
              );
            })}
          {user.user_type === "admin" && <th className="p-2">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {feedsConsumption.map((intake, index) => {
          return (
            <tr key={index} align="center">
              <td className="p-2">
                {
                  buildings.find(
                    (building) => building.id === intake.building_id
                  ).number
                }
              </td>
              <td className="p-2">
                {
                  feedsList.find(
                    (medicine) => medicine.medicine_id === intake.medicine_id
                  ).medicine_name
                }
              </td>
              <td className="p-2">{intake.intake}</td>
              <td className="p-2">{intake.disposed}</td>
              <td className="p-2">{intake.remaining}</td>
              <td className="p-2">{intake.remarks}</td>
              <td className="p-2">
                {format(new Date(intake.date_procured), "MMM d, yyyy")}
              </td>
              {user.user_type !== "admin" && (
                <td className="p-2">
                  {format(
                    new Date(intake.date_logged),
                    "MMMM d, yyyy hh:mmaaa"
                  )}
                </td>
              )}
              {user.user_type === "admin" && (
                <td className="p-2">
                  <Button
                    onClick={() => {
                      setConsumption(intake);
                      setFeedsQuantity(
                        parseInt(intake.intake) +
                          parseInt(intake.disposed) +
                          parseInt(intake.remaining)
                      );
                      setModal("edit medication intake");
                    }}
                    className="bg-yellow p-1 rounded"
                    value={<HiPencilAlt className="text-white" />}
                  />
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  ) : (
    <>No medication intake information found.</>
  );
}
