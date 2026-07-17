import "./DashboardCards.css";

function DashboardCards({ items = [] }) {
  const totalItems = items.length;
  const expiredSoon = items.filter(item => item.status === "Expiring Soon").length;
  const expired = items.filter(item => item.status === "Expired").length;

  return (
    <div className="cards">

      <div className="card">
        <h3>Total Items</h3>
        <h1>{totalItems}</h1>
      </div>

      <div className="card expired-soon-card">
        <h3>Expired Soon</h3>
        <h1>{expiredSoon}</h1>
      </div>

      <div className="card expired-card">
        <h3>Expired Item</h3>
        <h1>{expired}</h1>
      </div>

    </div>
  );
}

export default DashboardCards;