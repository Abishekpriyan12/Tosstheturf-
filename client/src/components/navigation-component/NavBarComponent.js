import React, { useState } from "react";
import "./NavBarComponent.css";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate instead of useHistory
import ButtonComponent from "../Button-Component/ButtonComponent";

const NavBarComponent = ({ navBarData }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOptionClick = () => {
   
    navigate("/login"); 
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
              <ButtonComponent btnName={"Login"} iconPath={"user.png"} onClick={handleOptionClick}></ButtonComponent>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBarComponent;
