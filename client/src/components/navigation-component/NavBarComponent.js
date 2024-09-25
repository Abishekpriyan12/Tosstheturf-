import React from "react";
import "./NavBarComponent.css";
import ButtonComponent from "../Button-Component/ButtonComponent";

const NavBarComponent = ({ navBarData }) => {
  return (
    <div className="Nav-bar">
      <div className="card-container">
        <div className="Logo">
          <img src="ttt_logo.png" alt="logo"></img>
        </div>
        <div className="nav-links">
          <ul>
            {navBarData.map((res, index) => (
              <li key={index}>{res}</li>
            ))}
            <div id="button-comp">
              {" "}
              <ButtonComponent
                btnName="Login"
                iconPath="User.png"
              ></ButtonComponent>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default NavBarComponent;
