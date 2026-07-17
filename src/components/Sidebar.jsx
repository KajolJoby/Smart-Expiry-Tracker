import {
  FaHome,
  FaList,
  FaBell,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";
import { auth, signOut } from "../firebase";

import vegetables from "../assets/vegetables.png";
import fridgeLogo from "../assets/fridge.png";

function Sidebar() {
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error("Error signing out: ", err);
      }
    }
  };

  return (

    <div className="sidebar">
      <div className="logo">
    <img src={fridgeLogo} alt="Smart Fridge" className="logo-image" />
    <h2>Smart Fridge</h2>
    </div>
      
      <ul>

        <li>
          <FaHome />
          Dashboard
        </li>

        <li>
          <FaList />
          My Items
        </li>

        <li>
          <FaBell />
          Notification
        </li>

        <li>
          <FaCog />
          Settings
        </li>

        <li onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </li>

      </ul>

      <div className="sidebar-image">
        <img src={vegetables} alt="Vegetables" />
      </div>

    </div>

  );

}

export default Sidebar;