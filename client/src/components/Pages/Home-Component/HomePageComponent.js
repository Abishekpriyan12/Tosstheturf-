import React, { useEffect, useState } from "react";
import ButtonComponent from "../../Reusable-Components/Button-Component/ButtonComponent";
import NavBarComponent from "../../Reusable-Components/navigation-component/NavBarComponent";
import "./HomePageComponent.css";
import CardComponent from "../../Reusable-Components/Card-Component/CardComponent";
import FooterComponent from "../../Reusable-Components/footer-component/FooterComponent";
import { useNavigate } from "react-router-dom";

const HomePageComponent = () => {
  const [navBarData, setNavBarData] = useState([]);
  const navigate = useNavigate();

  // Static Navbar data
  const getStaticNavBarData = () => {
    const userRole = sessionStorage.getItem("role"); // Get role from sessionStorage
    if (userRole === "User") {
      return [
        { id: 1, name: "Home", url: "/" },
        { id: 2, name: "Contact Us", url: "/contact" },
        { id: 3, name: "FAQ", url: "/faq" },
        { id: 4, name: "Payment", url: "/payment" },
        { id: 5, name: "User Profile", url: "/user" },
      ];
    } else if (userRole === "Admin") {
      return [
        { id: 1, name: "Home", url: "/" },
        { id: 2, name: "Admin Dashboard", url: "/adminDashboard" },
        { id: 3, name: "Booking History", url: "/bookinghistory" },
        { id: 4, name: "Display Turf", url: "/displayturf" },
        { id: 5, name: "Edit Turf", url: "/edit-turf" },
      ];
    } else if (userRole === "Owner") {
      return [
        { id: 1, name: "Home", url: "/" },
        { id: 2, name: "Owner Dashboard", url: "/ownerDashboard" },
        { id: 3, name: "Add Turf", url: "/addTurf" },
        { id: 4, name: "Booking History", url: "/ownerTurfBookingHistory" },
        { id: 5, name: "User Profile", url: "/user" },
      ];
    } else {
      return [
        { id: 1, name: "Home", url: "/" },
        { id: 2, name: "Contact Us", url: "/contact" },
        { id: 3, name: "FAQ", url: "/faq" },
      ]; // Default for unauthenticated users
    }
  };

  useEffect(() => {
    const navItems = getStaticNavBarData();
    setNavBarData(navItems); // Set static nav items based on login status
  }, []);

  const handleClick = () => {
    navigate("/turfDetail");
  };

  return (
    <div className="home-page">
     

 <NavBarComponent/>{" "}
      
      <div className="home-first-section">
        <div className="text-section">
          <div className="first-banner-text">
            Find the Perfect Turf For Every Game
          </div>
          <div className="second-banner-text">
            Explore and book turfs near You
          </div>
          <ButtonComponent btnName={"Find Your turf"} />
        </div>
        <div className="image-section">
          <div className="home-first-banner">
            <img src="home_image.png" alt="homeimage" />
          </div>
        </div>
      </div>
      <div className="home-first-section">
        <div className="text-section">
          <div className="home-first-banner">
            <img src="home_image2.png" alt="homeimage" />
          </div>
        </div>
        <div className="image-section">
          <div className="first-banner-text">
            Book Your Turf And Host The Match
          </div>
          <div className="second-banner-text">
            Explore and book turfs near You
          </div>
          <ButtonComponent btnName={"Book Your turf"} onClick={handleClick} />
        </div>
      </div>
      <div className="host-the-match">
        <CardComponent>
          <h2>Host The Match</h2>
          <div className="host-card">
            <div>Never Play the Short Hand Again</div>
            <div>
              Never Play the Short Hand Again, Post your match and start playing
              with other teams
            </div>
            <div className="host-image">
              <img src="host_image.png" alt="host_image" />
            </div>
          </div>
        </CardComponent>
      </div>
      <div className="perfect-turf-card">
        <CardComponent>
          <div className="perfect-card-data">
            <div className="perfect-text-card">
              <div className="perfect-text1">
                Never Play the Short Hand Again
              </div>
              <div className="perfect-text2">
                Never Play the Short Hand Again, Post your match and start
                playing with other teams
              </div>
            </div>
            <div className="perfect-images">
              <div className="round-image">
                <img src="host_image.png" alt="host_image" />
                <img src="home_image.png" alt="home_image" />
                <img src="ttt_logo.png" alt="ttt_logo" />
              </div>
            </div>
          </div>
        </CardComponent>
      </div>
      <div className="home-first-section">
        <div className="text-section">
          <div className="home-first-banner">
            <img src="section5_image.png" alt="homeimage" />
          </div>
        </div>
        <div className="fifth_right-section">
          <div className="fifth-banner-text">
            Unlock Premium subscription with Toss Turf Subscription.
          </div>
          <div className="second-banner-text">
            Explore and book turfs near You.
          </div>
          <div>
            Never miss your preferred time slot! With Toss Turf Subscription.
          </div>
          <div>
            Never miss your preferred time slot! With Toss Turf Subscription.
          </div>
          <div>
            Never miss your preferred time slot! With Toss Turf Subscription.
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default HomePageComponent;
