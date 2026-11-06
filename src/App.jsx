import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import DashboardCards from "./components/DashboardCards";
import SearchBar from "./components/SearchBar";
import ProductTable from "./components/ProductTable";
import NotificationPage from "./components/NotificationPage";
import SettingsPage from "./components/SettingsPage";
import ProfilePage from "./components/ProfilePage";
import { createFridgePayload, downloadJsonFile } from "./services/fridgeData";
import { clearItems, removeItem, saveItem, subscribeToItems } from "./services/fridgeStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import { signOutUser } from "./services/userStore";
import Login from "./pages/Login";

function Dashboard({ user }) {
  const [items, setItems] = useState([]);
  const [product, setProduct] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("smart-fridge-theme") === "dark");
  const [fridgeName, setFridgeName] = useState(() => localStorage.getItem("smart-fridge-name") || "My Smart Fridge");

  useEffect(() => {
    const unsubscribe = subscribeToItems(user.uid, setItems, (error) => setUploadMessage(`Database connection failed: ${error.message}`));
    return unsubscribe;
  }, [user.uid]);

  useEffect(() => {
    localStorage.setItem("smart-fridge-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("smart-fridge-name", fridgeName);
  }, [fridgeName]);

  const addItem = async (event) => {
    event.preventDefault();
    if (!product.trim() || !expiryDate) return;

    const newItem = {
      product: product.trim(),
      expiryDate,
      quantity: Number(quantity) || 1,
    };

    try {
      setIsSaving(true);
      await saveItem(user.uid, newItem);
      setProduct("");
      setExpiryDate("");
      setQuantity(1);
      setUploadMessage("Item saved to your fridge database.");
    } catch (error) {
      setUploadMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const exportToJson = () => {
    const payload = createFridgePayload(items);
    downloadJsonFile(payload, "fridge-data.json");
    setUploadMessage("JSON backup downloaded successfully.");
  };

  const summary = useMemo(() => {
    const getDaysUntilExpiry = (item) => {
      if (!item.expiryDate) return false;
      return Math.ceil((new Date(item.expiryDate) - new Date()) / 86400000);
    };
    const soonExpiring = items.filter((item) => {
      const days = getDaysUntilExpiry(item);
      return days >= 0 && days <= 3;
    }).length;
    const expiredItems = items.filter((item) => getDaysUntilExpiry(item) < 0).length;

    return { totalItems: items.length, soonExpiring, expiredItems };
  }, [items]);

  const clearFridge = async () => {
    try {
      await clearItems(user.uid, items);
      setUploadMessage("Fridge cleared successfully.");
    } catch (error) {
      setUploadMessage(error.message);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await removeItem(user.uid, id);
      setUploadMessage("Item removed from your fridge.");
    } catch (error) {
      setUploadMessage(error.message);
    }
  };

  const notifications = useMemo(() => {
    const today = new Date();
    return items.reduce((alerts, item) => {
      const days = Math.ceil((new Date(item.expiryDate) - today) / 86400000);
      if (Number.isNaN(days) || days > 3) return alerts;
      const type = days < 0 ? "expired" : days <= 1 ? "urgent" : "info";
      const timing = days < 0 ? `expired ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago` : days === 0 ? "expires today" : `expires in ${days} days`;
      alerts.push({
        id: item.id,
        type,
        title: `${item.product} ${timing}`,
        message: `${item.quantity} item${item.quantity === 1 ? "" : "s"} ${days < 0 ? "should be removed" : "need your attention"}.`,
        detail: `Expiry date: ${new Date(item.expiryDate).toLocaleDateString()}`,
      });
      return alerts;
    }, []);
  }, [items]);

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <Sidebar activeView={activeView} setActiveView={setActiveView} onLogout={signOutUser} />

      <div className="main-content">
        <Navbar
          notificationsCount={notifications.length}
          notifications={notifications}
          onOpenProfile={() => setActiveView("profile")}
          onOpenSettings={() => setActiveView("settings")}
          user={user}
          onLogout={signOutUser}
        />

        <div className="content">
          {activeView === "notifications" ? (
            <NotificationPage notifications={notifications} />
          ) : activeView === "items" ? (
            <>
              <h1>My Items</h1>
              <p>Here are your products with expiry and entry dates.</p>
              <ProductTable items={items} onRemoveItem={handleRemoveItem} />
            </>
          ) : activeView === "settings" ? (
            <SettingsPage
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              fridgeName={fridgeName}
              setFridgeName={setFridgeName}
              onClearFridge={clearFridge}
            />
          ) : activeView === "profile" ? (
            <ProfilePage fridgeName={fridgeName} darkMode={darkMode} user={user} items={items} />
          ) : (
            <>
              <h1>Welcome back,</h1>
              <p>Here&apos;s what&apos;s happening in your fridge today!</p>

              <DashboardCards {...summary} />
              <SearchBar
                product={product}
                setProduct={setProduct}
                expiryDate={expiryDate}
                setExpiryDate={setExpiryDate}
                quantity={quantity}
                setQuantity={setQuantity}
                addItem={addItem}
                exportToJson={exportToJson}
                isSaving={isSaving}
              />

              {uploadMessage ? <p className="upload-message">{uploadMessage}</p> : null}

              <ProductTable items={items} onRemoveItem={handleRemoveItem} />

              <div className="summary-card">
                <p>Total items: {summary.totalItems}</p>
                <p>Soon expiring: {summary.soonExpiring}</p>
                <p>Expired: {summary.expiredItems}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  if (user === undefined) return <div className="app-loading">Loading your Smart Fridge...</div>;
  return user ? <Dashboard user={user} /> : <Login />;
}

export default App;
