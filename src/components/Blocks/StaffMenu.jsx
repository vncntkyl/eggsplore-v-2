import option_1 from "../../assets/egg_production.png";
import option_2 from "../../assets/chicken_mortality.png";
import option_3 from "../../assets/medicine_remaining.png";
import option_4 from "../../assets/feed_remaining.png";
import option_5 from "../../assets/egg_segregation.png";
import { useState } from "react";
import BuildingDropdown from "../Containers/BuildingDropdown";
import classNames from "classnames";
import { Button } from "../Forms";
export default function StaffMenu() {
  const [activeForm, setActiveForm] = useState(null);
  const [currentBldg, setCurrentBldg] = useState(null);

  const menu = [
    {
      title: "Egg Production",
      helperText: "Manage egg collections.",
      img: option_1,
    },
    {
      title: "Chicken Mortality",
      helperText: "Update chicken conditions.",
      img: option_2,
    },
    {
      title: "Medicine Management",
      helperText: "Manage medicine stock.",
      img: option_3,
    },
    {
      title: "Feeds Management",
      helperText: "Monitor feeds inventory.",
      img: option_4,
    },
    {
      title: "Egg Segregation",
      helperText: "Categorize newly collected eggs.",
      img: option_5,
    },
  ];

  return (
    <div className="p-2 pt-4 body flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-black font-bold text-[1.2rem]">Menu</h1>
        <BuildingDropdown current={currentBldg} setCurrent={setCurrentBldg} />
      </div>
      <div className="flex flex-col lg:flex-row gap-2">
        {menu.map((item, index) => {
          return (
            <Button
              key={index}
              onClick={() => setActiveForm(item.title)}
              important
              className={classNames(
                "flex bg-white text-start shadow-md p-4 w-full border-main select-none cursor-pointer transition-all rounded",
                activeForm ? "flex-row items-center gap-2" : "flex-col",
                activeForm === item.title ? "border-t-8" : "border-b-8"
              )}
              value={
                <>
                  <img
                    src={item.img}
                    className={classNames(
                      "max-w-[100px]",
                      activeForm && "w-[50px]"
                    )}
                  />
                  <p
                    className={classNames(
                      "font-semibold transition-all",
                      activeForm ? "text-[1rem]" : "text-[1.1rem]",
                      activeForm
                        ? activeForm === item.title
                          ? "text-main"
                          : "text-black"
                        : "text-main"
                    )}
                  >
                    {item.title}
                  </p>
                  <p className={activeForm && "hidden"}>{item.helperText}</p>
                </>
              }
            />
          );
        })}
      </div>
      <div
        className={classNames(
          "flex items-center justify-center min-h-[55vh] rounded-md shadow-md",
          !currentBldg || !activeForm ? "bg-default-dark" : "bg-white"
        )}
      >
        {(!currentBldg || !activeForm) && (
          <span className="text-[1.1rem] text-gray-600 font-semibold">
            {!currentBldg && !activeForm
              ? "Please select from the menu and building"
              : !currentBldg
              ? "Please select a building"
              : "Please select from the menu"}
          </span>
        )}
        <div>
          <form action=""></form>
        </div>
      </div>
    </div>
  );
}
