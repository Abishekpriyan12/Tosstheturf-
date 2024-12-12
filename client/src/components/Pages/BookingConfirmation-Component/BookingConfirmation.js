import React from "react";
import { useLocation,useNavigate} from "react-router-dom";
import NavBarComponent from "../../Reusable-Components/navigation-component/NavBarComponent";
import FooterComponent from "../../Reusable-Components/footer-component/FooterComponent";
import ButtonComponent from "../../Reusable-Components/Button-Component/ButtonComponent";
import CardComponent from "../../Reusable-Components/Card-Component/CardComponent";
import ScrollerComponent from "../../Reusable-Components/Scroller-Component/ScrollerComponent";
import "./BookingConfirmation.css";
import turfimg from "../../../assests/icons/field.png"
import cashimg from "../../../assests/icons/cash.png"
import calendar from "../../../assests/icons/calendar.png"







const BookingConfirmation = () => {
  // Access the booking details passed from PaymentComponent
  const location = useLocation();
  const bookingDetails = location.state;
  console.log("bookingstate",bookingDetails)
  const userId = sessionStorage.getItem("userId");
  const navigate = useNavigate();




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
        
            <h1>Your booking has been done successfully!!</h1>
          </div>
        </section>

        {/* Booking Details */}
        <section className="custom-booking-details-wrapper">
          <CardComponent className="custom-booking-card" width={'40%'}>
            <h3>Booking Details</h3>
            <div className="custom-booking-info">
              <div className="custom-booking-item">
                <img src="./assests/icons/user.png" alt="User Icon" />
                <p className="custom-user-name">{userId}</p>
              </div>
            
              <div className="custom-booking-item">
                <img src={turfimg} alt="Turf Icon" />
                <p className="custom-turf-details">{bookingDetails.turfName}</p>
              </div>
              <div className="custom-booking-item">
                <img src={calendar} alt="Calendar Icon" />
                <p className="custom-date-time">
                  {bookingDetails.date}, {bookingDetails.time.join(", ")}
                </p>
              </div>
              <div className="custom-booking-item">
                <img src={cashimg} alt="Cost Icon" />
                <p className="custom-cost-details">${bookingDetails.price}</p>
              </div>
            </div>
            <div className="custom-button-container">
              <ButtonComponent btnName="Book more Turfs" onClick={() => navigate("/turfSearch")}/>
            </div>
          </CardComponent>
        </section>

  

        {/* Footer */}
        <FooterComponent />
      </div>
    </>
  );
};

export default BookingConfirmation;
