import { useState } from "react";
import { FaMoon, FaSun, FaTrashAlt, FaHeadset, FaUserCog, FaBell, FaShieldAlt } from "react-icons/fa";
import "./SettingsPage.css";

function SettingsPage({ darkMode, setDarkMode, fridgeName, setFridgeName, onClearFridge }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearClick = () => {
    setShowConfirm(true);
  };

  const confirmClear = () => {
    onClearFridge();
    setShowConfirm(false);
  };

  return (
    <div className={`settings-page ${darkMode ? "dark" : "light"}`}>
      <div className="settings-header">
        <div>
          <p className="eyebrow">Preferences</p>
          <h2>Settings</h2>
        </div>
      </div>

      <div className="settings-grid">
        <section className="settings-card">
          <div className="settings-card-title">
            <FaMoon />
            <h3>Appearance</h3>
          </div>
          <label className="toggle-row">
            <span>Dark mode</span>
            <button type="button" className={`toggle-switch ${darkMode ? "on" : ""}`} onClick={() => setDarkMode(!darkMode)}>
              <span className="toggle-thumb" />
            </button>
          </label>

          <label className="input-row">
            <span>Fridge name</span>
            <input value={fridgeName} onChange={(e) => setFridgeName(e.target.value)} placeholder="My Smart Fridge" />
          </label>
        </section>

        <section className="settings-card danger-card">
          <div className="settings-card-title">
            <FaTrashAlt />
            <h3>Reset fridge</h3>
          </div>
          <p>Remove everything from your fridge list in one action.</p>
          {!showConfirm ? (
            <button className="danger-btn" onClick={handleClearClick}>Clear Everything</button>
          ) : (
            <div className="confirm-box">
              <p>Are you sure?</p>
              <div className="confirm-actions">
                <button className="danger-btn" onClick={confirmClear}>Yes, clear</button>
                <button className="secondary-btn" onClick={() => setShowConfirm(false)}>Cancel</button>
              </div>
            </div>
          )}
        </section>

        <section className="settings-card">
          <div className="settings-card-title">
            <FaHeadset />
            <h3>Support</h3>
          </div>
          <button className="secondary-btn full">Contact customer care</button>
        </section>

        <section className="settings-card">
          <div className="settings-card-title">
            <FaUserCog />
            <h3>More options</h3>
          </div>
          <div className="option-list">
            <div className="option-item">
              <FaBell /> <span>Smart reminders</span>
            </div>
            <div className="option-item">
              <FaShieldAlt /> <span>Privacy controls</span>
            </div>
            <div className="option-item">
              <FaSun /> <span>Notifications sound</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SettingsPage;
