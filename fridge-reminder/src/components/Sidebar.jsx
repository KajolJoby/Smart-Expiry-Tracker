import {
  FaHome,
  FaList,
  FaBell,
  FaCog,
  FaUser,
  FaSignOutAlt
} from "react-icons/fa";

import vegetables from "../assets/vegetables.png";
import fridgeLogo from "../assets/fridge.png";

function Sidebar({ activeView, setActiveView }) {
  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <FaHome /> },
    { key: "items", label: "My Items", icon: <FaList /> },
    { key: "notifications", label: "Notification", icon: <FaBell /> },
    { key: "settings", label: "Settings", icon: <FaCog /> },
    { key: "profile", label: "Profile", icon: <FaUser /> },
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={fridgeLogo} alt="Smart Fridge" className="logo-image" />
        <h2>Smart Fridge</h2>
      </div>

      <ul>
        {menuItems.map((item) => (
          <li
            key={item.key}
            className={activeView === item.key ? "active" : ""}
            onClick={() => setActiveView(item.key)}
          >
            {item.icon}
            {item.label}
          </li>
        ))}

        <li>
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