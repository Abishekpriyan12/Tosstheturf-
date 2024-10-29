import React, { useEffect, useState } from "react";
import NavBarComponent from "../../Reusable-Components/navigation-component/NavBarComponent";
import FooterComponent from "../../Reusable-Components/footer-component/FooterComponent";
import CardComponent from "../../Reusable-Components/Card-Component/CardComponent";
import { graphQLCommand } from "../../../util";
import "./UserProfilePage.css";

const UserProfilePage = () => {
  const [user, setUser] = useState({
    username: "jennywilson",
    email: "jenny@gmail.com",
    address: "New York, USA",
    userType: "user",
  });

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
        </div>
          <div className="profile-details-display">
            <div className="data-container">
              <label>Username:</label>
              <p>{user.username}</p>
            </div>
            <div className="data-container">
              <label>Email:</label>
              <p>{user.email}</p>
            </div>
            <div className="data-container">
              <label>Address:</label>
              <p>{user.address}</p>
            </div>
            <div className="data-container">
              <label>User Type:</label>
              <p>{user.userType}</p>
            </div>
          </div>
        </CardComponent>
      </section>
      <FooterComponent />
    </div>
  );
};

export default UserProfilePage;
