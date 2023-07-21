import { Route, Routes } from "react-router-dom";
import Breadcrumb from "../Fragments/Breadcrumb";
import GeneralManagement from "./GeneralManagement";
import ChickProcurement from "./ChickProcurement";
import ChickenMaintenance from "./ChickenMaintenance";

export default function AdminDashboard() {
  return (
    <div className="p-4 body flex flex-col gap-2 mx-12">
      <Breadcrumb />
      <Routes>
        <Route path="/*" element={<></>} />
        <Route path="/dashboard/*" element={<></>} />
        <Route path="/chick_procurement/*" element={<ChickProcurement />} />
        <Route path="/chicken_maintenance/*" element={<ChickenMaintenance />} />
        <Route path="/eggs_control_and_monitoring/*" element={<></>} />
        <Route path="/eggs_delivery_monitoring/*" element={<></>} />
        <Route path="/sales/*" element={<></>} />
        <Route path="/financials/*" element={<></>} />
        <Route path="/general_management/*" element={<GeneralManagement />} />
      </Routes>
    </div>
  );
}
