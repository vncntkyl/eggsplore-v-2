import { useFunction } from "../../context/FunctionContext";
import avatar_1 from "../../assets/avatar_1.png";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { format, isToday } from "date-fns";

export default function NotificationDropdown() {
  const { trimString } = useFunction();
  const [notifications, setNotifications] = useState([]);

  const { getNotifications, getUser } = useAuth();

  const createNotification = (item, user) => {
    const notificationItem = {
      notification: "",
      hasRead: false,
      datetime: item.log_date,
      user: user.first_name + " " + user.last_name,
    };
    switch (Object.keys(item)[0]) {
      case "egg_production_id":
        notificationItem.notification =
          " has submitted egg collection for Building #" + item.building_id;
        break;
      case "chicken_id":
        notificationItem.notification =
          " has submitted chicken mortality information";
        break;
      case "id":
        if (Object.keys(item).includes("intake")) {
          notificationItem.notification =
            " updated the remaining medicine for building #";
        } else {
          notificationItem.notification =
            " updated the feeds consumption for building #";
        }
        break;
      case "segregation_id":
        notificationItem.notification =
          " segregated batch #  " + item.production_id + " of eggs";
    }
    return notificationItem;
  };

  useEffect(() => {
    const setup = async () => {
      const users = await getUser();
      const response = await getNotifications();
      setNotifications(
        response.map((res) => {
          return createNotification(
            res,
            users.find((user) => user.user_id == res.user_id)
          );
        })
      );
    };
    setup();
    const realtimeData = setInterval(setup, 1000);

    return () => {
      clearInterval(realtimeData);
    };
  }, []);
  return (
    notifications.length > 0 && (
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
                // onClick={() =>
                //   setNotifications((previous) => {
                //     const updatedNotifs = [...previous];
                //     updatedNotifs[index].hasRead = true;
                //     return updatedNotifs;
                //   })
                // }
              >
                <img src={avatar_1} alt="" className="w-1/6" />
                {!notif.hasRead && (
                  <div className="absolute w-2 h-2 rounded-full bg-red-500 top-2 right-2" />
                )}
                <div className="relative w-full pr-2">
                  <p className="text-[.9rem] pb-6">
                    {notif.user + trimString(notif.notification)}
                  </p>
                  <p className="absolute bottom-0 right-0 text-[.8rem]">
                    {isToday(new Date(notif.datetime))
                      ? format(new Date(notif.datetime), "h:mm a")
                      : format(new Date(notif.datetime), "MMM dd | h:mm a")}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    )
  );
}
