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
  const [sidebar, toggleSidebar] = useState(false);
  const { getUserType, getCurrentUser } = useAuth();
  const navigate = useNavigate();

  const Body = ({ children }) => {
    return (
      <div
        className={classNames(
          "pt-navbar",
          getUserType() === "admin"
            ? sidebar
              ? "pl-0 lg:pl-sidebar"
              : "pl-0 lg:pl-sidebar"
            : "xl:px-sidebar-1/2 2xl:px-sidebar"
        )}
      >
        {children}
      </div>
    );
  };

  useEffect(() => {
    if (!localStorage.getItem("currentUser")) {
      navigate("/login");
      return;
    } else {
      setUser(JSON.parse(getCurrentUser()));
      setLoading(false);
    }
  }, [localStorage]);

  return !loading ? (
    <div className="min-h-screen bg-default">
      <Navbar
        isStaff={getUserType() === "staff"}
        user={user}
        toggleSidebar={toggleSidebar}
      />
      {getUserType() === "admin" && (
        <>
          <Sidebar sidebar={sidebar} toggleSidebar={toggleSidebar} />
          {sidebar && (
            <div
              className="bg-[#0000003b] fixed h-screen w-screen z-[2]"
              onClick={() => toggleSidebar(false)}
            />
          )}
        </>
      )}
      {/* dashboard content */}
      <Body>
        {getUserType() === "admin" ? <AdminDashboard /> : <StaffMenu />}
      </Body>
    </div>
  ) : (
    <Loader />
  );
}
