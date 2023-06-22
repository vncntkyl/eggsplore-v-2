import { Button } from "../Forms";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { BsFillGearFill } from "react-icons/bs";

export default function UserDropdown() {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const handleLogout = () => {
    sessionStorage.clear();
    setCurrentUser([]);
    navigate("/login");
  };
  return (
    <div className="absolute top-full right-0 min-w-full bg-white rounded-md overflow-hidden shadow-md animate-slide-down p-2">
      <Button
        value="Change Password"
        className="p-1 px-2 hover:bg-default w-full whitespace-nowrap rounded-md"
        icon={<BsFillGearFill className="text-[1.1rem]" />}
      />
      <Button
        type="button"
        value="Logout"
        onClick={handleLogout}
        icon={<RiLogoutBoxRLine className="text-[1.1rem]" />}
        className="p-1 hover:bg-default w-full rounded-md"
      />
    </div>
  );
}
