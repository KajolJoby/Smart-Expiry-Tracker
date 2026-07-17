import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCards from "../components/DashboardCards";
import SearchBar from "../components/SearchBar";
import ProductTable from "../components/ProductTable";
import AddItemModal from "../components/AddItemModal";
import "../styles/Dashboard.css";

function Dashboard() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [userName, setUserName] = useState("User");

  // Fetch current user and setup dynamic real-time Firestore listener
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName || user.email.split("@")[0]);
      
      const q = query(
        collection(db, "items"), 
        where("userId", "==", user.uid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const itemsList = snapshot.docs.map((doc) => {
          const data = doc.data();
          const daysLeft = calculateDaysLeft(data.expiryDate);
          let status = "Safe";
          if (daysLeft < 0) {
            status = "Expired";
          } else if (daysLeft <= 3) {
            status = "Expiring Soon";
          }

          return {
            id: doc.id,
            ...data,
            daysLeft,
            status,
          };
        });
        
        // Sort items by expiry date (soonest first)
        itemsList.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
        setItems(itemsList);
      }, (error) => {
        console.error("Error fetching items: ", error);
      });

      return () => unsubscribe();
    }
  }, []);

  const calculateDaysLeft = (expiryDateStr) => {
    if (!expiryDateStr) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expiryDateStr);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteDoc(doc(db, "items", itemId));
      } catch (err) {
        console.error("Error deleting document: ", err);
        alert("Failed to delete item.");
      }
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  // Filter items based on search query
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <Navbar userName={userName} />

        <div className="content">
          <h1>Welcome back, {userName}!</h1>
          <p>Here's what's happening in your fridge today!</p>

          <DashboardCards items={items} />

          <SearchBar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            onOpenAdd={handleOpenAddModal} 
          />

          <ProductTable 
            items={filteredItems} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        </div>
      </div>

      <AddItemModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editingItem={editingItem} 
      />
    </div>
  );
}

export default Dashboard;
