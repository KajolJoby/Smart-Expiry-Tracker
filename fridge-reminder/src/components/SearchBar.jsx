import "./SearchBar.css";
import { FaSearch } from "react-icons/fa";

function SearchBar() {
  return (
    <div className="search-container">

      <div className="search-box">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search Items..."
        />
      </div>

      <button className="add-btn">
        + Add New Item
      </button>

    </div>
  );
}

export default SearchBar;