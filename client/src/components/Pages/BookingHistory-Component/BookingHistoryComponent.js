import React, { useEffect, useState } from "react";
import ButtonComponent from "../../Reusable-Components/Button-Component/ButtonComponent";
import NavBarComponent from "../../Reusable-Components/navigation-component/NavBarComponent";
import FooterComponent from "../../Reusable-Components/footer-component/FooterComponent";
import "./BookingHistoryComponent.css";
import { graphQLCommand } from "../../../util";

const BookingHistoryComponent = () => {
  
  const [bookingHistory, setBookingHistory] = useState([]);
  const [visibleBookings, setVisibleBookings] = useState(2); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navBarData = [
    { id: 1, name: "Turves", url: "/displayturf" },
    { id: 2, name: "Dashboard", url: "/adminDashboard" },
    { id: 3, name: "Add Turf", url: "/addTurf" },
    { id: 4, name: "User Profile", url: "/user" },
    { id: 5, name: "Booking History", url: "/bookingHistory" },
  ];
 

  const fetchBookingHistory = async () => {
    const query = `
      query {
        getAllBookings {
          turfName
          userId
          duration
          time
          price
          date
        }
      }
    `;
    try {
      const data = await graphQLCommand(query);
      setBookingHistory(data.getAllBookings || []);
    } catch (error) {
      console.error("Error fetching booking history:", error);
      setError("Failed to fetch booking history.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewMore = () => {
    setVisibleBookings((prev) => prev + 2); // Show 2 more bookings
  };

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  if (loading) return <div>Loading booking history...</div>;
  if (error) return <div>Error: {error}</div>;

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
              placeholder="Search by user ID"
              className="search-input"
            />
          </div>
          <button className="filter-button">Filter By Duration</button>
        </div>

        <div className="booking-cards">
          {bookingHistory.length === 0 ? (
            <p>No bookings available.</p>
          ) : (
            bookingHistory.slice(0, visibleBookings).map((booking, index) => (
              <div key={index} className="booking-card">
                <div className="booking-info">
                  <p><strong>User ID:</strong> {booking.userId}</p>
                  <p><strong>Turf Name:</strong> {booking.turfName}</p>
                  <p><strong>Duration:</strong> {booking.duration} hours</p>
                </div>
                <div className="booking-details">
                  <p><strong>Time Slots:</strong> {booking.time.join(", ")}</p>
                  <p><strong>Price:</strong> ${booking.price}</p>
                  <p><strong>Date:</strong> {booking.date}</p>
                </div>
              </div>
            ))
          )}
        </div>
        {visibleBookings < bookingHistory.length && (
          <div className="viewmorehistory-button">
            <ButtonComponent btnName="View More" onClick={handleViewMore} />
          </div>
        )}
      </div>

      <FooterComponent />
    </div>
  );
};

export default BookingHistoryComponent;
