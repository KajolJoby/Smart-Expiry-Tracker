import { useMemo, useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import DashboardCards from "./components/DashboardCards";
import SearchBar from "./components/SearchBar";
import ProductTable from "./components/ProductTable";
import NotificationPage from "./components/NotificationPage";
import SettingsPage from "./components/SettingsPage";
import ProfilePage from "./components/ProfilePage";
import { createFridgePayload, downloadJsonFile, uploadToFirebase } from "./services/fridgeData";

function App() {
  const [items, setItems] = useState([]);
  const [product, setProduct] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [firebaseUrl, setFirebaseUrl] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [activeView, setActiveView] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [fridgeName, setFridgeName] = useState("My Smart Fridge");

  const addItem = (event) => {
    event.preventDefault();
    if (!product.trim() || !expiryDate) return;

    const newItem = {
      id: Date.now(),
      product: product.trim(),
      expiryDate,
      quantity: Number(quantity) || 1,
      addedAt: new Date().toISOString(),
    };

    setItems((prevItems) => [newItem, ...prevItems]);
    setProduct("");
    setExpiryDate("");
    setQuantity(1);
  };

  const exportToJson = () => {
    const payload = createFridgePayload(items);
    downloadJsonFile(payload, "fridge-data.json");
    setUploadMessage("JSON file downloaded locally. You can upload it to Firebase or use it directly in your ESP8266 flow.");
  };

  const syncToFirebase = async () => {
    try {
      const payload = createFridgePayload(items);
      await uploadToFirebase(payload, firebaseUrl);
      setUploadMessage("Data successfully synced to Firebase.");
    } catch (error) {
      setUploadMessage(error.message);
    }
  };

  const summary = useMemo(() => {
    const totalItems = items.length;
    const soonExpiring = items.filter((item) => {
      if (!item.expiryDate) return false;
      const today = new Date();
      const expiry = new Date(item.expiryDate);
      const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 3;
    }).length;

    return { totalItems, soonExpiring };
  }, [items]);

  const clearFridge = () => {
    setItems([]);
    setUploadMessage("Fridge cleared successfully.");
  };

  const notifications = useMemo(() => {
    const baseNotifications = [
      {
        id: 1,
        type: "info",
        title: "Milk is expiring soon",
        message: "Your milk will expire in 2 days. Consider using it today.",
        detail: "Added 1 item to your reminder list",
      },
      {
        id: 2,
        type: "urgent",
        title: "Spinach needs attention",
        message: "Spinach is close to its expiry date and should be used soon.",
        detail: "Priority reminder from Smart Fridge",
      },
      {
        id: 3,
        type: "expired",
        title: "Yogurt is already expired",
        message: "One yogurt item has passed its expiry date.",
        detail: "Please remove it from the fridge",
      },
    ];

    if (!items.length) return baseNotifications;

    return baseNotifications.map((item) => {
      if (item.title.includes("Milk") && items.some((entry) => entry.product.toLowerCase().includes("milk"))) {
        return { ...item, detail: `${items.filter((entry) => entry.product.toLowerCase().includes("milk")).length} milk item tracked` };
      }
      return item;
    });
  }, [items]);

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <div className="main-content">
        <Navbar
          notificationsCount={notifications.length}
          notifications={notifications}
          onOpenProfile={() => setActiveView("profile")}
          onOpenSettings={() => setActiveView("settings")}
        />

        <div className="content">
          {activeView === "notifications" ? (
            <NotificationPage notifications={notifications} />
          ) : activeView === "items" ? (
            <>
              <h1>My Items</h1>
              <p>Here are your products with expiry and entry dates.</p>
              <ProductTable items={items} />
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
            <ProfilePage fridgeName={fridgeName} darkMode={darkMode} />
          ) : (
            <>
              <h1>Welcome back,</h1>
              <p>Here&apos;s what&apos;s happening in your fridge today!</p>

              <DashboardCards />
              <SearchBar
                product={product}
                setProduct={setProduct}
                expiryDate={expiryDate}
                setExpiryDate={setExpiryDate}
                quantity={quantity}
                setQuantity={setQuantity}
                addItem={addItem}
                exportToJson={exportToJson}
                firebaseUrl={firebaseUrl}
                setFirebaseUrl={setFirebaseUrl}
                syncToFirebase={syncToFirebase}
              />

              {uploadMessage ? <p className="upload-message">{uploadMessage}</p> : null}

              <ProductTable items={items} />

              <div className="summary-card">
                <p>Total items: {summary.totalItems}</p>
                <p>Soon expiring: {summary.soonExpiring}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;