import React, { useEffect, useState } from "react";
import NavBarComponent from "../../Reusable-Components/navigation-component/NavBarComponent";
import FooterComponent from "../../Reusable-Components/footer-component/FooterComponent";
import ButtonComponent from "../../Reusable-Components/Button-Component/ButtonComponent";
import CardComponent from "../../Reusable-Components/Card-Component/CardComponent";
import ScrollerComponent from "../../Reusable-Components/Scroller-Component/ScrollerComponent";
import "./BookingConfirmation.css";
import { graphQLCommand } from "../../../util"; 
import user from '../../../assests/icons/user.png';

const BookingConfirmation = () => {

  const [navBarData, setNavBarData] = useState([]);

 
  useEffect(() => {
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

    fetchNavBarData();
  }, []);


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
    <>
     

 <NavBarComponent/>
      <div className="custom-booking-confirmation-container">
        <section className="custom-booking-success-section">
          <div className="custom-booking-header-image">
            <img src="./assests/images/golf.jpg" alt="Booking Success" />
            <h1>Your booking has been done successfully!!</h1>
          </div>
        </section>

        
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
                <p className="custom-location-details">{bookingDetails.location}</p>
              </div>
              <div className="custom-booking-item">
                <img src="./assests/icons/soccer.png" alt="Turf Icon" />
                <p className="custom-turf-details">{bookingDetails.turf}</p>
              </div>
              <div className="custom-booking-item">
                <img src="./assests/icons/calendar.png" alt="Calendar Icon" />
                <p className="custom-date-time">{bookingDetails.dateTime}</p>
              </div>
              <div className="custom-booking-item">
                <img src="./assests/icons/money.png" alt="Cost Icon" />
                <p className="custom-cost-details">{bookingDetails.cost}</p>
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
