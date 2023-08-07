import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { useFunction } from "../../context/FunctionContext";
import { format } from "date-fns";

export default function EggSegregationTable({ refresh }) {
  const [segregationLogs, setSegregationLogs] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);

  const { retrieveSegregationLogs, getCurrentUser, getBuilding } = useAuth();
  const { capitalize, toTitle } = useFunction();
  useEffect(() => {
    const setup = async () => {
      const logsResponse = await retrieveSegregationLogs(
        JSON.parse(getCurrentUser()).user_id
      );
      console.log(logsResponse);
      setSegregationLogs(logsResponse);
      const buildingsResponse = await getBuilding();
      setBuildings(buildingsResponse);
      setLoading(false);
    };
    setup();
    const realtimeData = setInterval(setup, 1000);

    return () => {
      clearInterval(realtimeData);
    };
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
                  {capitalize(toTitle(segregation))}
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
                {type.production_id}
              </td>
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
                {type.crack}
              </td>
              <td className="p-2" align="center">
                {type.soft_shell}
              </td>
              <td className="p-2" align="center">
                {format(new Date(type.log_date), "MMMM d, yyyy hh:mmaaa")}
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
