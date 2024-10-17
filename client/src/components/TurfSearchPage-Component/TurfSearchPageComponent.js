import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FooterComponent from "../footer-component/FooterComponent";
import NavBarComponent from "../navigation-component/NavBarComponent";
// import { graphQLCommand } from "../../util";
import "./TurfSearchPageComponent.css";
import TurfCardComponent from "../TurfCard-Component/TurfCardComponent";

const TurfSearchPageComponent = () => {
  const [navBarData, setNavBarData] = useState([]);
  const [turfs, setTurfs] = useState([]);
  const [filteredTurfs, setFilteredTurfs] = useState([]);

  // Hardcoded data for navigation items
  const navItems = [
    { id: 1, name: "Home", url: "/" },
    { id: 2, name: "Contact Us", url: "/contact" },
    { id: 3, name: "FAQs", url: "/faq" },
    { id: 4, name: "About Us", url: "/about" },
    // Add more as needed
  ];

  // Hardcoded data for turfs
  const turfData = [
    { id: 1, name: "Tiki pika", location: "Cambridge", price: 18, rating: 4.2, sport: "Football", imageUrl: `${process.env.PUBLIC_URL}/assests/images/turf1.jpg` },
    { id: 2, name: "Kitchener Courts", location: "Kitchener", price: 20, rating: 4.5, sport: "Basketball", imageUrl: `${process.env.PUBLIC_URL}/assests/images/turf2.jpg` },
    { id: 3, name: "Waterloo Athletic Zone", location: "Waterloo", price: 19, rating: 4.1, sport: "Soccer", imageUrl: `${process.env.PUBLIC_URL}/assests/images/turf1.jpg` },
    { id: 4, name: "Tri-City Sports Dome", location: "Cambridge", price: 22, rating: 4.4, sport: "Football", imageUrl: `${process.env.PUBLIC_URL}/assests/images/turf2.jpg` },
    { id: 5, name: "Preston Indoor Courts", location: "Kitchener", price: 17, rating: 4.3, sport: "Badminton", imageUrl: `${process.env.PUBLIC_URL}/assests/images/turf1.jpg` },
    { id: 6, name: "Another Turf", location: "Waterloo", price: 18, rating: 4.0, sport: "Basketball", imageUrl: `${process.env.PUBLIC_URL}/assests/images/turf2.jpg` },
  ];

  // Commented out fetching functions
  // const fetchNavBarData = async () => {
  //   const query = `
  //     query {
  //       getNavItems {
  //         id
  //         name
  //         url
  //       }
  //     }
  //   `;
  //   const data = await graphQLCommand(query);
  //   setNavBarData(data.getNavItems || []);
  // };

  // const fetchTurfData = async () => {
  //   const query = `
  //     query {
  //       getTurfs {
  //         id
  //         name
  //         location
  //         price
  //         rating
  //         sport
  //         imageUrl
  //       }
  //     }
  //   `;
  //   const data = await graphQLCommand(query);
  //   setTurfs(data.getTurfs || []);
  //   setFilteredTurfs(data.getTurfs || []);
  // };

  const handleFilterBySport = (sport) => {
    setFilteredTurfs(turfs.filter((turf) => turf.sport === sport));
  };

  useEffect(() => {
    // Temporary hardcoded data assignment
    setNavBarData(navItems);
    setTurfs(turfData);
    setFilteredTurfs(turfData);

    // Uncomment these when ready to fetch from the database
    // fetchNavBarData();
    // fetchTurfData();
  }, []);

  return (
    <div>
        <NavBarComponent navBarData={navBarData} className="nav-bar"/>

      <div 
        className="hero-section"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/assests/images/hero-image.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '700px',
          position: 'relative'
        }}
      >
        <div className="hero-content">
          <h1>Find Your Perfect Turf</h1>
          <p>Book the best spots for your sports games with ease.</p>
          <div className="search-bar">
            <select>
              <option>Select the City</option>
              <option>Kitchener</option>
              <option>Cambridge</option>
              <option>Waterloo</option>
            </select>
            <select>
              <option>Select Sport</option>
              <option>Football</option>
              <option>Basketball</option>
              <option>Soccer</option>
              <option>Badminton</option>
            </select>
            <button>Search</button>
          </div>
        </div>
      </div>

      <div className="new-turf-section">
        <div className="new-turf-card" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/assests/images/football.jpg)` }}
             onClick={() => handleFilterBySport("Football")}>
          <div className="tag">New Turf</div>
          <div className="turf-info">
            <h3>Football</h3>
            <p>Book turf and score like a pro!</p>
          </div>
        </div>
        <div className="new-turf-card" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/assests/images/badminton.jpg)` }}
             onClick={() => handleFilterBySport("Badminton")}>
          <div className="tag">New Turf</div>
          <div className="turf-info">
            <h3>Badminton</h3>
            <p>Smash your way to victory!</p>
          </div>
        </div>
        <div className="new-turf-card" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/assests/images/basketball.jpg)` }}
             onClick={() => handleFilterBySport("Basketball")}>
          <div className="tag">New Turf</div>
          <div className="turf-info">
            <h3>Basketball</h3>
            <p>Dominate the court!</p>
          </div>
        </div>
      </div>

      <h1 className="turf-list-heading">Featured Turfs Nearby</h1>

      <div className="turf-list">
        {filteredTurfs.map((turf) => (
          <Link to={`/turf/${turf.id}`} key={turf.id} className="turf-card-link">
            <TurfCardComponent
              imageUrl={turf.imageUrl}
              sport={turf.sport}
              name={turf.name}
              location={turf.location}
              rating={turf.rating}
              price={turf.price}
            />
          </Link>
        ))}
      </div>

      <FooterComponent />
    </div>
  );
};

export default TurfSearchPageComponent;
