import { FaBell, FaExclamationTriangle, FaCheckCircle, FaClock } from "react-icons/fa";
import "./NotificationPage.css";

function NotificationPage({ notifications }) {
  const emptyState = notifications.length === 0;

  return (
    <div className="notification-page">
      <div className="notification-header">
        <div>
          <p className="eyebrow">Live updates</p>
          <h2>Notifications</h2>
        </div>
        <div className="notification-badge">
          <FaBell />
          <span>{notifications.length}</span>
        </div>
      </div>

      {emptyState ? (
        <div className="notification-empty">
          <FaCheckCircle className="empty-icon" />
          <h3>Everything looks calm right now</h3>
          <p>Add items to your fridge and the app will start alerting you about expiring products.</p>
        </div>
      ) : (
        <div className="notification-list">
          {notifications.map((item) => (
            <article key={item.id} className={`notification-card ${item.type}`}>
              <div className="notification-icon">
                {item.type === "expired" ? (
                  <FaExclamationTriangle />
                ) : item.type === "urgent" ? (
                  <FaClock />
                ) : (
                  <FaBell />
                )}
              </div>

              <div className="notification-content">
                <h3>{item.title}</h3>
                <p>{item.message}</p>
                <span>{item.detail}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationPage;
