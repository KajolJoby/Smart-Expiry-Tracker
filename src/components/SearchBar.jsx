import "./SearchBar.css";
import { FaSearch } from "react-icons/fa";

function SearchBar({ searchQuery, setSearchQuery, onOpenAdd }) {
  return (
    <div className="search-container">

      <div className="search-box">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search Items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <button className="add-btn" onClick={onOpenAdd}>
        + Add New Item
      </button>

    </div>
  );
}

export default SearchBar;