import React, { useEffect, useState } from "react";
import "./AboutUsComponent.css";
import NavBarComponent from "../navigation-component/NavBarComponent";
import FooterComponent from "../footer-component/FooterComponent";
import CardComponent from "../Card-Component/CardComponent";
import { graphQLCommand } from "../../util";

const HeroSection = () => {
    return (
        <section className="hero-section">
            <video autoPlay muted loop className="hero-video">
                <source src="aboutus_video.mp4" type="video/mp4"/>
                
            </video>
            <div className="hero-text">
                <h1>Join Teams, Reserve Turf, and Elevate Your Game</h1>
            </div>
        </section>
    );
};

const MissionSection = () => {
    return (
        <section className="mission-section">
            <div className="mission-container">
                <div className="mission-text">
                    <h2>Our mission</h2>
                    <p>
                        Our mission is to provide a simple and user-friendly platform for booking
                        turfs and organizing sports activities. We aim to connect players and teams,
                        making it easy to join matches or create tournaments. Our goal is to promote
                        active lifestyles and teamwork through seamless turf management.
                    </p>
                </div>
                <div className="mission-image">
                    <img src="aboutus_mission.jpg" alt="Basketball" />
                </div>
            </div>
        </section>
    );
};

const TeamSection = () => {
    const teamMembers = [
      { name: 'Parvaditya, Aksha Vinubhai', image: 'aboutus_img1.jpg' },
      { name: 'Kalbian, Abhishek Priyan', image: 'aboutus_img1.jpg' },
      { name: 'Varatharajan, Viswanathan', image: 'aboutus_img1.jpg' },
      { name: 'Mehta, Suraj Hemantkumar', image: 'aboutus_img1.jpg' },
    ];
  
    return (
      <section className="team-section">
        <h2>Meet our Team</h2>
        <div className="team-cards">
          {teamMembers.map((member, index) => (
            <CardComponent
              key={index}
              width="320px"
              backgroundColor="#222"
            >
              <img
                src={member.image}
                alt={member.name}
                className="team-image"
              />
              <h3>{member.name}</h3>
            </CardComponent>
          ))}
        </div>
      </section>
    );
  };
const AboutUsComponent = () => {
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
        <div className="aboutuspage-page">
           <NavBarComponent navBarData={navBarData} />{" "}
            <HeroSection></HeroSection>
            <MissionSection></MissionSection>
            <TeamSection></TeamSection>
            <FooterComponent></FooterComponent>
         </div>
    );
};

export default AboutUsComponent;
