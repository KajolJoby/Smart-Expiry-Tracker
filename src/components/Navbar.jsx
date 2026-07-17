import "./Navbar.css";
import { FaBell, FaChevronDown } from "react-icons/fa";

function Navbar({ userName }) {
  return (
    <div className="navbar">

      <div></div>

      <div className="nav-right">

        <div className="notification">

          <FaBell />

          <span className="badge">0</span>

        </div>

        <div className="user">

          <span className="username">
            {userName}
          </span>

          <FaChevronDown className="down" />

        </div>

      </div>

    </div>
  );
}

export default Navbar;