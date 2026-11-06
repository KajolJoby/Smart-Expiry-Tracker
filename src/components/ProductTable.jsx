import "./ProductTable.css";

function ProductTable({ items = [], onRemoveItem }) {
  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString();
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Expiry Date</th>
            <th>Entry Date</th>
            <th>Quantity</th>
            {onRemoveItem ? <th aria-label="Actions" /> : null}
          </tr>
        </thead>

        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={onRemoveItem ? "5" : "4"} className="empty-table">
                No products added yet.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id}>
                <td>{item.product}</td>
                <td>{formatDate(item.expiryDate)}</td>
                <td>{formatDate(item.addedAt?.toDate ? item.addedAt.toDate() : item.addedAt)}</td>
                <td>{item.quantity}</td>
                {onRemoveItem ? <td><button className="remove-item" onClick={() => onRemoveItem(item.id)}>Remove</button></td> : null}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
