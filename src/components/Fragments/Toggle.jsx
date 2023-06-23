import React, { useState } from "react";
import classNames from "classnames";
import { Button } from "../Forms/";
import { useFunction } from "../../context/FunctionContext";

export default function Toggle({ option_1, option_2, setSelection }) {
  const { capitalize } = useFunction();
  const [active, setActive] = useState(option_1);
  return (
    <div
      className={classNames(
        active !== option_1 && "on",
        "toggle flex flex-row gap-2 bg-default w-full p-1 rounded-full relative overflow-hidden z-[4] md:max-w-[200px]"
      )}
    >
      <Button
        value={capitalize(option_1)}
        onClick={() => {
          setSelection(option_1);
          setActive(option_1);
        }}
        important
        className={classNames(
          "toggle_text py-1 px-2 rounded-full text-[.8rem] z-[6] text-center w-1/2 md:text-[.8rem]",
          active === option_1 ? "text-white" : "text-black"
        )}
      />
      <Button
        value={capitalize(option_2)}
        onClick={() => {
          setSelection(option_2);
          setActive(option_2);
        }}
        important
        className={classNames(
          "toggle_text py-1 px-2 rounded-full text-[.8rem] z-[6] w-1/2 text-center md:text-[.8rem]",
          active === option_2 ? "text-white" : "text-black"
        )}
      />
    </div>
  );
}
