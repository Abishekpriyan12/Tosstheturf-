import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { graphQLCommand } from "../../../util";
import { useNavigate } from "react-router-dom";
import CardComponent from "../../Reusable-Components/Card-Component/CardComponent";
import "./OwnerDashboardComponent.css";
import NavBarComponent from "../../Reusable-Components/navigation-component/NavBarComponent";
import FooterComponent from "../../Reusable-Components/footer-component/FooterComponent";
const OwnerDashboardComponent = () => {
  const [ownerTurfs, setOwnerTurfs] = useState([]);
  const [bookings, setBookings] = useState([]);
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
          timing
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
    }
  };

  // Fetch all bookings
  const fetchAllBookings = async () => {
    const query = `
      query {
        getAllBookings {
          turfId {
            id
            turfName
          }
          userId
          duration
          time
          price
          date
        }
      }
    `;

    try {
      const data = await graphQLCommand(query);
      setBookings(data.getAllBookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to fetch bookings.");
    }
  };

  // Calculate stats for approved turfs
  const calculateTurfStats = () => {
    const approvedTurfs = ownerTurfs.filter(
      (turf) => turf.status.toLowerCase() === "approved"
    );

    return approvedTurfs.map((turf) => {
      const turfBookings = bookings.filter(
        (booking) => booking.turfId.id === turf.id
      );

      const bookingCount = turfBookings.length;
      const totalRevenue = turfBookings.reduce(
        (sum, booking) => sum + booking.price * booking.duration,
        0
      );

      return { ...turf, bookingCount, totalRevenue };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchOwnerTurfs();
      await fetchAllBookings();
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading your turfs...</div>;
  if (error) return <div>Error: {error}</div>;

  const turfsWithStats = calculateTurfStats();
  const totalRevenue = turfsWithStats.reduce(
    (sum, turf) => sum + turf.totalRevenue,
    0
  );

  // Prepare data for the charts
  const chartData = {
    xAxisData: turfsWithStats.map((turf) => turf.turfName),
    bookingSeriesData: turfsWithStats.map((turf) => turf.bookingCount),
    revenueSeriesData: turfsWithStats.map((turf) => turf.totalRevenue),
  };
  const navdata = [
    { id: 1, name: "Owner Dashboard", url: "/ownerDashboard" },
    { id: 2, name: "User Profile", url: "/user" },
    { id: 3, name: "Add Turf", url: "/addturf" },
  ];

  const getBookingChartOptions = () => ({
    title: {
      text: "Turf Booking Count",
      left: "center",
      textStyle: {
        color: "#f5f5f5",
        fontSize: window.innerWidth < 768 ? 14 : 18,
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    xAxis: {
      type: "category",
      data: chartData.xAxisData,
      name: "Turfs",
      axisLine: { lineStyle: { color: "#ffffff" } },
      axisLabel: {
        fontSize: window.innerWidth < 768 ? 10 : 12,
      },
    },
    yAxis: {
      type: "value",
      name: "Bookings",
      interval: 1,
      axisLine: { show: true, lineStyle: { color: "#ffffff" } },
      splitLine: { show: false },
      axisLabel: {
        fontSize: window.innerWidth < 768 ? 10 : 12,
      },
    },
    series: [
      {
        data: chartData.bookingSeriesData,
        type: "bar",
        barWidth: window.innerWidth < 768 ? "50%" : "30%", // Adjust bar width
        itemStyle: { color: "#5470C6" },
      },
    ],
  });

  const getRevenueChartOptions = () => ({
    title: {
      text: `Turf Revenue (Total Revenue = $${totalRevenue.toFixed(2)})`,
      left: "center",
      textStyle: {
        color: "#f5f5f5",
        fontSize: window.innerWidth < 768 ? 14 : 18,
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params) =>
        `${params[0].name}<br/>Revenue: $${params[0].value.toFixed(2)}`,
    },
    xAxis: {
      type: "category",
      data: chartData.xAxisData,
      name: "Turfs",
      axisLine: { lineStyle: { color: "#ffffff" } },
      axisLabel: {
        fontSize: window.innerWidth < 768 ? 10 : 12,
      },
    },
    yAxis: {
      type: "value",
      name: "Revenue ($)",
      axisLine: { show: true, lineStyle: { color: "#ffffff" } },
      splitLine: { show: false },
      axisLabel: {
        fontSize: window.innerWidth < 768 ? 10 : 12,
      },
    },
    series: [
      {
        data: chartData.revenueSeriesData,
        type: "bar",
        barWidth: window.innerWidth < 768 ? "50%" : "30%",
        itemStyle: { color: "#91cc75" },
      },
    ],
  });

  return (
    <div className="owner-dashboard">
      <NavBarComponent navBarData={navdata}></NavBarComponent>
      <h1>Owner Dashboard</h1>
      {turfsWithStats.length === 0 ? (
        <p id="owner-page-p">No approved turfs added yet.</p>
      ) : (
        <div>
          <div className="charts-revenue">
            <div>
              <CardComponent>
                <ReactECharts
                  option={getBookingChartOptions()}
                  style={{ height: "400px", width: "100%" }}
                />
              </CardComponent>
            </div>
            <div>
              <CardComponent>
                <ReactECharts
                  option={getRevenueChartOptions()}
                  style={{ height: "400px", width: "100%" }}
                />
              </CardComponent>
            </div>
          </div>
          <div className="owner-page-turf-grid">
            {ownerTurfs.map((turf) => (
              <div className="owner-page-card" key={turf.id}>
                <div
                  className="owner-page-card-image"
                  style={{
                    backgroundImage: `url(${turf.mainImage})`,
                  }}
                ></div>
                <div className="owner-page-card-info">
                  {/* Turf Name, City, and Status Button */}
                  <div className="owner-page-card-header">
                    <h3 className="owner-page-card-title">
                      {turf.turfName},
                      <span className="owner-page-city">{turf.location}</span>
                    </h3>

                    <button
                      className={`owner-page-status-button ${
                        turf.status.toLowerCase() === "approved"
                          ? "approved"
                          : turf.status.toLowerCase() === "rejected"
                          ? "rejected"
                          : "pending"
                      }`}
                    >
                      {turf.status}
                    </button>
                  </div>
                  {/* Price, Timing, and View Bookings Button */}
                  <div className="owner-page-card-footer">
                    <span className="owner-page-price">
                      <strong>${turf.price}</strong>/Hr
                    </span>
                    <span className="owner-page-timing">{turf.timing}</span>
                    <button
                      className="owner-page-view-bookings-button"
                      onClick={() => navigate(`/bookinghistory/${turf.id}`)}
                    >
                      View Bookings
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <FooterComponent />
    </div>
  );
};

export default OwnerDashboardComponent;
