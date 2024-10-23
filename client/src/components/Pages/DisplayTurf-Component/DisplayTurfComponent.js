import React, { useEffect, useState } from "react";
import ButtonComponent from "../../Reusable-Components/Button-Component/ButtonComponent";
import NavBarComponent from "../../Reusable-Components/navigation-component/NavBarComponent";
import "./DisplayTurfComponent.css";
import CardComponent from "../../Reusable-Components/Card-Component/CardComponent";
import FooterComponent from "../../Reusable-Components/footer-component/FooterComponent";
import { graphQLCommand } from "../../../util";

const DisplayTurfComponent = () => {
  const [navBarData, setNavBarData] = useState([]);
  const [turfs, setTurfs] = useState([]);

  // Fetch turf data from the database
  const fetchTurfData = async () => {
    const query = `
      query {
        getTurfs {
          id
          turfName
          address
          phone
          amenities {
            parking
            drinkingWater
            spareKits
            nonAC
          }
          timing
          mainImage
          sliderImages
          sportType
          price
          rating
          firstTimeDiscount
        }
      }
    `;
    try {
      const data = await graphQLCommand(query);
      setTurfs(data.getTurfs || []); 
    } catch (error) {
      console.error("Error fetching turf data:", error);
    }
  };

  // Fetch NavBar data
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
    fetchTurfData(); 
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
          {turfs.length > 0 ? (
            turfs.map((turf) => (
              <CardComponent key={turf.id} className="turf-card">
                <div className="turf-card-content">
                  <img
                    src={turf.mainImage || "home_image.png"} 
                    alt={turf.turfName}
                    className="turf-image"
                  />
                  <div className="turf-info">
                    <p><strong>Name:</strong> {turf.turfName}</p>
                    <p><strong>Price:</strong> {turf.price} per hour</p>
                    <p><strong>Location:</strong> {turf.address}</p>
                    <div className="turf-buttons">
                      <button className="edit-button">Edit</button>
                      <button className="delete-button">Delete</button>
                    </div>
                  </div>
                </div>
              </CardComponent>
            ))
          ) : (
            <p>No turfs available</p>
          )}
        </div>
      </div>

      <FooterComponent />
    </div>
  );
};

export default DisplayTurfComponent;
