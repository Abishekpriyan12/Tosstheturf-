import React from "react";
import { useLocation } from "react-router-dom";
import NavBarComponent from "../../Reusable-Components/navigation-component/NavBarComponent";
import FooterComponent from "../../Reusable-Components/footer-component/FooterComponent";
import ButtonComponent from "../../Reusable-Components/Button-Component/ButtonComponent";
import CardComponent from "../../Reusable-Components/Card-Component/CardComponent";
import ScrollerComponent from "../../Reusable-Components/Scroller-Component/ScrollerComponent";
import "./BookingConfirmation.css";

const BookingConfirmation = () => {
  // Access the booking details passed from PaymentComponent
  const location = useLocation();
  const bookingDetails = location.state;

  // Placeholder for recommended turfs
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

  if (!bookingDetails) {
    return (
      <div>
        <NavBarComponent />
        <div className="custom-booking-confirmation-container">
          <h2>Booking details not found. Please try again.</h2>
        </div>
        <FooterComponent />
      </div>
    );
  }

  return (
    <>
      <NavBarComponent />
      <div className="custom-booking-confirmation-container">
        <section className="custom-booking-success-section">
          <div className="custom-booking-header-image">
            <img src="./assests/images/golf.jpg" alt="Booking Success" />
            <h1>Your booking has been done successfully!!</h1>
          </div>
        </section>

        {/* Booking Details */}
        <section className="custom-booking-details-wrapper">
          <CardComponent className="custom-booking-card">
            <h3>Booking Details</h3>
            <div className="custom-booking-info">
              <div className="custom-booking-item">
                <img src="./assests/icons/user.png" alt="User Icon" />
                <p className="custom-user-name">{bookingDetails.userName}</p>
              </div>
              <div className="custom-booking-item">
                <img src="./assests/icons/location.png" alt="Location Icon" />
                <p className="custom-location-details">
                  {bookingDetails.location}
                </p>
              </div>
              <div className="custom-booking-item">
                <img src="./assests/icons/soccer.png" alt="Turf Icon" />
                <p className="custom-turf-details">{bookingDetails.turfName}</p>
              </div>
              <div className="custom-booking-item">
                <img src="./assests/icons/calendar.png" alt="Calendar Icon" />
                <p className="custom-date-time">
                  {bookingDetails.date}, {bookingDetails.time.join(", ")}
                </p>
              </div>
              <div className="custom-booking-item">
                <img src="./assests/icons/money.png" alt="Cost Icon" />
                <p className="custom-cost-details">${bookingDetails.price}</p>
              </div>
            </div>
            <div className="custom-button-container">
              <ButtonComponent btnName="Book more Turfs" />
            </div>
          </CardComponent>
        </section>

        {/* Recommendations Scroller */}
        <ScrollerComponent items={items} />

        {/* Footer */}
        <FooterComponent />
      </div>
    </>
  );
};

export default BookingConfirmation;
