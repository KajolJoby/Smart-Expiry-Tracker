import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import DashboardCards from "./components/DashboardCards";
import SearchBar from "./components/SearchBar";
import ProductTable from "./components/ProductTable";

function App() {
  const [items, setItems] = useState([]);
  return (
    <div className="app">

      <Sidebar />

      <div className="main-content">

        <Navbar />

        <div className="content">

          <h1>Welcome back,</h1>

          <p>Here's what's happening in your fridge today!</p>

          {/* Dashboard Cards */}
          <DashboardCards />
          <SearchBar />

<ProductTable
items={items}
/>

        </div>

      </div>

    </div>
  );
}

export default App;