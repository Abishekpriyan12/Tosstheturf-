import React, { useEffect, useState } from "react";
import ButtonComponent from "../Button-Component/ButtonComponent";
import NavBarComponent from "../navigation-component/NavBarComponent";
import "./ContactUsComponent.css";
import CardComponent from "../Card-Component/CardComponent";
import FooterComponent from "../footer-component/FooterComponent";
import { graphQLCommand } from "../../util";

const ContactUsComponent = () => {
  const [navBarData, setNavBarData] = useState([]);
  const fetchNavBarData = async () => {
    const query = `
      query {
        getNavItems {
          id
          name
          url
        }
      }
    `;
      const data = await graphQLCommand(query);
      setNavBarData(data.getNavItems || []);
  };

  useEffect(() => {
    fetchNavBarData();
  }, []);

  return (
    <div className="contactuspage-page">
      
      <NavBarComponent navBarData={navBarData} />{" "}

      <div className="contact-us-container">
        <div className="contact-us-card">
          <CardComponent>
            <h2>Contact Us</h2>
            <div className="fillup-form">
              <div className="input-row">
                <div className="contactus-input-container">
                  <label>First Name</label>
                  <input class="contact-input" type="text" placeholder="Enter First Name" />
                </div>
                <div className="contactus-input-container">
                  <label>Last Name</label>
                  <input  class="contact-input" type="text" placeholder="Enter Last Name" />
                </div>
              </div>
              <div className="input-row">
                <div className="contactus-input-container">
                  <label>Email</label>
                  <input class="contact-input" type="email" placeholder="Enter Email" />
                </div>
              </div>
              <div className="input-row">
                <div className="contactus-input-container">
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
