import React, { useState, useEffect } from "react";
import { graphQLCommand } from "../../../util";
import { useNavigate } from "react-router-dom";
import CardComponent from "../../Reusable-Components/Card-Component/CardComponent";
import "./OwnerDashboardComponent.css";
import NavBarComponent from "../../Reusable-Components/navigation-component/NavBarComponent";
import ButtonComponent from "../../Reusable-Components/Button-Component/ButtonComponent";

const OwnerDashboardComponent = () => {
  const [ownerTurfs, setOwnerTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ownerName = sessionStorage.getItem("username");
  const navigate = useNavigate();

  // Fetch turfs added by the owner
  const fetchOwnerTurfs = async () => {
    const query = `
      query ($ownerName: String!) {
        getOwnerTurfs(ownerName: $ownerName) {
          id
          turfName
          location
          price
          mainImage
          status
        }
      }
    `;
    const variables = { ownerName };

    try {
      const data = await graphQLCommand(query, variables);
      setOwnerTurfs(data.getOwnerTurfs || []);
    } catch (error) {
      console.error("Error fetching owner turfs:", error);
      setError("Failed to fetch turfs.");
    } finally {
      setLoading(false);
    }
  };
  const navdata = [
    { id: 1, name: "Owner Dashboard", url: "/ownerDashboard" },
    { id: 2, name: "User Profile", url: "/user" },
    { id:3, name: "Add Turf", url: "/addturf" },
  ];
  useEffect(() => {
    fetchOwnerTurfs();
  }, []);

  if (loading) return <div>Loading your turfs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="owner-dashboard">
      <NavBarComponent navBarData={navdata}></NavBarComponent>
      <h1>Owner Dashboard</h1>
      {ownerTurfs.length === 0 ? (
        <p>No turfs added yet.</p>
      ) : (
        <div className="turf-grid">
          {ownerTurfs.map((turf) => (
            <CardComponent
              key={turf.id}
              width="90%"
              height="auto"
              backgroundColor="#333"
            >
              <img
                src={turf.mainImage}
                alt={turf.turfName}
                className="turf-image"
              />
              <div className="turf-info">
                <p>
                  <strong>Name:</strong> {turf.turfName}
                </p>
                <p>
                  <strong>Location:</strong> {turf.location}
                </p>
                <p>
                  <strong>Price:</strong> ${turf.price} per hour
                </p>
                <p>
                  <strong>Status:</strong> {turf.status}
                </p>
                <ButtonComponent
                  btnName="view bookings"
                  onClick={() => navigate(`/bookinghistory/${turf.id}`)}
                >
                  View Bookings
                </ButtonComponent>
              </div>
            </CardComponent>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboardComponent;
