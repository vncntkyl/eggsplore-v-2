import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Breadcrumb from "../Fragments/Breadcrumb";
import GeneralManagement from "./GeneralManagement";
import ChickProcurement from "./ChickProcurement";
import ChickenMaintenance from "./ChickenMaintenance";
import EggsControlAndMonitoring from "./EggControlsAndMonitoring/Index";
import Sales from "./SalesRoutes";

export default function AdminDashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    if (window.location.pathname === "/") {
      navigate("/dashboard");
    }
  }, []);
  return (
    <div className="p-4 body flex flex-col gap-2 mx-12">
      <Breadcrumb />
      <Routes>
        <Route path="/*" element={<></>} />
        <Route path="/dashboard/*" element={<></>} />
        <Route path="/chick_procurement/*" element={<ChickProcurement />} />
        <Route path="/chicken_maintenance/*" element={<ChickenMaintenance />} />
        <Route
          path="/eggs_control_and_monitoring/*"
          element={<EggsControlAndMonitoring />}
        />
        <Route path="/eggs_delivery_monitoring/*" element={<></>} />
        <Route path="/sales/*" element={<Sales />} />
        <Route path="/financials/*" element={<></>} />
        <Route path="/general_management/*" element={<GeneralManagement />} />
      </Routes>
    </div>
  );
}
