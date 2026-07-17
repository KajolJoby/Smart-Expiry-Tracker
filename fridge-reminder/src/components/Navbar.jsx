import "./Navbar.css";
import HeaderDropdown from "./HeaderDropdown";

function Navbar({ notificationsCount, notifications, onOpenProfile, onOpenSettings }) {
  return (
    <div className="navbar">
      <div></div>

      <div className="nav-right">
        <HeaderDropdown
          notifications={notifications}
          onOpenProfile={onOpenProfile}
          onOpenSettings={onOpenSettings}
        />
        <span className="header-count">{notificationsCount} total alerts</span>
      </div>
    </div>
  );
}

export default Navbar;