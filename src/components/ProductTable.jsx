import { FaEdit, FaTrash } from "react-icons/fa";
import "./ProductTable.css";

function ProductTable({ items = [], onEdit, onDelete }) {
  const getStatusClass = (status) => {
    switch (status) {
      case "Expired":
        return "status-expired";
      case "Expiring Soon":
        return "status-expiring-soon";
      default:
        return "status-safe";
    }
  };

  const formatDaysLeft = (days) => {
    if (days < 0) {
      return `${Math.abs(days)} days ago`;
    } else if (days === 0) {
      return "Today";
    } else if (days === 1) {
      return "Tomorrow";
    } else {
      return `${days} days left`;
    }
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity / Unit</th>
            <th>Expiry Date</th>
            <th>Days Left</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="6" className="empty-table">
                No products found. Add some items to track!
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id}>
                <td className="product-name">{item.name}</td>
                <td className="product-qty">{item.quantity}</td>
                <td>{new Date(item.expiryDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })}</td>
                <td className={item.daysLeft <= 3 ? "urgent-days" : ""}>
                  {formatDaysLeft(item.daysLeft)}
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="actions-cell">
                  <button className="action-btn edit-btn" onClick={() => onEdit(item)} title="Edit Item">
                    <FaEdit />
                  </button>
                  <button className="action-btn delete-btn" onClick={() => onDelete(item.id)} title="Delete Item">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;