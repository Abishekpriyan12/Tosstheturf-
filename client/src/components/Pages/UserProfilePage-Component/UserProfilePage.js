import React, { useEffect, useState } from "react";
import NavBarComponent from "../../Reusable-Components/navigation-component/NavBarComponent";
import FooterComponent from "../../Reusable-Components/footer-component/FooterComponent";
import CardComponent from "../../Reusable-Components/Card-Component/CardComponent";
import { graphQLCommand } from "../../../util";
import "./UserProfilePage.css";

const UserProfilePage = () => {
  const [user, setUser] = useState({
    firstName: "Abishek Priyan",
    lastName: "Kabilan",
    email: "abishekpriyan11@gmail.com",
    phone: "(549) 398 0430",
  });
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [editForm, setEditForm] = useState(user);

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

  const handleEditClick = () => {
    setEditForm(user); // Populate the form with current user data
    setIsEditPopupOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setUser(editForm); // Save the updated user data
    setIsEditPopupOpen(false); // Close the popup
  };

  const closePopup = () => setIsEditPopupOpen(false);

  return (
    <div className="profile-container">
      <NavBarComponent navBarData={navBarData} />
      <section className="profile-section">
        <div className="profile-cards">
          <CardComponent className="profile-card">
            <div className="profile-header">
              <h2>My Profile</h2>
              <button className="edit-button" onClick={handleEditClick}>
                Edit
              </button>
            </div>
            <div className="profile-content">
              <div className="profile-picture-section">
                <img
                  src="./assests/icons/user.png"
                  alt="Profile"
                  className="profile-picture"
                />
              </div>
              <div className="profile-details">
                <p className="profile-name">{`${user.firstName} ${user.lastName}`}</p>
                <p>{user.email}</p>
                <p>{user.phone}</p>
              </div>
            </div>
          </CardComponent>

          <CardComponent className="profile-card">
            <div className="profile-header">
              <h2>Personal Information</h2>
              <button className="edit-button" onClick={handleEditClick}>
                Edit
              </button>
            </div>
            <div className="personal-info">
              <div className="info-item">
                <label>First Name</label>
                <p>{user.firstName}</p>
              </div>
              <div className="info-item">
                <label>Last Name</label>
                <p>{user.lastName}</p>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{user.email}</p>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <p>{user.phone}</p>
              </div>
            </div>
          </CardComponent>
        </div>
      </section>

      {isEditPopupOpen && (
        <div className="edit-popup">
          <div className="edit-popup-content">
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
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={editForm.phone}
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
