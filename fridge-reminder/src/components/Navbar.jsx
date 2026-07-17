import "./Navbar.css";
import { FaBell, FaChevronDown } from "react-icons/fa";

function Navbar() {
  return (
    <div className="navbar">

      <div></div>

      <div className="nav-right">

        <div className="notification">

          <FaBell />

          <span className="badge">2</span>

        </div>

        <div className="user">

          <span className="username">
            Meenakshi
          </span>

          <FaChevronDown className="down" />

        </div>

      </div>

    </div>
  );
}

export default Navbar;