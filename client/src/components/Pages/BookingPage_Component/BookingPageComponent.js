import React, { useEffect, useState } from "react";
import FooterComponent from "../../Reusable-Components/footer-component/FooterComponent";
import NavBarComponent from "../../Reusable-Components/navigation-component/NavBarComponent";
import './BookingPageComponent.css';
import { graphQLCommand } from "../../../util"

const BookingPageComponent = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [showBookingDetails, setShowBookingDetails] = useState(false);

  // Hardcoded JSON data for available slots
  const turfData = {
    id: 1,
    name: "Waterloo Athletic",
    location: "Waterloo",
    sport: "Football",
    price: 48,
    slots: [
      { date: "2024-10-15", times: ["06:00 AM", "07:00 AM", "08:00 AM"] },
      { date: "2024-10-16", times: ["06:00 AM", "07:30 AM", "09:00 AM"] },
      { date: "2024-10-17", times: ["07:00 AM", "08:00 AM", "10:00 AM"] }
    ]
  };

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

  const handleDateChange = (e) => {
    const selected = e.target.value;
    setSelectedDate(selected);

    // Filter slots based on the selected date
    const selectedSlot = turfData.slots.find(slot => slot.date === selected);
    setAvailableSlots(selectedSlot ? selectedSlot.times : []);
  };

  const handleProceedToBook = () => {
    setShowBookingDetails(true);
  };

  const [navBarData, setNavBarData] = useState([]);

  useEffect(() => {
    fetchNavBarData();
  }, []);

  return (
    <div>
      <NavBarComponent navBarData={navBarData} className="nav-bar"/>
      <div className="booking-section">
        <div className="Booking-card">
          <h2>{turfData.name}</h2>
          <div className="toss-points">Earn 5 Toss points each time you book!!!</div>
          <div className="input-group">
            <label>Sports</label>
            <select>
              <option value={turfData.sport}>{turfData.sport}</option>
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
                <option key={index} value={time}>{time}</option>
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
            <button className="proceed-button">Proceed to Payment</button>
          </div>
        )}
      </div>
      <FooterComponent />
    </div>
  );
};

export default BookingPageComponent;