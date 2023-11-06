import { useFunction } from "../../context/FunctionContext";
import avatar_1 from "../../assets/avatar_1.png";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { format, isToday } from "date-fns";

export default function NotificationDropdown({ toggleNotification }) {
  const { trimString } = useFunction();
  const [notifications, setNotifications] = useState([]);
  const [notificationsRead, setNotificationsRead] = useState([]);

  const { getNotifications, getUser } = useAuth();
  const { capitalize } = useFunction();

  const createNotification = (item, user) => {
    const notificationItem = {
      id: "",
      link: "",
      notification: "",
      hasRead: false,
      datetime: item.log_date,
      user: capitalize(user.first_name) + " " + capitalize(user.last_name),
    };
    switch (Object.keys(item)[0]) {
      case "egg_production_id":
        notificationItem.id = "EP-" + item.egg_production_id;
        notificationItem.link = "/eggs_control_and_monitoring";
        notificationItem.notification =
          " has submitted egg collection for building#" + item.building_id;
        break;
      case "chicken_id":
        notificationItem.id = "CM-" + item.chicken_id;
        notificationItem.link = "/chicken_maintenance/chicken_population";
        notificationItem.notification =
          " has submitted chicken mortality information";
        break;
      case "id":
        if (Object.keys(item).includes("intake")) {
          notificationItem.id = "MI-" + item.id;
          notificationItem.link = "/chicken_maintenance/medication_intake";
          notificationItem.notification =
            " updated the remaining medicine for building#" + item.building_id;
        } else {
          notificationItem.id = "FC-" + item.id;
          notificationItem.link = "/chicken_maintenance/feeds_consumption";
          notificationItem.notification =
            " updated the feeds consumption for building #" + item.building_id;
        }
        break;
      case "segregation_id":
        notificationItem.id = "ES-" + item.segregation_id;
        notificationItem.notification =
          " segregated egg tray batch#" + item.production_id;
    }
    return notificationItem;
  };

  useEffect(() => {
    const setup = async () => {
      const users = await getUser();
      const response = await getNotifications();
      const notification = response.map((res) => {
        return createNotification(
          res,
          users.find(
            (user) =>
              user.user_id == res.user_id || user.user_id == res.staff_id
          )
        );
      });
      if (localStorage.getItem("notifications")) {
        setNotificationsRead(JSON.parse(localStorage.getItem("notifications")));
      }

      setNotifications(notification);
    };
    setup();
   
  }, []);

  return (
    notifications.length > 0 && (
      <div className="absolute top-full right-[-100px] xs:right-0 w-sidebar bg-white rounded-md shadow-md animate-slide-down">
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
                onClick={() => {
                  let readNotifications = [];
                  if (localStorage.getItem("notifications")) {
                    readNotifications = JSON.parse(
                      localStorage.getItem("notifications")
                    );
                  }
                  readNotifications.push(notif);
                  localStorage.setItem(
                    "notifications",
                    JSON.stringify(readNotifications)
                  );
                  window.location.href = notif.link;
                }}
              >
                {!notificationsRead.find(
                  (notification) => notification.id == notif.id
                ) && (
                  <div className="absolute w-2 h-2 rounded-full bg-red-500 top-2 right-2" />
                )}
                <div className="relative w-full pr-2">
                  <p className="text-[.8rem] pb-6 pr-4">
                    <span className="font-semibold">{notif.user}</span>
                    {trimString(notif.notification)}
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
