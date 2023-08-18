import { format } from "date-fns";
import { useEffect, useState } from "react";

export default function CurrentDateTime() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <>{format(currentDateTime, "MMMM dd, yyyy, hh:mm:ss a")}</>;
}
