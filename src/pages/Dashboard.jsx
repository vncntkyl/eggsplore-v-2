import { useNavigate } from "react-router-dom";
import { Button } from "../components/Forms";
import { useAuth } from "../context/authContext";

export default function Dashboard() {
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    setCurrentUser([]);
    navigate("/login");
  };
  return (
    <div>
      <div>Dashboard</div>
      <div>
        <Button type="button" value="Logout" onClick={handleLogout} />
      </div>
    </div>
  );
}
