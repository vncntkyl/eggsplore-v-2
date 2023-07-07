import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { useAuth } from "../../context/authContext";
import { Button } from "../Forms";

export default function BuildingDropdown({ current, setCurrent }) {
  const { getBuilding, getCurrentUser } = useAuth();
  const [buildings, setBuildings] = useState([]);
  const [dropdownShown, toggleDropdown] = useState(false);
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
    <div className="relative">
      <Button
        value={
          <div className="flex items-center gap-1">
            <p>
              {current
                ? "Selected: Building " +
                  buildings.find((bldg) => bldg.building_id === current).number
                : "Select Building"}
            </p>
            <FaCaretDown />
          </div>
        }
        onClick={() => toggleDropdown((prev) => !prev)}
        className="bg-main text-white p-1 px-2 rounded"
      />
      {dropdownShown && (
        <div className="absolute top-full right-0 mt-1 min-w-full bg-white rounded shadow-md animate-slide-down">
          <ul className=" flex flex-col p-2">
            {buildings
              .filter((bldg) => bldg.user_id === userID)
              .map((bldg, index) => {
                return (
                  <li key={index}>
                    <Button
                      value={"Building " + bldg.number}
                      onClick={() => setCurrent(bldg.building_id)}
                      className="whitespace-nowrap p-1 hover:bg-default w-full rounded transition-all"
                    />
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </div>
  );
}
