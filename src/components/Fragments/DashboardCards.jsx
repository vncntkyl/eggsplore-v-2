import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import classNames from "classnames";
import { useFunction } from "../../context/FunctionContext";

export default function DashboardCards() {
  const { getFeedsAndMedicineOverview, retrieveEggOverview } = useAuth();
  const { capitalize, toTitle } = useFunction();
  const [cardInformation, setCardInformation] = useState([]);
  const [eggSummary, setEggSummary] = useState([]);

  useEffect(() => {
    const setup = async () => {
      const feedsMedicine = await getFeedsAndMedicineOverview();
      setCardInformation(feedsMedicine);
      const eggs = await retrieveEggOverview();
      setEggSummary(eggs);
    };
    setup();
    const realtimeData = setInterval(setup, 1000);

    return () => {
      clearInterval(realtimeData);
    };
  }, []);
  return (
    <div className="flex flex-row gap-2">
      {cardInformation.map((card, index) => {
        return (
          <div
            key={index}
            className="bg-white shadow-md rounded-md min-w-[33.333334%] flex flex-col items-center p-4"
          >
            <span className="font-semibold">Building {card.number}</span>
            <div className="flex flex-row justify-between w-full">
              <div className="flex flex-col w-1/2">
                <div className="flex flex-col">
                  <span className="text-[.9rem]">Feeds Consumed</span>
                  <span className="text-[3rem] font-semibold">
                    {card.total_consumed}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[.9rem]">Medicine Intake</span>
                  <span className="text-[3rem] font-semibold">
                    {card.total_intake}
                  </span>
                </div>
              </div>
              <div className="w-1/2">
                <p className="text-[.9rem]">Egg Production</p>
                <div>
                  {eggSummary
                    .filter((egg) => egg.number == card.number)
                    .map((egg, index) => {
                      return (
                        <div
                          key={index}
                          className="flex flex-row justify-between"
                        >
                          <span>{capitalize(egg.first_name)}</span>
                          <span className="text-[1.1rem]">
                            {egg.total_egg_count == 0
                              ? "--"
                              : egg.total_egg_count}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
