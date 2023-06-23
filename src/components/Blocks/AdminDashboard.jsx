import { Route, Routes } from "react-router-dom";
import Breadcrumb from "../Fragments/Breadcrumb";
import GeneralManagement from "./GeneralManagement";

export default function AdminDashboard() {
  return (
    <div className="p-4 body flex flex-col gap-2 mx-12">
      <Breadcrumb />
      <Routes>
        <Route path="/*" element={<></>} />
        <Route path="/dashboard/*" element={<></>} />
        <Route path="/chick_procurement/*" element={<></>} />
        <Route path="/chicken_maintenance/*" element={<></>} />
        <Route
          path="/eggs_control_and_monitoring/*"
          element={<></>}
        />
        <Route
          path="/eggs_delivery_monitoring/*"
          element={<></>}
        />
        <Route path="/sales/*" element={<></>} />
        <Route path="/financials/*" element={<></>} />
        <Route path="/general_management/*" element={<GeneralManagement />} />
      </Routes>
    </div>
  );
}
