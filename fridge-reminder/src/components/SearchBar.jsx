import "./SearchBar.css";
import { FaSearch } from "react-icons/fa";

function SearchBar({
  product,
  setProduct,
  expiryDate,
  setExpiryDate,
  quantity,
  setQuantity,
  addItem,
}) {
  return (
    <div className="search-container">
      <form className="search-form" onSubmit={addItem}>
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            value={product}
            onChange={(event) => setProduct(event.target.value)}
            placeholder="Product name"
          />
        </div>

        <div className="search-box date-box">
          <input
            type="date"
            value={expiryDate}
            onChange={(event) => setExpiryDate(event.target.value)}
          />
        </div>

        <div className="search-box small-box">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
        </div>

        <button type="submit" className="add-btn">
          + Add Item
        </button>
      </form>
    </div>
  );
}

export default SearchBar;