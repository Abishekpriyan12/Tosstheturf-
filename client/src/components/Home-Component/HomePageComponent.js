import React, { useEffect, useState } from "react";
import ButtonComponent from "../Button-Component/ButtonComponent";
import NavBarComponent from "../navigation-component/NavBarComponent";
import "./HomePageComponent.css";
import CardComponent from "../Card-Component/CardComponent";
import FooterComponent from "../footer-component/FooterComponent";
import { useNavigate } from "react-router-dom";
import { graphQLCommand } from "../../util";

const HomePageComponent = () => {
  const [navBarData, setNavBarData] = useState([]);
  const navigate = useNavigate();

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

  const handleClick = () => {
    navigate("/turfDetail");
  };

  return (
    <div className="home-page">
      <NavBarComponent navBarData={navBarData} />{" "}
      
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
