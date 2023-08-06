import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";

export default function BuildingDropdown({ current, setCurrent }) {
  const { getBuilding, getCurrentUser } = useAuth();
  const [buildings, setBuildings] = useState([]);
  const userID = JSON.parse(getCurrentUser()).user_id;

  useEffect(() => {
    const setup = async () => {
      const response = await getBuilding("relation");
      setBuildings(response);
    };
    setup();
    const realtimeData = setInterval(setup, 1000);

    return () => {
      clearInterval(realtimeData);
    };
  }, []);
  return (
    <div className="flex flex-row gap-2 items-center">
      <label htmlFor="bldg">{current ? "Selected: " : "Select Building: "}</label>
      <select
      id="bldg"
        onChange={(e) => setCurrent(parseInt(e.target.value))}
        className="bg-main text-white p-1 rounded"
      >
        <option
          value=""
          selected
          disabled
          className="bg-white text-black whitespace-nowrap p-1 hover:bg-default w-full rounded transition-all"
        >
          --Select--
        </option>
        {buildings
          .filter((bldg) => bldg.user_id === userID)
          .map((bldg, index) => {
            return (
              <option
                key={index}
                value={bldg.building_id}
                className="bg-white text-black whitespace-nowrap p-1 hover:bg-default w-full rounded transition-all"
              >
                {"Building " + bldg.number}
              </option>
            );
          })}
      </select>
    </div>
  );
}
