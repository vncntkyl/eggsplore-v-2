import classNames from "classnames";

export default function Modal({
  title,
  onClose,
  content,
  headerClassName,
  mainClassName,
}) {
  return (
    <>
      <div
        className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-[#00000000] z-[21]"
        onClick={onClose}
      ></div>
      <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-white rounded-md shadow-lg w-fit overflow-hidden z-[22] animate-modal-slide-down">
        <div
          className={classNames(
            "p-2 flex items-center gap-2 border-b-2",
            headerClassName
          )}
        >
          <span className="font-semibold capitalize text-[.9rem] xl:text-[1rem] mr-auto">
            {title}
          </span>
          <button
            className="font-semibold text-tooltip cursor-pointer"
            onClick={onClose}
          >
            &#10005;
          </button>
        </div>
        <div
          className={classNames(
            "p-4 text-center text-[.9rem] xl:text-[1rem]",
            mainClassName
          )}
        >
          {content}
        </div>
      </div>
    </>
  );
}
