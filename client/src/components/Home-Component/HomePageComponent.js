import React from "react";
import ButtonComponent from "../Button-Component/ButtonComponent";
import SearchComponent from "../Search-Component/SearchComponent";
import NavBarComponent from "../navigation-component/NavBarComponent";
const HomePageComponent = () => {
  const navBarData = ["About us", "Venue", "Contact Us"];
  return (
    <div className="home-page">
      <NavBarComponent  navBarData={navBarData}></NavBarComponent>
      <div className="home-first-section"></div>
    </div>
  );
};
export default HomePageComponent;
