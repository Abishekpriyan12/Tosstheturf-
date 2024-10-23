import React, { useEffect, useState } from "react";
import ButtonComponent from "../../Reusable-Components/Button-Component/ButtonComponent";
import NavBarComponent from "../../Reusable-Components/navigation-component/NavBarComponent";
import "./DisplayTurfComponent.css";
import CardComponent from "../../Reusable-Components/Card-Component/CardComponent";
import FooterComponent from "../../Reusable-Components/footer-component/FooterComponent";
import { graphQLCommand } from "../../../util";

// Dummy turf data
const turfData = [
  {
    id: 1,
    name: "SMR Sports Arena",
    cost: 1000,
    location: "Waterloo",
    image: "host_image.png", // Add the correct image path
  },
  {
    id: 2,
    name: "kwc Arena",
    cost: 1000,
    location: "Waterloo",
    image: "host_image.png", // Add the correct image path
  },
  {
    id: 3,
    name: "SMR Sports Arena",
    cost: 1000,
    location: "Waterloo",
    image: "host_image.png", // Add the correct image path
  },
];

const DisplayTurfComponent = () => {
  const [navBarData, setNavBarData] = useState([]);

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

  useEffect(() => {
    fetchNavBarData();
  }, []);

  return (
    <div className="displayturf-page">
      <NavBarComponent navBarData={navBarData} />

      <div className="displayturfdata-page">
      <div className="booking-button-container">
        <ButtonComponent
          btnName="View Booking Details"
          onClick={() => alert("View booking details clicked!")}
        />
      </div>

      <div className="turf-cards-container">
        {turfData.map((turf) => (
          <CardComponent key={turf.id} className="turf-card">
            <div className="turf-card-content">
              <img src={turf.image} alt={turf.name} className="turf-image" />
              <div className="turf-info">
                <p><strong>Name:</strong> {turf.name}</p>
                <p><strong>Cost:</strong> {turf.cost} per hour</p>
                <p><strong>Location:</strong> {turf.location}</p>
                <div className="turf-buttons">
                  <button className="edit-button">Edit</button>
                  <button className="delete-button">Delete</button>
                </div>
              </div>
            </div>
          </CardComponent>
        ))}
      </div>
</div>
      <FooterComponent />
    </div>
  );
};

export default DisplayTurfComponent;
