import { Route, Routes } from "react-router-dom";
import Breadcrumb from "../Fragments/Breadcrumb";
import GeneralManagement from "./GeneralManagement";

export default function AdminDashboard() {
  return (
    <div className="p-4 body">
      <Breadcrumb />
      <Routes>
        <Route path="/*" element={<>dashboard</>} />
        <Route path="/dashboard/*" element={<>dashboard</>} />
        <Route path="/chick_procurement/*" element={<>chick_procurement</>} />
        <Route path="/chicken_maintenance/*" element={<>chicken_maintenance</>} />
        <Route
          path="/eggs_control_and_monitoring/*"
          element={<>eggs_control_and_monitoring</>}
        />
        <Route
          path="/eggs_delivery_monitoring/*"
          element={<>eggs_delivery_monitoring</>}
        />
        <Route path="/sales/*" element={<>sales</>} />
        <Route path="/financials/*" element={<>financials</>} />
        <Route path="/general_management/*" element={<GeneralManagement />} />
      </Routes>
    </div>
  );
}
