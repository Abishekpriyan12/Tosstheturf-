import React from "react";
import CardComponent from "../../Reusable-Components/Card-Component/CardComponent";
import "./ownerDashboardComponent.css";

const OwnerDashboardComponent = () => {
  // Dummy data for testing
  const turfs = [
    {
      id: 1,
      turfName: "SMR Sports Arena",
      cost: 1000,
      location: "Waterloo",
      imageUrl: "", // Replace with an actual image URL
    },
    {
      id: 2,
      turfName: "KWC Arena",
      cost: 1200,
      location: "Waterloo",
      imageUrl: "", // Replace with an actual image URL
    },
    {
      id: 3,
      turfName: "City Sports Complex",
      cost: 1500,
      location: "Toronto",
      imageUrl: "", // Replace with an actual image URL
    },
    {
      id: 4,
      turfName: "Downtown Sports Hub",
      cost: 1100,
      location: "Toronto",
      imageUrl: "", // Replace with an actual image URL
    },
  ];

  // Dummy functions for edit and delete actions
  const onEdit = (id) => {
    console.log("Edit turf with ID:", id);
  };

  const onDelete = (id) => {
    console.log("Delete turf with ID:", id);
  };

  return (
    <div className="owner-dashboard">
      <h2 className="dashboard-title">Turf Available</h2>
      <button className="view-booking-button">View Booking Details</button>
      <div className="turf-grid">
        {turfs.map((turf) => (
          <CardComponent key={turf.id} width="300px" height="auto" backgroundColor="#333">
            <img src={turf.imageUrl} alt={turf.turfName} className="turf-image" />
            <div className="turf-info">
              <p><strong>Name :</strong> {turf.turfName}</p>
              <p><strong>Cost:</strong> {turf.cost} per hour</p>
              <p><strong>Location:</strong> {turf.location}</p>
              <div className="button-group">
                <button className="edit-button" onClick={() => onEdit(turf.id)}>Edit</button>
                <button className="delete-button" onClick={() => onDelete(turf.id)}>Delete</button>
              </div>
            </div>
          </CardComponent>
        ))}
      </div>
    </div>
  );
};

export default OwnerDashboardComponent;
