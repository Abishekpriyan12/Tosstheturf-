import React, { useEffect, useState } from "react";
import ButtonComponent from "../../Reusable-Components/Button-Component/ButtonComponent";
import NavBarComponent from "../../Reusable-Components/navigation-component/NavBarComponent";
import FooterComponent from "../../Reusable-Components/footer-component/FooterComponent";
import "./BookingHistoryComponent.css";
import { graphQLCommand } from "../../../util";

const BookingHistoryComponent = () => {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [visibleBookings, setVisibleBookings] = useState(2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [showSortOptions, setShowSortOptions] = useState(false); // Toggle dropdown
  const [sortOrder, setSortOrder] = useState("asc"); // Track sorting order

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
          turfId {
            id
          }
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
      setFilteredBookings(data.getAllBookings || []); // Initialize filtered bookings
    } catch (error) {
      console.error("Error fetching booking history:", error);
      setError("Failed to fetch booking history.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    // Filter bookings based on user ID
    const filtered = bookingHistory.filter((booking) =>
      booking.userId.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBookings(filtered);
  };

  const handleSortByDate = (order) => {
    setSortOrder(order);

    // Sort bookings by date in ascending or descending order
    const sorted = [...filteredBookings].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      return order === "asc" ? dateA - dateB : dateB - dateA;
    });
    setFilteredBookings(sorted);
    setShowSortOptions(false); // Close dropdown after selection
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
              value={searchInput}
              onChange={handleSearch}
            />
          </div>
          <div className="sort-section">
            <button
              className="filter-button"
              onClick={() => setShowSortOptions((prev) => !prev)}
            >
              Filter By Date <i className="fa fa-sort"></i>
            </button>
            {showSortOptions && (
              <div className="sort-dropdown">
                <div
                  className="sort-option"
                  onClick={() => handleSortByDate("asc")}
                >
                  <i className="fa fa-arrow-up"></i> Ascending
                </div>
                <div
                  className="sort-option"
                  onClick={() => handleSortByDate("desc")}
                >
                  <i className="fa fa-arrow-down"></i> Descending
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="booking-cards">
          {filteredBookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            filteredBookings.slice(0, visibleBookings).map((booking, index) => (
              <div key={index} className="booking-card">
                <div className="booking-info">
                  <p>
                    <strong>User ID:</strong> {booking.userId}
                  </p>
                  <p>
                    <strong>Duration:</strong> {booking.duration} hours
                  </p>
                </div>
                <div className="booking-details">
                  <p>
                    <strong>Time Slots:</strong> {booking.time.join(", ")}
                  </p>
                  <p>
                    <strong>Price:</strong> ${booking.price}
                  </p>
                  <p>
                    <strong>Date:</strong> {booking.date}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        {visibleBookings < filteredBookings.length && (
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
