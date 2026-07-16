import "./DashboardCards.css";

function DashboardCards() {
  return (
    <div className="cards">

      <div className="card">
        <h3>Total Items</h3>
        <h1>30</h1>
      </div>

      <div className="card">
        <h3>Expired Soon</h3>
        <h1>4</h1>
      </div>

      <div className="card">
        <h3>Expired Item</h3>
        <h1>2</h1>
      </div>

    </div>
  );
}

export default DashboardCards;