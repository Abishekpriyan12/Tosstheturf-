import React from 'react'
import NavBarComponent from '../navigation-component/NavBarComponent';
import FooterComponent from '../footer-component/FooterComponent';
import "./FaqComponent.css";

const FaqComponent = () => {

    const navBarData = [
        { name: "About us", url: "/" },
        { name: "Venue", url: "/" },
        { name: "Contact Us", url: "/contact" },
        { name: "Deals", url: "/" }
      ];

  return (
    <>
        <NavBarComponent navBarData={navBarData} />
        <div className='faq-container'></div>
        <FooterComponent />
    </>
  )
}

export default FaqComponent