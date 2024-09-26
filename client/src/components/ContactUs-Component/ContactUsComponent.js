import React from "react";
import ButtonComponent from "../Button-Component/ButtonComponent";
import NavBarComponent from "../navigation-component/NavBarComponent";
import "./ContactUsComponent.css";
import CardComponent from "../Card-Component/CardComponent";
import FooterComponent from "../footer-component/FooterComponent";

const ContactUsComponent = () => {
  const navBarData = ["About us", "Venue", "Contact Us", "Deals"];
  return (
    <div className="contactuspage-page">
      <NavBarComponent navBarData={navBarData}></NavBarComponent>

      <div className="contact-us-container">
        <div className="contact-us-card">
          <CardComponent>
            <h2>Contact Us</h2>
            <div className="fillup-form">
              <div className="input-row">
                <div className="input-container">
                  <label>First Name</label>
                  <input type="text" placeholder="Enter First Name" />
                </div>
                <div className="input-container">
                  <label>Last Name</label>
                  <input type="text" placeholder="Enter Last Name" />
                </div>
              </div>
              <div className="input-row">
                <div className="input-container">
                  <label>Email</label>
                  <input type="email" placeholder="Enter Email" />
                </div>
              </div>
              <div className="input-row">
                <div className="input-container">
                  <label>Message</label>
                  <textarea placeholder="Enter your message"></textarea>
                </div>
              </div>
              <ButtonComponent btnName={"Send Message"}></ButtonComponent>
            </div>
          </CardComponent>
        </div>
        <div className="contact-info">
          <h3>Mail us at</h3>
          <p>TossTheTurf@gmail.com</p>
          <h3>Call us at</h3>
          <p>(548) 398-0909</p>
        </div>
      </div>

      <FooterComponent></FooterComponent>
    </div>
  );
};

export default ContactUsComponent;
