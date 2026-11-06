import { useState } from "react";
import { FaUser, FaSignOutAlt, FaCog, FaLifeRing, FaBell } from "react-icons/fa";
import "./HeaderDropdown.css";

function HeaderDropdown({ notifications, onOpenProfile, onOpenSettings, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  const urgentAlerts = notifications.filter((item) => item.type === "urgent" || item.type === "expired");

  return (
    <div className="header-actions">
      <div className="notification-wrapper">
        <button className="icon-btn" onClick={() => setBellOpen((prev) => !prev)}>
          <FaBell />
          {urgentAlerts.length > 0 ? <span className="badge">{urgentAlerts.length}</span> : null}
        </button>

        {bellOpen ? (
          <div className="dropdown-panel notification-panel">
            <div className="panel-header">
              <h4>Emergency alerts</h4>
            </div>
            {urgentAlerts.length === 0 ? (
              <p className="empty-panel">No urgent expiry alerts right now.</p>
            ) : (
              urgentAlerts.map((item) => (
                <div key={item.id} className={`alert-item ${item.type}`}>
                  <strong>{item.title}</strong>
                  <span>{item.message}</span>
                </div>
              ))
            )}
          </div>
        ) : null}
      </div>

      <div className="profile-wrapper">
        <button className="user-btn" onClick={() => setMenuOpen((prev) => !prev)}>
          {user.photoURL ? <img className="avatar avatar-image" src={user.photoURL} alt="" referrerPolicy="no-referrer" /> : <span className="avatar">{(user.displayName || "U").charAt(0)}</span>}
          <span className="username">{user.displayName || "My profile"}</span>
        </button>

        {menuOpen ? (
          <div className="dropdown-panel profile-panel">
            <button className="menu-item" onClick={() => { setMenuOpen(false); onOpenProfile(); }}>
              <FaUser /> <span>View profile</span>
            </button>
            <button className="menu-item" onClick={() => { setMenuOpen(false); onOpenSettings(); }}>
              <FaCog /> <span>Settings</span>
            </button>
            <button className="menu-item">
              <FaLifeRing /> <span>Help & support</span>
            </button>
            <button className="menu-item danger" onClick={onLogout}>
              <FaSignOutAlt /> <span>Logout</span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default HeaderDropdown;
