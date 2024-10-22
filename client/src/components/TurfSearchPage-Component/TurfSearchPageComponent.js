import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FooterComponent from "../footer-component/FooterComponent";
import NavBarComponent from "../navigation-component/NavBarComponent";
import { graphQLCommand } from "../../util"; // Ensure this is properly implemented
import "./TurfSearchPageComponent.css";
import TurfCardComponent from "../TurfCard-Component/TurfCardComponent";

const TurfSearchPageComponent = () => {
  const [navBarData, setNavBarData] = useState([]);
  const [turfs, setTurfs] = useState([]);
  const [filteredTurfs, setFilteredTurfs] = useState([]);

  const fetchTurfData = async () => {
    const query = `
      query {
        getTurfs {
          id
          turfName
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
          rating
          firstTimeDiscount
        }
      }
    `;
    try {
      const data = await graphQLCommand(query);
      setTurfs(data.getTurfs || []);
      setFilteredTurfs(data.getTurfs || []);
    } catch (error) {
      console.error("Error fetching turf data:", error);
    }
  };

  const handleFilterBySport = (sport) => {
    setFilteredTurfs(turfs.filter((turf) => turf.sportType === sport));
  };
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
    fetchTurfData();
    fetchNavBarData();
  }, []);

  return (
    <div>
      <NavBarComponent navBarData={navBarData} className="nav-bar" />

      <div
        className="hero-section"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/assests/images/hero-image.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "700px",
          position: "relative",
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
        <div
          className="new-turf-card"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/assests/images/football.jpg)`,
          }}
          onClick={() => handleFilterBySport("Football")}
        >
          <div className="tag">New Turf</div>
          <div className="turf-info">
            <h3>Football</h3>
            <p>Book turf and score like a pro!</p>
          </div>
        </div>
        <div
          className="new-turf-card"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/assests/images/badminton.jpg)`,
          }}
          onClick={() => handleFilterBySport("Badminton")}
        >
          <div className="tag">New Turf</div>
          <div className="turf-info">
            <h3>Badminton</h3>
            <p>Smash your way to victory!</p>
          </div>
        </div>
        <div
          className="new-turf-card"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/assests/images/basketball.jpg)`,
          }}
          onClick={() => handleFilterBySport("Basketball")}
        >
          <div className="tag">New Turf</div>
          <div className="turf-info">
            <h3>Basketball</h3>
            <p>Dominate the court!</p>
          </div>
        </div>
      </div>

      <h1 className="turf-list-heading">Featured Turfs Nearby</h1>

      <div className="turf-list">
        {filteredTurfs.length > 0 ? (
          filteredTurfs.map((turf) => (
            <Link
              to={`/turf/${turf.id}`}
              key={turf.id}
              className="turf-card-link"
            >
              <TurfCardComponent
                imageUrl={turf.mainImage}
                sport={turf.sportType}
                name={turf.turfName}
                location={turf.address}
                rating={turf.rating}
                price={turf.price}
              />
            </Link>
          ))
        ) : (
          <p>No turfs available</p>
        )}
      </div>

      <FooterComponent />
    </div>
  );
};

export default TurfSearchPageComponent;
