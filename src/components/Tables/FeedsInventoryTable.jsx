/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { useFunction } from "../../context/FunctionContext";
import { format } from "date-fns";
import { Button } from "../Forms";
import { HiPencilAlt } from "react-icons/hi";

export default function FeedsInventoryTable({
  refresh,
  filter = "all",
  setModal,
  setFeeds,
}) {
  const { getCurrentUser, getFeeds, getFeedsInventory } = useAuth();
  const { capitalize, toTitle } = useFunction();
  const [feedsInventory, setFeedsInventory] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [feedsList, setFeedsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setup = async () => {
      const user = JSON.parse(getCurrentUser());
      setCurrentUser(user);
      const response = await getFeedsInventory(filter);
      setFeedsInventory(
        response.map((item) => ({
          id: item.id,
          feed_id: item.feed_id,
          quantity: item.quantity,
          amount: item.amount,
          supplier: item.supplier,
          date_received: item.date_received,
          log_date: item.log_date,
        }))
      );
      const feedsList = await getFeeds();
      setFeedsList(feedsList);
      setLoading(false);
    };
    setup();
    const realtimeData = setInterval(setup, 5000);
    return () => {
      clearInterval(realtimeData);
    };
  }, [refresh, filter]);

  return !loading && feedsInventory.length > 0 ? (
    <table className="w-full rounded-md shadow-md overflow-hidden bg-white">
      <thead>
        <tr className="bg-main text-white">
          {Object.keys(feedsInventory[0])
            .filter((k) => k !== "id" && k !== "user_id")
            .map((item, index) => {
              return (
                item !== "log_date" && (
                  <th key={index} className="whitespace-nowrap p-2">
                    {item === "feed_id"
                      ? "Feeds Name"
                      : capitalize(toTitle(item))}
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
        {feedsInventory.map((item, index) => {
          return (
            <tr key={index} align="center" className="hover:bg-default">
              <td className="p-2 whitespace-nowrap">
                {capitalize(
                  feedsList.find((feed) => feed.id == item.feed_id).name
                )}
              </td>
              <td className="p-2">{item.quantity}</td>
              <td className="p-2">
                {Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "PHP",
                }).format(item.amount)}
              </td>
              <td className="p-2">{item.supplier}</td>
              <td className="p-2">
                {format(new Date(item.date_received), "MMM d, yyyy")}
              </td>
              <td align="center" className="p-2">
                <div className="flex items-center justify-center gap-1">
                  <Button
                    onClick={() => {
                      setFeeds({
                        id: item.id,
                        feeds: item.feed_id,
                        quantity: item.quantity,
                        amount: item.amount,
                        supplier: item.supplier,
                        date_received: item.date_received,
                        update: true,
                      });
                      setModal("edit feeds information");
                    }}
                    className="bg-yellow p-1 rounded"
                    value={<HiPencilAlt className="text-white" />}
                  />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  ) : (
    <>No feeds inventory found.</>
  );
}
