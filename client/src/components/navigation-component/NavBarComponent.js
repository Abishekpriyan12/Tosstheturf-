import React from "react";
import "./NavBarComponent.css";
import ButtonComponent from "../Button-Component/ButtonComponent";
import { Link } from 'react-router-dom';

const NavBarComponent = ({ navBarData }) => {
  return (
    <div className="Nav-bar">
      <div className="card-container">
        <div className="Logo">
          <img src="ttt_logo.png" alt="logo"></img>
        </div>

        <div id="location-input">
          <img
            src="/assests/icons/user.png"
            alt="location"
            className="location-icon"
          />
          <input
            type="text"
            placeholder="Enter location"
            className="location-textbox"
          />
        </div>

        <div className="nav-links">
          <ul>
            {navBarData.map((res, index) => (
               <li key={index}>
                 <Link to={res.url}>{res.name}</Link>
               </li>
            ))}
            <div id="button-comp">
              <ButtonComponent
                btnName="Login"
                iconPath="User.png"
              />
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBarComponent;
