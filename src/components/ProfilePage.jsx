import { FaEnvelope, FaBoxOpen, FaClock, FaExclamationTriangle } from "react-icons/fa";
import "./ProfilePage.css";

function ProfilePage({ fridgeName, darkMode, user, items }) {
  const expiredItems = items.filter((item) => new Date(item.expiryDate) < new Date()).length;
  const soonItems = items.filter((item) => {
    const days = Math.ceil((new Date(item.expiryDate) - new Date()) / 86400000);
    return days >= 0 && days <= 3;
  }).length;
  const initials = (user.displayName || user.email || "U").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className={`profile-page ${darkMode ? "dark" : "light"}`}>
      <div className="profile-card">
        {user.photoURL ? <img className="profile-avatar profile-photo" src={user.photoURL} alt="Profile" referrerPolicy="no-referrer" /> : <div className="profile-avatar">{initials}</div>}
        <div className="profile-info">
          <p className="profile-label">YOUR SMART FRIDGE</p>
          <h2>{user.displayName || "Smart Fridge member"}</h2>
          <p>{fridgeName || "My Smart Fridge"}</p>
          <div className="profile-details">
            <span><FaEnvelope /> {user.email}</span>
          </div>
        </div>
      </div>
      <section className="profile-summary" aria-label="Your fridge summary">
        <article><FaBoxOpen /><span><strong>{items.length}</strong> items tracked</span></article>
        <article><FaClock /><span><strong>{soonItems}</strong> expiring soon</span></article>
        <article className="profile-expired"><FaExclamationTriangle /><span><strong>{expiredItems}</strong> expired items</span></article>
      </section>
      <section className="profile-items">
        <div><p className="profile-label">YOUR INVENTORY</p><h3>Recently added items</h3></div>
        {items.length ? <div className="profile-item-list">{items.slice(0, 5).map((item) => <div key={item.id}><strong>{item.product}</strong><span>{item.quantity} · expires {new Date(item.expiryDate).toLocaleDateString()}</span></div>)}</div> : <p className="profile-empty">No items yet. Add your first product from the dashboard.</p>}
      </section>
    </div>
  );
}

export default ProfilePage;
