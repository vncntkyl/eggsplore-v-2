/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useFunction } from "../../context/FunctionContext";
import { useAuth } from "../../context/authContext";
import { format } from "date-fns";
import { Button } from "../Forms";
import { HiPencilAlt } from "react-icons/hi";
import Badge from "../Fragments/Badge";
import { AiOutlineEye } from "react-icons/ai";

export default function EggsDeliveryMonitoringTable({
  setDelivery,
  setModal,
  refresh,
  filter = "all",
}) {
  const [deliveryLogs, setDeliveryLogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const { capitalize, toTitle } = useFunction();

  const { retrieveDeliveryInformation } = useAuth();
  useEffect(() => {
    if (filter === "range") return;
    const setup = async () => {
      const response = await retrieveDeliveryInformation(filter);
      setDeliveryLogs(response);
      setLoading(false);
    };
    setup();
    const realtimeData = setInterval(setup, 1000);

    return () => {
      clearInterval(realtimeData);
    };
  }, [refresh, filter]);

  return !loading && deliveryLogs ? (
    <table className="w-full rounded-md">
      <thead>
        <tr>
          {[
            "dispatch_id",
            "location",
            "departure_date",
            "target_arrival",
            "actual_arrival",
            "status",
            "actions",
          ].map((header, key) => {
            return (
              <th key={key} className="p-2 bg-main text-white sticky top-0">
                {capitalize(toTitle(header))}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {deliveryLogs.map((item, index) => {
          return (
            <tr key={index}>
              <td className="p-2" align="center">
                {capitalize(item.dispatch_id)}
              </td>
              <td className="p-2" align="center">
                {item.location}
              </td>
              <td className="p-2" align="center">
                {format(new Date(item.departure_date), "MMM d, yyyy")}
              </td>
              <td className="p-2" align="center">
                {format(new Date(item.target_arrival), "MMM d, yyyy")}
              </td>
              <td className="p-2" align="center">
                <Button
                  type="button"
                  disabled={item.status !== "pending"}
                  onClick={() => {
                    setDelivery(item);
                    setModal("update delivery status");
                  }}
                  className="relative group/status flex w-full items-center justify-center"
                  value={
                    <>
                      <span>
                        {item.actual_arrival
                          ? format(new Date(item.actual_arrival), "MMM d, yyyy")
                          : item.status === "cancelled"
                          ? "N/A"
                          : "---"}
                      </span>
                      {item.status === "pending" && (
                        <div className=" absolute top-0 right-0 p-1 transition-all hidden group-hover/status:block animate-fade">
                          <HiPencilAlt className="text-black" />
                        </div>
                      )}
                    </>
                  }
                />
              </td>
              <td className="p-2" align="center">
                <Badge
                  type={
                    item.status === "delayed"
                      ? "warning"
                      : item.status === "on time"
                      ? "success"
                      : item.status === "cancelled"
                      ? "failure"
                      : "default"
                  }
                  message={item.status}
                />
              </td>
              <td className="p-2" align="center">
                <div className="flex items-center justify-center gap-1">
                  <Button
                    onClick={() => {
                      setDelivery(item);
                      setModal("view delivery information");
                    }}
                    className="bg-yellow p-1 rounded"
                    value={<AiOutlineEye className="text-white" />}
                  />
                  <Button
                    onClick={() => {
                      setDelivery(item);
                      setModal("edit delivery information");
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
    <>No delivery information found</>
  );
}
