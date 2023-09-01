import { useFunction } from "../../context/FunctionContext";
import avatar_1 from "../../assets/avatar_1.png";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { format, isToday } from "date-fns";

export default function NotificationDropdown({ toggleNotification }) {
  const { trimString } = useFunction();
  const [notifications, setNotifications] = useState([]);

  const { getNotifications, getUser, navigate } = useAuth();
  const { capitalize } = useFunction();

  const createNotification = (response, item, user) => {
    const notificationItem = {
      id: response.indexOf(item),
      link: "",
      notification: "",
      hasRead: false,
      datetime: item.log_date,
      user: capitalize(user.first_name) + " " + capitalize(user.last_name),
    };
    switch (Object.keys(item)[0]) {
      case "egg_production_id":
        notificationItem.link = "/eggs_control_and_monitoring";
        notificationItem.notification =
          " has submitted egg collection for building#" + item.building_id;
        break;
      case "chicken_id":
        notificationItem.link = "/chicken_maintenance/chicken_population";
        notificationItem.notification =
          " has submitted chicken mortality information";
        break;
      case "id":
        if (Object.keys(item).includes("intake")) {
          notificationItem.link = "/chicken_maintenance/medication_intake";
          notificationItem.notification =
            " updated the remaining medicine for building#" + item.building_id;
        } else {
          notificationItem.link = "/chicken_maintenance/feeds_consumption";
          notificationItem.notification =
            " updated the feeds consumption for building #" + item.building_id;
        }
        break;
      case "segregation_id":
        notificationItem.notification =
          " segregated egg tray batch#" + item.production_id;
    }
    return notificationItem;
  };

  const compareObjectArrays = (arr1, arr2) => {
    const differences = [];

    // Create a map of item IDs from arr1 for efficient lookup
    const arr1ItemIds = new Set(arr1.map((item) => item.id));

    for (const item2 of arr2) {
      // Check if item2 is in arr1 by looking up its ID
      if (!arr1ItemIds.has(item2.id)) {
        differences.push({
          action: "Added",
          item: item2,
        });
      } else {
        // Find the corresponding item in arr1
        const item1 = arr1.find((item) => item.id === item2.id);

        if (item1.hasRead !== item2.hasRead) {
          differences.push({
            action: "Modified",
            old: item1,
            new: item2,
          });
        }
      }
    }

    // Check for items in arr1 that are not in arr2
    for (const item1 of arr1) {
      if (!arr2.some((item) => item.id === item1.id)) {
        differences.push({
          action: "Removed",
          item: item1,
        });
      }
    }

    return differences;
  };

  useEffect(() => {
    const setup = async () => {
      const users = await getUser();
      const response = await getNotifications();
      const notification = response.map((res) => {
        return createNotification(
          response,
          res,
          users.find(
            (user) =>
              user.user_id == res.user_id || user.user_id == res.staff_id
          )
        );
      });
      setNotifications(notification);

      const localStorageNotifications = JSON.parse(
        localStorage.getItem("notifications")
      );

      if (!localStorageNotifications) {
        localStorage.setItem("notifications", JSON.stringify(notification));
      }
      const differences = compareObjectArrays(
        localStorageNotifications || [],
        notification
      );

      if (differences.length > 0) {
        const updatedLocalStorageNotifications =
          localStorageNotifications.filter((notif) => notif.hasRead === true);
        for (const newNotif of notification) {
          const existingNotifIndex = updatedLocalStorageNotifications.findIndex(
            (notif) => notif.id === newNotif.id
          );
          if (existingNotifIndex === -1) {
            // If no existing notification with the same 'id' is found, add the new notification
            updatedLocalStorageNotifications.push(newNotif);
          }
        }
        // const mergedNotifications =
        //   updatedLocalStorageNotifications.concat(notification);

        localStorage.setItem(
          "notifications",
          JSON.stringify(updatedLocalStorageNotifications)
        );
      }
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
          {JSON.parse(localStorage.getItem("notifications")).map(
            (notif, index) => {
              return (
                <li
                  key={index}
                  className={classNames(
                    "relative p-1 px-2 flex flex-row gap-2 items-center cursor-pointer hover:bg-default",
                    index !==
                      JSON.parse(localStorage.getItem("notifications")).length -
                        1 && "border-b-2"
                  )}
                  onClick={() => {
                    toggleNotification(false);
                    window.location.href = JSON.parse(
                      localStorage.getItem("notifications")
                    )[index].link;

                    // const existingNotifications = JSON.parse(
                    //   localStorage.getItem("notifications")
                    // );
                    // const updatedNotifs = [...existingNotifications];
                    // updatedNotifs[index].hasRead = true;

                    // // Update the state with the modified notification array
                    // localStorage.setItem(
                    //   "notifications",
                    //   JSON.stringify(updatedNotifs)
                    // );
                    // setNotifications(updatedNotifs); // Assuming you have a state for notifications
                  }}
                >
                  {/* {!notif.hasRead && (
                    <div className="absolute w-2 h-2 rounded-full bg-red-500 top-2 right-2" />
                  )} */}
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
            }
          )}
        </ul>
      </div>
    )
  );
}
