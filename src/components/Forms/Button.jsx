/* eslint-disable react/prop-types */

import classNames from "classnames";

export default function Button({
  value,
  type = "button",
  className,
  disabled,
  onClick,
  icon,
}) {
  return (
    <button
      disabled={disabled}
      type={type}
      className={classNames("flex flex-row items-center gap-2", className)}
      onClick={onClick}
    >
      {icon}
      {value}
    </button>
  );
}
