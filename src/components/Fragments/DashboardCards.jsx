import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";

export default function DashboardCards() {
  const { getFeedsAndMedicineOverview, retrieveEggOverview } = useAuth();
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
    <div className="flex flex-row gap-2 overflow-x-auto snap-x snap-mandatory py-1 scroll-smooth scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-main scrollbar-track-default">
      {cardInformation.map((card, index) => {
        return (
          <div
            key={index}
            className="bg-white shadow-md rounded-md min-w-[33%] flex flex-col items-center p-4 select-none snap-start"
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
                <p>Egg Production</p>
                <div>
                  {eggSummary
                    .filter((egg) => egg.number == card.number)
                    .map((egg, index) => {
                      return (
                        <div
                          key={index}
                          className="flex flex-row justify-between text-[.9rem]"
                        >
                          <span>{egg.batch_id}</span>
                          <span className="text-[1.1rem]">
                            {egg.egg_count == 0 ? "--" : egg.egg_count}
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
