import { useEffect, useState } from "react";
import { useFunction } from "../../context/FunctionContext";
import { Link } from "react-router-dom";
import { GrNext } from "react-icons/gr";
export default function Breadcrumb() {
  const { createBreadCrumb, capitalize, toTitle, getPath } = useFunction();
  const [crumbs, setCrumbs] = useState([]);

  useEffect(() => {
    setCrumbs(createBreadCrumb(getPath()));
  }, []);
  return (
    <div className="flex flex-row items-center gap-1 font-semibold">
      {crumbs.map((crumb, index) => {
        const path = `/${crumbs.slice(0, index + 1).join("/")}`;
        return (
          <div key={index} className="flex flex-row items-center gap-1">
            {index !== crumbs.length - 1 ? (
              <>
                <Link to={path} className="underline text-xs lg:text-[1.075rem] text-black">
                  {capitalize(toTitle(crumb))}
                </Link>
                <GrNext className="text-sm"/>
              </>
            ) : (
              <><span className="text-xs lg:text-[1.25rem] text-main">{capitalize(toTitle(crumb))}</span></>
            )}
          </div>
        );
      })}
    </div>
  );
}
