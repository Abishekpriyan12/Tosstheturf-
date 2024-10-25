import React, { useState } from "react";
import NavBarComponent from "../navigation-component/NavBarComponent";
import FooterComponent from "../footer-component/FooterComponent";
import ButtonComponent from "../Button-Component/ButtonComponent";
import CardComponent from "../Card-Component/CardComponent";
import "./UserProfilePage.css";

const UserProfilePage = () => {
  const [user, setUser] = useState({
    username: "jennywilson",
    email: "jenny@gmail.com",
    address: "New York, USA",
    userType: "user",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const navBarData = [
    { name: "About Us", url: "/" },
    { name: "Venue", url: "/" },
    { name: "Contact Us", url: "/contact" },
    { name: "Deals", url: "/" },
  ];

  return (
    <div className="user-profile-container">
      <NavBarComponent navBarData={navBarData} />
      <section className="user-profile-section">
        <CardComponent className="user-profile-card">
          <div className="profile-header">
            <img
              src="./assests/icons/user.png"
              alt="Profile"
              className="profile-picture"
            />
            {/* <h2>{user.username}</h2> */}
          </div>
          <form className="profile-details-form">
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={user.username}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={user.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="userType">User Type:</label>
              <select
                id="userType"
                name="userType"
                value={user.userType}
                onChange={handleInputChange}
              >
                <option value="admin">Admin</option>
                <option value="client">Client</option>
                <option value="user">User</option>
              </select>
            </div>

            <ButtonComponent btnName="Save Profile" />
          </form>
        </CardComponent>
      </section>
      <FooterComponent />
    </div>
  );
};

export default UserProfilePage;
