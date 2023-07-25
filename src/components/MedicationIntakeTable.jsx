/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { useFunction } from "../context/FunctionContext";
import { format } from "date-fns";

export default function MedicationIntakeTable({ refresh }) {
  const { getMedicationIntake, getBuilding, getMedicine } = useAuth();
  const { capitalize, toTitle } = useFunction();

  const [medicationIntake, setIntakeData] = useState([]);
  const [medicineList, setMedicineList] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const setup = async () => {
      const buildingResponse = await getBuilding();
      setBuildings(buildingResponse);

      const response = await getMedicationIntake();
      setIntakeData(response);

      const medicineResponse = await getMedicine();
      setMedicineList(medicineResponse);

      setLoading(false);
    };
    setup();
    const realtimeData = setInterval(setup, 1000);

    return () => {
      clearInterval(realtimeData);
    };
  }, [refresh]);
  return !loading && medicationIntake.length > 0 ? (
    <table className="w-full rounded-md shadow-md overflow-hidden">
      <thead>
        <tr className="bg-main text-white">
          {Object.keys(medicationIntake[0])
            .filter((k) => k !== "id" && k !== "user_id")
            .map((intake, index) => {
              return <th key={index}>{capitalize(toTitle(intake))}</th>;
            })}
        </tr>
      </thead>
      <tbody>
        {medicationIntake.map((intake, index) => {
          return (
            <tr key={index} align="center">
              <td className="p-2">
                {
                  buildings.find(
                    (building) => building.id == intake.building_id
                  ).number
                }
              </td>
              <td className="p-2">{medicineList.find(medicine => medicine.medicine_id === intake.medicine_id).medicine_name}</td>
              <td className="p-2">
                {format(new Date(intake.date_procured), "MMM d, yyyy")}
              </td>
              <td className="p-2">
                {format(new Date(intake.date_logged), "MMM d, yyyy hh:mmaaa")}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  ) : (
    <>No medication intake information found.</>
  );
}
