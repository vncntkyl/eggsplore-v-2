import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { useFunction } from "../../context/FunctionContext";
import { format } from "date-fns";

export default function EggSegregationTable() {
  const [segregationLogs, setSegregationLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const { retrieveSegregationLogs, getCurrentUser } = useAuth();
  const { capitalize, toTitle } = useFunction();
  useEffect(() => {
    const setup = async () => {
      const logsResponse = await retrieveSegregationLogs(
        JSON.parse(getCurrentUser()).user_id
      );
      console.log(logsResponse);
      setSegregationLogs(logsResponse);
      setLoading(false);
    };
    setup();
  }, []);
  return !loading && segregationLogs.length !== 0 ? (
    <table className="w-full rounded-md">
      <thead>
        <tr>
          {Object.keys(segregationLogs[0])
            .filter((k) => k !== "segregation_id" && k !== "user_id")
            .map((segregation, index) => {
              return (
                <th key={index} className="p-2 bg-main text-white sticky top-0">
                  {segregation === "production_id"
                    ? "Batch ID"
                    : capitalize(toTitle(segregation))}
                </th>
              );
            })}
        </tr>
      </thead>
      <tbody>
        {segregationLogs.map((type, key) => {
          return (
            <tr key={key}>
              <td className="p-2" align="center">
                {type.no_weight}
              </td>
              <td className="p-2" align="center">
                {type.pewee}
              </td>
              <td className="p-2" align="center">
                {type.pullet}
              </td>
              <td className="p-2" align="center">
                {type.brown}
              </td>
              <td className="p-2" align="center">
                {type.small}
              </td>
              <td className="p-2" align="center">
                {type.medium}
              </td>
              <td className="p-2" align="center">
                {type.large}
              </td>
              <td className="p-2" align="center">
                {type.extra_large}
              </td>
              <td className="p-2" align="center">
                {type.jumbo}
              </td>
              <td className="p-2" align="center">
                {type.no_weight_tray}
              </td>
              <td className="p-2" align="center">
                {type.pewee_tray}
              </td>
              <td className="p-2" align="center">
                {type.pullet_tray}
              </td>
              <td className="p-2" align="center">
                {type.brown_tray}
              </td>
              <td className="p-2" align="center">
                {type.small_tray}
              </td>
              <td className="p-2" align="center">
                {type.medium_tray}
              </td>
              <td className="p-2" align="center">
                {type.large_tray}
              </td>
              <td className="p-2" align="center">
                {type.extra_large_tray}
              </td>
              <td className="p-2" align="center">
                {type.jumbo_tray}
              </td>
              <td className="p-2" align="center">
                {format(new Date(type.log_date), "MMM d, yyyy")}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  ) : (
    <>No egg segregation information found.</>
  );
}
