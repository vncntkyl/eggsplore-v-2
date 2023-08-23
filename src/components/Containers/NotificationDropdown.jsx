import { useFunction } from "../../context/FunctionContext";
import { data } from "../../data/NotificationData";
import avatar_1 from "../../assets/avatar_1.png";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";

export default function NotificationDropdown() {
  const { trimString } = useFunction();
  const [notifications, setNotifications] = useState([]);

  const { getNotifications } = useAuth();

  useEffect(() => {
    const setup = async () => {
      const response = await getNotifications();
      setNotifications(
        response.map((res) => {
          return {
            ...res,
            hasRead: false,
          };
        })
      );
    };

    const realtimeData = setInterval(setup, 1000);

    return () => {
      clearInterval(realtimeData);
    };
  }, []);
  return (
    <div className="absolute top-full right-0 w-sidebar bg-white rounded-md shadow-md animate-slide-down">
      <h1 className="font-semibold text-[1.1rem] text-main border-b-2 p-2">
        Notifications
      </h1>
      <ul className=" flex flex-col">
        {notifications.map((notif, index) => {
          return (
            <li
              key={index}
              className={classNames(
                "relative p-1 px-2 flex flex-row gap-2 items-center cursor-pointer hover:bg-default",
                index !== notifications.length - 1 && "border-b-2"
              )}
              onClick={() =>
                setNotifications((previous) => {
                  const updatedNotifs = [...previous];
                  updatedNotifs[index].hasRead = true;
                  return updatedNotifs;
                })
              }
            >
              <img src={avatar_1} alt="" className="w-1/6" />
              {!notif.hasRead && (
                <div className="absolute w-2 h-2 rounded-full bg-red-500 top-2 right-2" />
              )}
              <div className="relative">
                <p className="text-[.9rem]">{trimString(notif.notification)}</p>
                <p className="absolute bottom-0 right-0 text-[.8rem]">
                  {notif.datetime}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
