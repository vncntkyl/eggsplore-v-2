/* eslint-disable react/prop-types */

import classNames from "classnames";

export default function Button({
  value,
  type = "button",
  className,
  disabled,
}) {
  return (
    <button
      disabled={disabled}
      type={type}
      className={classNames("bg-white p-2", className)}
    >
      {value}
    </button>
  );
}
