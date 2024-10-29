import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FooterComponent from "../../Reusable-Components/footer-component/FooterComponent";
import NavBarComponent from "../../Reusable-Components/navigation-component/NavBarComponent";
import './BookingPageComponent.css';
import { graphQLCommand } from "../../../util";


const CREATE_BOOKING_MUTATION = `
  mutation CreateBooking(
    $userId: ID!
    $turfId: ID!
    $date: String!
    $time: String!
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
  const [selectedTime, setSelectedTime] = useState("");
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [navBarData, setNavBarData] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);

  const dummyUserId = "60c72b2f9b1e8a001c8e4d48"; // Dummy user ID for testing

  
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

  // Fetching  already booked slots for the selected date
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
      const bookedTimes = data.getBookingsByTurfAndDate.map((booking) => booking.time);
      console.log("Booked slots: ", bookedTimes); // Debugging: shows booked slots in console
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

  const handleProceedToBook = () => {
    setShowBookingDetails(true);
  };

  const handleProceedToPayment = async () => {
    const variables = {
      userId: dummyUserId,
      turfId: turfData.id,
      date: selectedDate,
      time: selectedTime,
      duration: 1,
      price: parseFloat(turfData.price),
    };

    try {
      const data = await graphQLCommand(CREATE_BOOKING_MUTATION, variables);
      console.log("Booking created successfully:", data.createBooking);
      fetchBookedSlots(selectedDate); // Refresh booked slots after booking
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
      <div className="booking-section">
        <div className="Booking-card">
          <h2>{turfData.turfName}</h2>
          <div className="toss-points">Earn 5 Toss points each time you book!!!</div>
          <div className="input-group">
            <label>Sports</label>
            <select>
              <option value={turfData.sportType}>{turfData.sportType}</option>
            </select>
          </div>
          <div className="input-group">
            <label>Date</label>
            <input type="date" value={selectedDate} onChange={handleDateChange} />
          </div>
          <div className="input-group">
            <label>Time</label>
            <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
              <option>Select Time</option>
              {availableSlots.map((time, index) => (
                <option key={index} value={time} disabled={bookedSlots.includes(time)}>
                  {time} {bookedSlots.includes(time) && "(Booked)"}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>Duration</label>
            <input type="number" min="1" placeholder="1 hr" />
          </div>
          <button className="proceed-button" onClick={handleProceedToBook}>Proceed to Book</button>
        </div>

        {showBookingDetails && (
          <div className="booking-details-card">
            <h3>Booking Details</h3>
            <p>Location: {turfData.location}</p>
            <p>Date: {selectedDate}</p>
            <p>Time: {selectedTime}</p>
            <p>Cost: ${turfData.price} / hr</p>
            <button className="proceed-button" onClick={handleProceedToPayment}>Proceed to Payment</button>
          </div>
        )}
      </div>
      <FooterComponent />
    </div>
  );
};

export default BookingPageComponent;
