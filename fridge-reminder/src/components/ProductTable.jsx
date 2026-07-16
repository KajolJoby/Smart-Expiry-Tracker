import "./ProductTable.css";

function ProductTable() {
  return (
    <div className="table-container">
      <table>

        <thead>
          <tr>
            <th>Product</th>
            <th>Expiry Date</th>
            <th>Days Left</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          <tr>
            <td colSpan="4" className="empty-table">
              No products added yet.
            </td>
          </tr>

        </tbody>

      </table>
    </div>
  );
}

export default ProductTable;