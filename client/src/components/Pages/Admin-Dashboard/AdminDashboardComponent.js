import React, { useState, useEffect } from "react";
import { graphQLCommand } from "../../../util";
import { Link } from "react-router-dom";
import "./AdminDashboardComponent.css";
import NavBarComponent from "../../Reusable-Components/navigation-component/NavBarComponent";

const AdminDashboardComponent = () => {
  const [pendingTurfs, setPendingTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navBarData = [
    { id: 1, name: "Turves", url: "/displayturf" },
    { id: 2, name: "Dashboard", url: "/adminDashboard" },
    { id: 3, name: "Add Turf", url: "/addTurf" },
    { id: 4, name: "User Profile", url: "/user" },
    { id: 5, name: "Booking History", url: "/bookingHistory" },
  ];

  const fetchPendingTurfs = async () => {
    const query = `
      query {
        getPendingTurfs {
          id
          turfName
          ownerName
          address
          location
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
      setPendingTurfs(data.getPendingTurfs || []);
    } catch (error) {
      console.error("Error fetching pending turfs:", error);
      setError("Failed to fetch pending turfs.");
    } finally {
      setLoading(false);
    }
  };

  const approveTurf = async (turfId) => {
    const mutation = `
      mutation ($turfId: ID!) {
        approveTurf(turfId: $turfId) {
          id
          status
        }
      }
    `;
    const variables = { turfId };

    try {
      await graphQLCommand(mutation, variables);
      setPendingTurfs((prev) => prev.filter((turf) => turf.id !== turfId));
      alert("Turf approved successfully.");
    } catch (error) {
      console.error("Error approving turf:", error);
      alert("Failed to approve turf.");
    }
  };

  const rejectTurf = async (turfId) => {
    const mutation = `
      mutation ($turfId: ID!) {
        rejectTurf(turfId: $turfId) {
          id
          status
        }
      }
    `;
    const variables = { turfId };

    try {
      await graphQLCommand(mutation, variables);
      setPendingTurfs((prev) => prev.filter((turf) => turf.id !== turfId));
      alert("Turf rejected successfully.");
    } catch (error) {
      console.error("Error rejecting turf:", error);
      alert("Failed to reject turf.");
    }
  };

  useEffect(() => {
    fetchPendingTurfs();
  }, []);

  if (loading) return <div>Loading turfs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-dashboard">
      <NavBarComponent navBarData={navBarData}></NavBarComponent>
      <h1>Admin Dashboard</h1>
      <h2>Pending Turf Approvals</h2>
      {pendingTurfs.length === 0 ? (
        <p>No turfs pending approval.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Owner</th>
              <th>Location</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingTurfs.map((turf) => (
              <tr key={turf.id}>
                <td>{turf.turfName}</td>
                <td>{turf.ownerName}</td>
                <td>{turf.location}</td>
                <td>${turf.price}</td>
                <td>
                  <button
                    className="approve-button"
                    onClick={() => approveTurf(turf.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-button"
                    onClick={() => rejectTurf(turf.id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboardComponent;
