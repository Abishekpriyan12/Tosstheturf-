import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FooterComponent from "../../Reusable-Components/footer-component/FooterComponent";
import NavBarComponent from "../../Reusable-Components/navigation-component/NavBarComponent";
import "./BookingPageComponent.css";
import { graphQLCommand } from "../../../util";

const CREATE_BOOKING_MUTATION = `
  mutation CreateBooking(
    $userId: ID!
    $turfId: ID!
    $date: String!
    $time: [String!]!
    $duration: Int!
    $price: Float!
  ) {
    createBooking(
      userId: $userId
      turfId: $turfId
      date: $date
      time: $time
      duration: $duration
      price: $price
    ) {
      id
      date
      time
      duration
      price
    }
  }
`;

const generateTimeSlots = (openingTime, closingTime) => {
  const start = parseInt(openingTime.split(" ")[0]);
  const end = parseInt(closingTime.split(" ")[0]);

  const slots = [];
  for (let i = start; i < end; i++) {
    slots.push(`${i} AM - ${i + 1} AM`);
  }
  return slots;
};

const BookingPageComponent = () => {
  const { id } = useParams();
  const [turfData, setTurfData] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [navBarData, setNavBarData] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const userId = sessionStorage.getItem("userId");
  const [fullyBookedDates, setFullyBookedDates] = useState([]);
  const navigate = useNavigate();
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
  const fetchFullyBookedDates = async () => {
    const query = `
      query ($turfId: ID!) {
        getFullyBookedDates(turfId: $turfId)
      }
    `;
    const variables = { turfId: id };

    try {
      const data = await graphQLCommand(query, variables);
      setFullyBookedDates(data.getFullyBookedDates || []);
    } catch (error) {
      console.error("Error fetching fully booked dates:", error);
    }
  };

  useEffect(() => {
    fetchFullyBookedDates();
  }, []);

  useEffect(() => {
    if (fullyBookedDates.length > 0) {
      console.log(`Fully booked dates: ${fullyBookedDates.join(", ")}`);
    }
  }, [fullyBookedDates]);

  const fetchTurfDetails = async () => {
    const query = `
      query ($id: ID!) {
        turf(id: $id) {
          id
          turfName
          location
          sportType
          price
          timing
        }
      }
    `;
    const variables = { id };

    try {
      const data = await graphQLCommand(query, variables);
      setTurfData(data.turf || null);
      const [openingTime, closingTime] = data.turf.timing.split(" to ");
      const timeSlots = generateTimeSlots(openingTime, closingTime);
      setAvailableSlots(timeSlots);
    } catch (error) {
      console.error("Error fetching turf details:", error);
    }
  };

  const fetchBookedSlots = async (date) => {
    const query = `
      query ($turfId: ID!, $date: String!) {
        getBookingsByTurfAndDate(turfId: $turfId, date: $date) {
          time
        }
      }
    `;
    const variables = { turfId: id, date };

    try {
      const data = await graphQLCommand(query, variables);
      const bookedTimes = data.getBookingsByTurfAndDate.flatMap(
        (booking) => booking.time
      );
      setBookedSlots(bookedTimes);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
    }
  };

  const handleDateChange = (e) => {
    const selected = e.target.value;
    setSelectedDate(selected);
    fetchBookedSlots(selected);
  };

  const handleSlotChange = (slot) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };
  const handleProceedToPayment = async () => {
    navigate("/payment");
  };

  const handleProceedToBook = async () => {
    if (selectedSlots.length === 0) {
      alert("Please select at least one time slot.");
      return;
    }

    const duration = selectedSlots.length; 
    const variables = {
      userId,
      turfId: turfData.id,
      date: selectedDate,
      time: selectedSlots,
      duration,
      price: parseFloat(turfData.price) * duration, 
    };

    try {
      const data = await graphQLCommand(CREATE_BOOKING_MUTATION, variables);
      console.log("Booking created successfully:", data.createBooking);
      fetchBookedSlots(selectedDate);
      setShowDropdown(false);
      setShowBookingDetails(true);
    } catch (error) {
      console.error("Failed to create booking:", error);
    }
  };

  useEffect(() => {
    fetchNavBarData();
    fetchTurfDetails();
  }, [id]);

  if (!turfData) return <div>Loading turf data...</div>;

  return (
    <div>
      <NavBarComponent navBarData={navBarData} className="nav-bar" />
       <div className="back-arrow" onClick={() => navigate(-1)}>
      <span>&#8249;</span> 
      <span className="back-text">Back</span>
    </div>
      {fullyBookedDates.length > 0 && (
          <div className="alert">
             Fully booked dates: {fullyBookedDates.join(", ")}
          </div>
        )}
      <div className="booking-section">
        <div className="Booking-card">
          <h2>{turfData.turfName}</h2>
          <div className="toss-points">
            Earn 5 Toss points each time you book!!!
          </div>
          <div className="input-group">
            <label>Sports</label>
            <input
              type="text"
              value={turfData.sportType}
              readOnly
              className="non-editable-input"
            />
          </div>
          <div className="input-group">
            <label>Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="input-group">
            <label>Time Slots</label>
            <button
              className="dropdown-button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {selectedSlots.length > 0
                ? selectedSlots.join(", ")
                : "Select Time Slots"}
            </button>
            {showDropdown && (
              <div className="dropdown-checkbox">
                <span
                  className="close-icon"
                  onClick={() => setShowDropdown(false)}
                >
                  ✖
                </span>
                {availableSlots.map((slot, index) => (
                  <label key={index}>
                    <input
                      className="check-drop"
                      type="checkbox"
                      value={slot}
                      checked={selectedSlots.includes(slot)}
                      onChange={() => handleSlotChange(slot)}
                      disabled={bookedSlots.includes(slot)}
                    />
                    {slot} {bookedSlots.includes(slot) && "(Booked)"}
                  </label>
                ))}
                <span
                  className="submit-icon"
                  onClick={() => setShowDropdown(false)}
                >
                  ✔
                </span>
              </div>
            )}
          </div>
          <div className="input-group">
            <label>Duration</label>
            <p>{selectedSlots.length} hrs</p>
          </div>
          <button className="proceed-button" onClick={handleProceedToBook}>
            Proceed to Book
          </button>
        </div>
        {showBookingDetails && (
          <div className="booking-details-card">
            <h3>Booking Details</h3>
            <p>Location: {turfData.location}</p>
            <p>Date: {selectedDate}</p>
            <p>Time: {selectedSlots.join(", ")}</p>
            <p>Duration: {selectedSlots.length} hrs</p>
            <p>Cost: ${parseFloat(turfData.price) * selectedSlots.length}</p>
            <button className="proceed-button" onClick={handleProceedToPayment}>
              Proceed to Payment
            </button>
          </div>
        )}
      </div>
      <FooterComponent />
    </div>
  );
};

export default BookingPageComponent;
