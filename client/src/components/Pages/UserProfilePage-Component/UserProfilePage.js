import React, { useEffect, useState } from "react";
import NavBarComponent from "../../Reusable-Components/navigation-component/NavBarComponent";
import FooterComponent from "../../Reusable-Components/footer-component/FooterComponent";
import { graphQLCommand } from "../../../util";
import "./UserProfilePage.css";
import profileImg from "../../../assests/images/profile.png";
 
const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [navBarData, setNavBarData] = useState([]);
  const [bookings, setBookings] = useState([]);
 
  const userId = sessionStorage.getItem("userId");
 
  useEffect(() => {
    // Fetch user data
    const fetchData = async () => {
      const query = `
        query GetUser($id: ID!) {
          getUser(id: $id) {
            id
            firstName
            lastName
            email
          }
        }
      `;
 
      const bookingQuery = `
      query GetBookings($userId: ID!) {
        getBookings(userId: $userId) {
          id
          turfName
          date
          time
          duration
          price
        }
      }
    `;
 
    try {
      const userData = await graphQLCommand(query, { id: userId });
      const bookingData = await graphQLCommand(bookingQuery, { userId });
 
      setUser(userData.getUser);
      setEditForm(userData.getUser);
      setBookings(bookingData.getBookings); // Set booking data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
 
    fetchData();
    fetchNavBarData();
  }, [userId]);
 
  const handleEditClick = () => {
    setEditForm(user); // Populate the form with current user data
    setIsEditPopupOpen(true); // Open the popup
  };
 
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };
 
  const handleFormSubmit = async (e) => {
    e.preventDefault();
 
    const updateUserQuery = `
      mutation UpdateUser($id: ID!, $firstName: String, $lastName: String, $email: String) {
        updateUser(id: $id, firstName: $firstName, lastName: $lastName, email: $email) {
          id
          firstName
          lastName
          email
        }
      }
    `;
 
    try {
      const updatedUser = await graphQLCommand(updateUserQuery, {
        id: userId,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
      });
 
      setUser(updatedUser.updateUser); // Update the user in state with the response data
      setIsEditPopupOpen(false); // Close the popup
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };
 
  const closePopup = () => setIsEditPopupOpen(false);
 
  if (!user) {
    return <p>Loading user data...</p>; // Show loading state while data is being fetched
  }
 
  return (
    <div className="profile-container">
      <NavBarComponent navBarData={navBarData} />
      <section className="profile-section">
        <div className="profile-card">
          <div className="profile-header">
            <h2>My Profile</h2>
            <button className="profile-edit-button" onClick={handleEditClick}>
              <span className="profile-edit-icon">✎</span> Edit
            </button>
          </div>
          <div className="profile-content">
            <img
              src={profileImg}
              alt="Profile"
              className="profile-picture"
            />
            <div className="profile-details">
              <p>{`${user.firstName} ${user.lastName}`}</p>
              <p>{user.email}</p>
            </div>
          </div>
        </div>
        <div className="profile-upcoming-bookings">
          <h2 className="profile-upcoming-heading">Upcoming Bookings</h2>
          <div className="profile-upcoming-list">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div key={booking.id} className="profile-upcoming-item">
                  <div className="profile-upcoming-date">
                    <p className="profile-date-day">
                      {new Date(booking.date).toLocaleString("en-US", {
                        weekday: "short",
                      })}
                    </p>
                    <p className="profile-date-number">
                      {new Date(booking.date).getDate()}
                    </p>
                  </div>
                  <div className="profile-upcoming-info">
                    <p className="profile-upcoming-time">
                      {`Time: ${booking.time.join(" - ")}`}
                    </p>
                    <p className="profile-upcoming-turf">{booking.turfName}</p>
                    <p className="profile-upcoming-details">
                      {`Duration: ${booking.duration} hours`}
                    </p>
                    <p className="profile-upcoming-details">{`Price: $${booking.price}`}</p>
                  </div>
                  {/* <div className="profile-upcoming-actions">
                    <button className="profile-edit-button">Edit</button>
                  </div> */}
                </div>
              ))
            ) : (
              <p className="profile-no-bookings">No upcoming bookings.</p>
            )}
          </div>
        </div>
      </section>
 
      {isEditPopupOpen && (
        <div className="edit-popup" onClick={closePopup}>
          <div
            className="edit-popup-content"
            onClick={(e) => e.stopPropagation()} // Prevent popup from closing when clicking inside
          >
            <button className="close-popup-button" onClick={closePopup}>
              ✕
            </button>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={editForm.firstName}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={editForm.lastName}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleFormChange}
                />
              </div>
              <button type="submit" className="save-button">
                Save
              </button>
            </form>
          </div>
        </div>
      )}
      <FooterComponent />
    </div>
  );
};
 
export default UserProfilePage;
 