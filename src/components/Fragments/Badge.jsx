/* eslint-disable react/prop-types */
import classNames from "classnames";

export default function Badge({ type = "default", message, className }) {
  return (
    <div
      className={classNames(
        "text-[.7rem] font-semibold uppercase border rounded",
        type === "default" && "border-gray-300 bg-gray-300 text-gray-700",
        type === "warning" &&
          "border-yellow-light bg-yellow-light text-yellow-dark",
        type === "success" &&
          "border-green-light bg-green-light text-green-dark",
        type === "failure" &&
          "border-red-light-1 bg-red-light-1 text-red-dark",
        className
      )}
    >
      {message}
    </div>
  );
}
