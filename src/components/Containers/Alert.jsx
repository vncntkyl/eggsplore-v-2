/* eslint-disable react/prop-types */
import classNames from "classnames";
import {
  BsExclamationOctagonFill,
  BsCheckCircleFill,
  BsQuestionCircleFill,
  BsInfoCircleFill,
} from "react-icons/bs";

export default function Alert({ type = "info", title, message, onClose }) {
  return (
    <>
      <div
        className="fixed top-0 w-screen h-screen flex items-center justify-center bg-[#00000035] z-[21]"
        onClick={onClose}
      ></div>
      <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] rounded-md shadow-sm w-fit overflow-hidden z-[22] animate-modal-slide-down">
        <div
          className={classNames(
            "p-2 flex items-center gap-2",
            type === "question"
              ? "bg-blue-light-1 text-blue-light"
              : type === "warning"
              ? "bg-tertiary text-main"
              : type === "success"
              ? "bg-green-light text-green-dark"
              : "bg-yellow-light text-yellow-dark"
          )}
        >
          {type === "question" ? (
            <BsQuestionCircleFill />
          ) : type === "warning" ? (
            <BsExclamationOctagonFill />
          ) : type === "success" ? (
            <BsCheckCircleFill />
          ) : (
            <BsInfoCircleFill />
          )}
          <span className="font-semibold uppercase text-[.9rem] xl:text-[1rem] tracking-wider mr-auto">
            {title}
          </span>
          <button
            className="font-semibold text-tooltip cursor-pointer"
            onClick={onClose}
          >
            &#10005;
          </button>
        </div>
        <div className="p-2 px-5 text-center bg-white text-[.9rem] xl:text-[1rem]">
          {message}
        </div>
      </div>
    </>
  );
}
