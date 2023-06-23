/* eslint-disable react/prop-types */
import {
  AdminDashboard,
  StaffMenu,
  Navbar,
  Sidebar,
} from "../components/Blocks";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Loader from "../components/Fragments/Loader";

export default function Dashboard() {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getUserType, getCurrentUser } = useAuth();
  const navigate = useNavigate();

  const Body = ({ children }) => {
    return (
      <div
        className={classNames(
          "pt-navbar",
          getUserType() === "admin" ? "pl-sidebar" : "xl:px-sidebar-1/2 2xl:px-sidebar"
        )}
      >
        {children}
      </div>
    );
  };

  useEffect(() => {
    if (!sessionStorage.getItem("currentUser")) {
      navigate("/login");
      return;
    } else {
      setUser(JSON.parse(getCurrentUser()));
      setLoading(false);
    }
  }, [sessionStorage]);

  return !loading ? (
    <div className="min-h-screen bg-default">
      <Navbar isStaff={getUserType() === "staff"} user={user} />
      {getUserType() === "admin" && <Sidebar />}
      {/* dashboard content */}
      <Body>
        {getUserType() === "admin" ? <AdminDashboard /> : <StaffMenu />}
      </Body>
    </div>
  ) : (
    <Loader />
  );
}
