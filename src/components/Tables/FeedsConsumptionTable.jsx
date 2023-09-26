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
  bldgFilter = -1,
}) {
  const { getFeedsConsumption, getBuilding, getFeeds } = useAuth();
  const { capitalize, toTitle } = useFunction();

  const [feedsConsumption, setConsumptionData] = useState([]);
  const [user, setUser] = useState([]);
  const [feedsList, setFeedsList] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);

  const showFilteredResults = (obj, user, bldgFilter = -1) => {
    if (user.user_type !== "admin") {
      if (bldgFilter !== -1) {
        return obj.filter(
          (items) =>
            items.staff_id === user.user_id && items.building_id == bldgFilter
        );
      } else {
        return obj.filter((items) => items.staff_id === user.user_id);
      }
    } else {
      return obj;
    }
  };
  useEffect(() => {
    const setup = async () => {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      setUser(user);
      const response = await getFeedsConsumption("all");
      setConsumptionData(
        user.user_type === "admin"
          ? response.map((res) => ({
              id: res.id,
              building_id: res.building_id,
              feed_id: res.feed_id,
              consumed: res.consumed,
              disposed: res.disposed,
              remaining: res.remaining,
              remarks: res.remarks,
              date_procured: res.date_procured,
              date_logged: res.log_date,
            }))
          : showFilteredResults(response, user, bldgFilter).map((res) => ({
              id: res.id,
              building_id: res.building_id,
              feed_id: res.feed_id,
              consumed: res.consumed,
              disposed: res.disposed,
              remaining: res.remaining,
              remarks: res.remarks,
              date_procured: res.date_procured,
              date_logged: res.log_date,
            }))
      );
      const buildingResponse = await getBuilding();
      setBuildings(buildingResponse);
      const feedResponse = await getFeeds();
      console.log(showFilteredResults(response, user, bldgFilter));
      setFeedsList(feedResponse);

      setLoading(false);
    };
    setup();
    const realtimeData = setInterval(setup, 5000);

    return () => {
      clearInterval(realtimeData);
    };
  }, [refresh, bldgFilter]);
  return !loading && feedsConsumption.length > 0 ? (
    <table className="w-full rounded-md shadow-md overflow-hidden">
      <thead>
        <tr className="bg-main text-white">
          {Object.keys(feedsConsumption[0])
            .filter((k) => k !== "id" && k !== "user_id")
            .map((consumed, index) => {
              return user.user_type === "admin" ? (
                consumed !== "date_logged" && (
                  <th key={index} className="p-2">
                    {consumed === "feed_id"
                      ? "Feeds"
                      : consumed === "building_id"
                      ? "Building"
                      : capitalize(toTitle(consumed))}
                  </th>
                )
              ) : (
                <th key={index} className="p-2">
                  {consumed === "feed_id"
                    ? "Feeds"
                    : consumed === "building_id"
                    ? "Building"
                    : capitalize(toTitle(consumed))}
                </th>
              );
            })}
          {user.user_type === "admin" && <th className="p-2">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {feedsConsumption.map((consumed, index) => {
          return (
            <tr key={index} align="center">
              <td className="p-2">
                {
                  buildings.find(
                    (building) => building.id === consumed.building_id
                  ).number
                }
              </td>
              <td className="p-2">
                {capitalize(
                  feedsList.find((feeds) => feeds.id === consumed.feed_id).name
                )}
              </td>
              <td className="p-2">{consumed.consumed}</td>
              <td className="p-2">{consumed.disposed}</td>
              <td className="p-2">{consumed.remaining}</td>
              <td className="p-2">{consumed.remarks}</td>
              <td className="p-2">
                {format(new Date(consumed.date_procured), "MMM d, yyyy")}
              </td>
              {user.user_type !== "admin" && (
                <td className="p-2">
                  {format(
                    new Date(consumed.date_logged),
                    "MMMM d, yyyy hh:mmaaa"
                  )}
                </td>
              )}
              {user.user_type === "admin" && (
                <td className="p-2">
                  <Button
                    onClick={() => {
                      setConsumption(consumed);
                      setFeedsQuantity(
                        parseInt(consumed.consumed) +
                          parseInt(consumed.disposed) +
                          parseInt(consumed.remaining)
                      );
                      setModal("edit medication consumed");
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
    <>No feeds consumption information found.</>
  );
}
