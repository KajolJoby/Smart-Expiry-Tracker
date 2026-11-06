import "./DashboardCards.css";

function DashboardCards({ totalItems, soonExpiring, expiredItems }) {
  return (
    <div className="cards">

      <div className="card">
        <h3>Total Items</h3>
        <h1>{totalItems}</h1>
      </div>

      <div className="card">
        <h3>Expired Soon</h3>
        <h1>{soonExpiring}</h1>
      </div>

      <div className="card">
        <h3>Expired Item</h3>
        <h1>{expiredItems}</h1>
      </div>

    </div>
  );
}

export default DashboardCards;
