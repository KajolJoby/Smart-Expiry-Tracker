import "./Navbar.css";
import HeaderDropdown from "./HeaderDropdown";

function Navbar({ notificationsCount, notifications, onOpenProfile, onOpenSettings, user, onLogout }) {
  return (
    <div className="navbar">
      <div></div>

      <div className="nav-right">
        <HeaderDropdown
          notifications={notifications}
          onOpenProfile={onOpenProfile}
          onOpenSettings={onOpenSettings}
          user={user}
          onLogout={onLogout}
        />
        <span className="header-count">{notificationsCount} total alerts</span>
      </div>
    </div>
  );
}

export default Navbar;
