import { useEffect, useRef } from "react";

export default function OutsideTrigger({ children, onOutsideClick }) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        onOutsideClick();
        console.log(wrapperRef.current);
        console.log(event.target);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onOutsideClick]);

  return <div ref={wrapperRef}>{children}</div>;
}
