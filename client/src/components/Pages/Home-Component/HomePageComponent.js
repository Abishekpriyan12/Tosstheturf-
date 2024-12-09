import React, { useState } from "react";
import ButtonComponent from "../../Reusable-Components/Button-Component/ButtonComponent";
import NavBarComponent from "../../Reusable-Components/navigation-component/NavBarComponent";
import "./HomePageComponent.css";
import CardComponent from "../../Reusable-Components/Card-Component/CardComponent";
import FooterComponent from "../../Reusable-Components/footer-component/FooterComponent";
import { useNavigate } from "react-router-dom";
import ChatBot from "../../Pages/ChatBot/ChatBot"; 
import network from "../../../assests/images/NETWORK.png"
import image3 from "../../../assests/images/Image3.png"

const HomePageComponent = () => {
  const navigate = useNavigate();
  const [showChatBot, setShowChatBot] = useState(false);

  const handleClick = () => {
    navigate("/turfDetail");
  };

  const toggleChatBot = () => {
    setShowChatBot(!showChatBot); // Toggle ChatBot visibility
  };

  return (
    <div className="home-page">
      <NavBarComponent />

      <div className="home-first-section">
        <div className="overlay"></div>
        <div className="text-section">
        <div className="first-banner-text">
           FIND THE PERFECT TURF FOR <br />
          EVERY <span className="highlight-green">GAME</span>
        </div>
        <div className="second-banner-text">
           Explore and book turfs near You
        </div>
          <ButtonComponent btnName={"Find Your turf"} />
        </div>
        {/* <div className="image-section">
          <div className="home-first-banner">
            <img src="home_image.png" alt="homeimage" />
          </div>
        </div> */}
      </div>

      <div className="home-second-section">
        <div className="text-section">
          {/* <div className="home-first-banner">
            <img src="home_image2.png" alt="homeimage" />
          </div> */}
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
      <div className="text-section">
            <h1>Be Your Own <span className="highlight-green">Host</span></h1>
          </div>
        <CardComponent>   
          <div className="host-card">
            <div className="Home-third-header">Never Play the Short Hand Again</div>
            <div className="Home-third-sub">
              Never Play the Short Hand Again, Post your match and start playing
              with other teams
            </div>
            <div className="host-image">
              <img src={network} alt="host_image" />
            </div>
          </div>
        </CardComponent>
      </div>

      <div className="perfect-turf-card">
        <CardComponent>
          <div className="perfect-card-data">
            <div className="perfect-text-card">
              <div className="perfect-text1">
                 Find your perfect turf.
              </div>
              <div className="perfect-text2">
              Explore the top venues in your area, check out photos,<br /> 
              read reviews, and start hosting your game with just a tap
              </div>
            </div>
            <div className="perfect-images">
              <div className="round-image">
                <img src={image3} alt="host_image" />
                {/* <img src="home_image.png" alt="home_image" /> */}
                {/* <img src="ttt_logo.png" alt="ttt_logo" /> */}
              </div>
            </div>
          </div>
        </CardComponent>
      </div>

      <div className="home-third-section">
      <div className="overlay"></div>
        <div className="text-section">
          <div className="home-first-banner">
            {/* <img src="section5_image.png" alt="homeimage" /> */}
          </div>
        </div>
        <div className="fifth_right-section">
          <div className="fifth-banner-text">
            Unlock Premium subscription <br></br>
            with <span className="highlight-green">Toss Turf Subscription.</span>
          </div>
          <div className="second-banner-text">
          Get exclusive access to monthly bookings and 
          earn reward points every time you play
          </div>
          {/* <div>
          Monthly Subscription Benefits: Priority booking, discounted rates, exclusive turfs, and more.
          </div>
          <div>
            Never miss your preferred time slot! With Toss Turf Subscription.
          </div> */}
          {/* <div>
            Never miss your preferred time slot! With Toss Turf Subscription.
          </div> */}
        </div>
      </div>

      <FooterComponent />
      
      {/* ChatBot Icon */}
      <div className="chatbot-icon" onClick={toggleChatBot}>
        <img src="Chat_Icon.png" alt="ChatBot Icon" className="chatbot-icon-image" />
      </div>

      {/* Conditionally render the ChatBot component */}
      {showChatBot && <ChatBot />}
    </div>
  );
};

export default HomePageComponent;
