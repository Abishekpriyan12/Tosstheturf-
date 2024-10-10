import React, { useState } from "react";
import "./NavBarComponent.css";
import { Link } from "react-router-dom";

const NavBarComponent = ({ navBarData }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOptionClick = (role) => {
    console.log(`Navigate to login as ${role}`);
  };

  return (
    <div className="Nav-bar">
      <div className="card-container">
        <div className="Logo">
          <img src="ttt_logo.png" alt="logo" />
        </div>
        <div id="location-input" />
        <div className="nav-links">
          <ul>
            {navBarData.map((item) => (
              <li key={item.id}>
                <Link to={item.url}>{item.name}</Link>
              </li>
            ))}
            <div id="button-comp" className="dropdown">
              <button className="dropdown-button" onClick={toggleDropdown}>
                Login
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-item" onClick={() => handleOptionClick("Admin")}>Admin</div>
                  <div className="dropdown-item" onClick={() => handleOptionClick("User")}>User</div>
                  <div className="dropdown-item" onClick={() => handleOptionClick("Owner")}>Owner</div>
                </div>
              )}
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBarComponent;
