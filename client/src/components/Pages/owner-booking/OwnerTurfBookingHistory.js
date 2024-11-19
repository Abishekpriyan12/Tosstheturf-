import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { graphQLCommand } from "../../../util";
import "./OwnerTurfBookingHistory.css";

const OwnerTurfBookingHistory = () => {
  const { turfId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch bookings for the turf
  const fetchBookings = async () => {
    const query = `
      query ($turfId: ID!) {
        getOwnerBookings(turfId: $turfId) {
          userId 
          time
          duration
          price
        }
      }
    `;
    const variables = { turfId };

    try {
      const data = await graphQLCommand(query, variables);
      setBookings(data.getOwnerBookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [turfId]);

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="booking-history-container">
      <div className="back-arrow" onClick={() => navigate(-1)}>
        <span>&#8249;</span>
        <span className="back-text">Back</span>
      </div>
      <h1>Booking History</h1>
      {bookings.length === 0 ? (
        <p>No bookings found for this turf.</p>
      ) : (
        <table className="booking-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Time Slots</th>
              <th>Duration</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={index}>
                <td>{booking.userId}</td>
                <td>{booking.time.join(", ")}</td>
                <td>{booking.duration} hours</td>
                <td>${booking.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OwnerTurfBookingHistory;
