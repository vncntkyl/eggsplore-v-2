import { Button } from "../Forms";
import dashboard_active from "../../assets/dashboard_active.png";
import dashboard_inactive from "../../assets/dashboard_inactive.png";
import classNames from "classnames";
import { useState } from "react";

export default function Sidebar() {
  const [a, b] = useState(false);
  return (
    <div className="w-sidebar bg-main fixed top-0 left-0 h-screen">
      <div className="h-navbar flex items-center justify-center font-semibold text-white text-[1.25rem] text-center px-2">
        Edwin and Lina Poultry Farm
      </div>
      <div className="w-5/6 mx-auto border-2 border-tertiary" />
      <div className="pl-7 py-2 flex flex-col gap-2">
        <Button
          icon={<img src={a ? dashboard_active : dashboard_inactive} />}
          value="Dashboard"
          onClick={() => b((prev) => !prev)}
          className={classNames(
            "transition-all relative px-2 font-semibold text-[1.1rem]",
            !a
              ? "bg-transparent text-white"
              : "text-main rounded-tl-xl rounded-bl-xl bg-default"
          )}
        />
        <Button
          icon={<img src={dashboard_inactive} />}
          value="Chick Procurement"
          className="bg-transparent px-2 text-white font-semibold text-[1.1rem]"
        />
      </div>
    </div>
  );
}
