import React from "react";
import "./FooterComponent.css";

const FooterComponent = () => {
  return (
    <div className="footer-component">
      <div className="first-part-icons">
        <div className="image1_footer">
          <img src="ttt_logo.png" alt="ttt_logo"></img>
        </div>
        <div className="footer_Image2">
          <img src="footer_image2.png" alt="ttt_logo"></img>
        </div>
      </div>
      <div className="second-part-icons">
        <div className="nav-link-first">
          <li>Contact Us</li>
          <li>Blog</li>
          <li>Terms And Conditions</li>
          <li>Privacy Policy</li>
        </div>
        <div className="nav-link-second">
          <li>Instagram</li>
          <li>FaceBook</li>
          <li>Twitter</li>
          <li>Linked In</li>
        </div>
      </div>
    </div>
  );
};
export default FooterComponent;
