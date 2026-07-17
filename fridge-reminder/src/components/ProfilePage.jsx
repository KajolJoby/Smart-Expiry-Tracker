import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "./ProfilePage.css";

function ProfilePage({ fridgeName, darkMode }) {
  return (
    <div className={`profile-page ${darkMode ? "dark" : "light"}`}>
      <div className="profile-card">
        <div className="profile-avatar">SF</div>
        <div className="profile-info">
          <h2>Meenakshi</h2>
          <p>{fridgeName || "My Smart Fridge"}</p>
          <div className="profile-details">
            <span><FaPhoneAlt /> +91 98765 43210</span>
            <span><FaEnvelope /> meenakshi@email.com</span>
            <span><FaMapMarkerAlt /> Chennai, India</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
