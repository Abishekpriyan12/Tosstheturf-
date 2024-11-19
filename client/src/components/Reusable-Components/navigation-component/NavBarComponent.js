import React, { useState, useEffect } from "react";
import "./NavBarComponent.css";
import { Link, useNavigate } from "react-router-dom";
import ButtonComponent from "../Button-Component/ButtonComponent";

const NavBarComponent = ({ navBarData }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status from sessionStorage on initial render
  useEffect(() => {
    const username = sessionStorage.getItem("username");
    setIsLoggedIn(!!username); 
  }, []);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      // Perform logout
      sessionStorage.removeItem("username"); 
      sessionStorage.removeItem("userId"); 
      setIsLoggedIn(false); 
      navigate("/"); 
    } else {
      // Navigate to login
      navigate("/login");
    }
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
              <ButtonComponent
                btnName={isLoggedIn ? "Logout" : "Login"}
                iconPath={isLoggedIn ? "user.png" : "user.png"} 
                onClick={handleAuthClick}
              ></ButtonComponent>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBarComponent;
