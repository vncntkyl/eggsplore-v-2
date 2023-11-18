import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Breadcrumb from "../Fragments/Breadcrumb";
import GeneralManagement from "./GeneralManagement";
import ChickProcurement from "./ChickProcurement";
import ChickenMaintenance from "./ChickenMaintenance";
import EggsControlAndMonitoring from "./EggControlsAndMonitoring/Index";
import EggDeliveryMonitoring from "./EggDeliveryMonitoring/";
import Sales from "./SalesRoutes";
import Financials from "./Financials";
import Dashboard from "./Dashboard.jsx";
import { useAuth } from "../../context/authContext.jsx";
import Alert from "../Containers/Alert.jsx";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { getMedicineQuantity, getFeedQuantity, getFeeds, getMedicine } =
    useAuth();
  const [alert, setAlert] = useState(null);
  const [medInventory, setMedInventory] = useState(null);
  const [feedInventory, setFeedInventory] = useState(null);
  useEffect(() => {
    if (window.location.pathname === "/") {
      navigate("/dashboard");
    }
  }, []);
  useEffect(() => {
    const checkInventory = async () => {
      const medicineInventory = await getMedicine();
      const feedsInventory = await getFeeds();
      const medicine = await getMedicineQuantity();
      const feeds = await getFeedQuantity();
      const medicineLowStock = medicine
        .filter((med) => med.remaining_quantity < 15)
        .map((stock) => {
          return {
            ...stock,
            medicine_name: medicineInventory.find(
              (med) => med.medicine_id === stock.medicine_id
            ).medicine_name,
          };
        });
      const feedsLowStock = feeds
        .filter((feed) => feed.remaining_quantity < 15)
        .map((stock) => {
          return {
            ...stock,
            feeds_name: feedsInventory.find((feed) => feed.id === stock.feed_id)
              .name,
          };
        });
      setMedInventory(medicineLowStock);
      setFeedInventory(feedsLowStock);
      if (medicineLowStock.length > 0 || feedsLowStock.length > 0) {
        let timeForAlert = false;
        if (localStorage.getItem("date-checked")) {
          const currentTime = new Date().getTime();
          const lastChecked = localStorage.getItem("date-checked");

          const timeDifference = currentTime - lastChecked;

          if (timeDifference >= 24 * 3600 * 1000) {
            timeForAlert = true;
          }
        } else {
          timeForAlert = true;
        }
        if (timeForAlert) {
          setAlert({
            title: "Inventory Critical Level!",
            message: (
              <div>
                {medicineLowStock.length !== 0 && (
                  <div>
                    Medicine with Critical Stocks
                    <ul>
                      {medicineLowStock.map((stock) => {
                        return (
                          <li key={stock.medicine_id}>
                            <span className="font-bold">
                              {stock.medicine_name}
                            </span>
                            : {stock.remaining_quantity}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {feedsLowStock.length !== 0 && (
                  <div>
                    Feeds with Critical Stocks
                    <ul>
                      {feedsLowStock.map((stock) => {
                        return (
                          <li key={stock.id}>
                            <span className="font-bold capitalize">
                              {stock.feeds_name}
                            </span>
                            : {stock.remaining_quantity}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            ),
          });
        }
      }
    };
    checkInventory();
  }, []);
  return (
    <>
      <div className="p-4 body flex flex-col gap-2 lg:mx-12">
        <Breadcrumb />
        <Routes>
          <Route path="/*" element={<Dashboard />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/chick_procurement/*" element={<ChickProcurement />} />
          <Route
            path="/chicken_maintenance/*"
            element={<ChickenMaintenance />}
          />
          <Route
            path="/eggs_control_and_monitoring/*"
            element={<EggsControlAndMonitoring />}
          />
          <Route
            path="/eggs_delivery_monitoring/*"
            element={<EggDeliveryMonitoring />}
          />
          <Route path="/sales/*" element={<Sales />} />
          <Route path="/financials/*" element={<Financials />} />
          <Route path="/general_management/*" element={<GeneralManagement />} />
        </Routes>
      </div>
      {alert && (
        <Alert
          title={alert.title}
          message={alert.message}
          onClose={() => {
            localStorage.setItem("date-checked", Date.now());
            setAlert(null);
          }}
        />
      )}
    </>
  );
}
