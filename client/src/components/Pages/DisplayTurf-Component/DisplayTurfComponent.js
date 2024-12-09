import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBarComponent from "../../Reusable-Components/navigation-component/NavBarComponent";
import "./DisplayTurfComponent.css";
import CardComponent from "../../Reusable-Components/Card-Component/CardComponent";
import FooterComponent from "../../Reusable-Components/footer-component/FooterComponent";
import { graphQLCommand } from "../../../util";
 
const DisplayTurfComponent = () => {
  const [turfs, setTurfs] = useState([]);
  const navigate = useNavigate();
 
  // Fetch turf data
  const fetchTurfData = async () => {
    const query = `
      query {
        getTurfs {
          id
          turfName
          location
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
  const navBarData = [
    { id: 1, name: "Turves", url: "/displayturf" },
    { id: 2, name: "Dashboard", url: "/adminDashboard" },
    { id: 3, name: "Add Turf", url: "/addTurf" },
    { id: 4, name: "User Profile", url: "/user" },
    { id: 5, name: "Booking History", url: "/bookingHistory" },
  ];


  // Delete a turf by ID
  const handleDelete = async (id) => {
    const mutation = `
      mutation deleteTurf($id: ID!) {
        deleteTurf(id: $id) {
          id
          turfName
        }
      }
    `;
    try {
      const response = await graphQLCommand(mutation, { id });
      console.log("Turf deleted successfully:", response);
      alert("Turf deleted successfully!");
      // Refresh the turfs list after deletion
      fetchTurfData();
    } catch (error) {
      console.error("Error deleting turf:", error);
      alert("Failed to delete turf: " + error.message);
    }
  };
 
  useEffect(() => {
    fetchTurfData();
   
  }, []);
 
  return (
    <div className="displayturf-page">
     

 <NavBarComponent/>
 
      <div className="displayturfdata-page">
        <div className="booking-button-container">
          All Turf Details
        </div>
 
        <div className="turf-cards-container">
          {turfs.length > 0 ? (
            turfs.map((turf) => (
              <CardComponent key={turf.id} className="turf-card">
                <div className="turf-card-content">
                  <img
                    src={turf.mainImage || "home_image.png"}
                    alt={turf.turfName}
                    className="turf-image-display"
                  />
                  <div className="turf-info">
                    <p>
                      <strong>Name:</strong> {turf.turfName}
                    </p>
                    <p>
                      <strong>Price:</strong> {turf.price} per hour
                    </p>
                    <p>
                      <strong>Location:</strong> {turf.location}
                    </p>
                    <div className="turf-buttons">
                      <button
                        className="edit-button"
                        onClick={() =>
                          navigate("/edit-turf", { state: { turf } })
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(turf.id)}
                      >
                        Delete
                      </button>
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
