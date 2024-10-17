import React, { useEffect, useState } from "react";
import ButtonComponent from "../Button-Component/ButtonComponent";
import NavBarComponent from "../navigation-component/NavBarComponent";
import FooterComponent from "../footer-component/FooterComponent";
import "./BookingHistoryComponent.css"; // Assuming the CSS below
import { graphQLCommand } from "../../util";

const BookingHistoryComponent = () => {
  const [navBarData, setNavBarData] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);

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

  // Dummy booking data
  const fetchBookingHistory = async () => {
    const dummyBookingHistory = [
      {
        userName: "User 1",
        turfName: "SMR Arena",
        duration: "1 hour",
        bookedFor: "Cricket",
        paymentStatus: "Paid",
        reservedTime: "6:00 AM to 7:00 AM",
      },
      {
        userName: "User 1",
        turfName: "SMR Arena",
        duration: "1 hour",
        bookedFor: "Cricket",
        paymentStatus: "Paid",
        reservedTime: "7:00 AM to 8:00 AM",
      },
    ];

    setBookingHistory(dummyBookingHistory);
  };

  useEffect(() => {
    fetchNavBarData();
    fetchBookingHistory();
  }, []);

  return (
    <div className="bookingHistory-page">
      <NavBarComponent navBarData={navBarData} />

      <div className="content-section">
        <div className="filter-section">
          <h2 className="section-title">Booked Turf User Details:</h2>
          <div className="search-container">
            <span className="search-icon">
              <i className="fa fa-search"></i>
            </span>
            <input
              type="text"
              placeholder="Search by user name"
              className="search-input"
            />
          </div>
          <button className="filter-button">Filter By Duration</button>
        </div>

        <div className="booking-cards">
          {bookingHistory.map((booking, index) => (
            <div key={index} className="booking-card">
              <div className="booking-info">
                <p><strong>User Name:</strong> {booking.userName}</p>
                <p><strong>Turf Booked Name:</strong> {booking.turfName}</p>
                <p><strong>Duration:</strong> {booking.duration}</p>
              </div>
              <div className="booking-details">
                <p><strong>Booked For:</strong> {booking.bookedFor}</p>
                <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>
                <p><strong>Reserved Time:</strong> {booking.reservedTime}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="viewmorehistory-button">
        <ButtonComponent btnName="View More" />
        </div>
      </div>

      <FooterComponent />
    </div>
  );
};

export default BookingHistoryComponent;
