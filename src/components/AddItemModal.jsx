import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import "./AddItemModal.css";

function AddItemModal({ isOpen, onClose, editingItem }) {
  const [name, setName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name || "");
      setExpiryDate(editingItem.expiryDate || "");
      setQuantity(editingItem.quantity || "");
    } else {
      setName("");
      setExpiryDate("");
      setQuantity("");
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !expiryDate || !quantity.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to modify items.");
        setLoading(false);
        return;
      }

      if (editingItem) {
        // Update existing item
        const itemRef = doc(db, "items", editingItem.id);
        await updateDoc(itemRef, {
          name: name.trim(),
          expiryDate,
          quantity: quantity.trim(),
          updatedAt: serverTimestamp(),
        });
      } else {
        // Add new item
        await addDoc(collection(db, "items"), {
          name: name.trim(),
          expiryDate,
          quantity: quantity.trim(),
          userId: user.uid,
          createdAt: serverTimestamp(),
        });
      }
      onClose();
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("Failed to save item. Make sure your Firebase Config is correct.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>{editingItem ? "Edit Item" : "Add New Item"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Name</label>
            <input
              type="text"
              placeholder="e.g., Organic Milk, Fresh Spinach"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Quantity / Unit</label>
            <input
              type="text"
              placeholder="e.g., 2 Liters, 500g, 3 packs"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Saving..." : editingItem ? "Update Item" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddItemModal;
