import React from "react";
import NavBarComponent from "../navigation-component/NavBarComponent";
import FooterComponent from "../footer-component/FooterComponent";
import ButtonComponent from "../Button-Component/ButtonComponent";
import CardComponent from "../Card-Component/CardComponent";
import ScrollerComponent from "../Scroller-Component/ScrollerComponent";
import "./BookingConfirmation.css";

const BookingConfirmation = () => {
  const navBarData = [
    { name: "About us", url: "/" },
    { name: "Venue", url: "/" },
    { name: "Contact Us", url: "/contact" },
    { name: "Deals", url: "/" },
  ];

  const bookingDetails = {
    userName: "Aksha Parvadiya",
    location: "Waterloo Athletic, 308 Queen St N, Waterloo ON",
    turf: "5 a side Turf 2",
    dateTime: "September 5, 2024 11:00 AM to 1:00 PM",
    cost: "$50",
  };

  const items = [
    {
      title: "Tri-City Sports Dome",
      location: "Cambridge",
      rating: "4.2",
      price: "$18 / Hr",
      discount: "10% OFF ON FIRST TIME",
      image: "home_Image2.png",
    },
    {
      title: "Preston Indoor Courts",
      location: "Kitchener",
      rating: "4.2",
      price: "$18 / Hr",
      discount: "10% OFF ON FIRST TIME",
      image: "home_Image.png",
    },
    {
      title: "Tiki Pika",
      location: "Cambridge",
      rating: "4.2",
      price: "$18 / Hr",
      discount: "10% OFF ON FIRST TIME",
      image: "home_Image2.png",
    },
    {
      title: "Tiki Pika",
      location: "Cambridge",
      rating: "4.2",
      price: "$18 / Hr",
      discount: "10% OFF ON FIRST TIME",
      image: "home_Image.png",
    },
  ];

  return (
    <div className="booking-confirmation-container">
      <NavBarComponent navBarData={navBarData} />
      <section className="booking-success-section">
        <div className="booking-header-image">
          <img src="./assests/images/golf.jpg" alt="Booking Success" />
          <h1>Your booking has been done successfully!!</h1>
        </div>
      </section>
      <section className="booking-details-section">
        <CardComponent className="booking-details-card">
          <h2>Booking Details</h2>
          <div className="booking-info">
            <div className="booking-form-group">
              <img src="./assests/icons/user.png" alt="User Icon" />
              <p className="booking-user-name">{bookingDetails.userName}</p>
            </div>
            <div className="booking-form-group">
              <img src="./assests/icons/location.png" alt="Location Icon" />
              <p className="booking-location-details">{bookingDetails.location}</p>
            </div>
            <div className="booking-form-group">
              <img src="./assests/icons/soccer.png" alt="Turf Icon" />
              <p className="booking-turf-details">{bookingDetails.turf}</p>
            </div>
            <div className="booking-form-group">
              <img src="./assests/icons/calendar.png" alt="Calendar Icon" />
              <p className="booking-date-time">{bookingDetails.dateTime}</p>
            </div>
            <div className="booking-form-group">
              <img src="./assests/icons/money.png" alt="Cost Icon" />
              <p className="booking-cost-details">{bookingDetails.cost}</p>
            </div>
          </div>
          <ButtonComponent btnName="Book more Turfs" />
        </CardComponent>
      </section>
      <ScrollerComponent items={items}></ScrollerComponent>
      <FooterComponent />
    </div>
  );
};

export default BookingConfirmation;
