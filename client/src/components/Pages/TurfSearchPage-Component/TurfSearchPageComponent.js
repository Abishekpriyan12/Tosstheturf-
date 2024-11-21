import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FooterComponent from "../../Reusable-Components/footer-component/FooterComponent";
import NavBarComponent from "../../Reusable-Components/navigation-component/NavBarComponent";
import { graphQLCommand } from "../../../util";
import "./TurfSearchPageComponent.css";
import TurfCardComponent from "../TurfCard-Component/TurfCardComponent";

const TurfSearchPageComponent = () => {
  const [navBarData, setNavBarData] = useState([]);
  const [turfs, setTurfs] = useState([]);
  const [filteredTurfs, setFilteredTurfs] = useState([]);
  const [ratings, setRatings] = useState({});
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSport, setSelectedSport] = useState("");

  const fetchTurfData = async () => {
    const query = `
      query {
        getTurfs {
          id
          turfName
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
      setTurfs(data.getTurfs || []);
      setFilteredTurfs(data.getTurfs || []);
    } catch (error) {
      console.error("Error fetching turf data:", error);
    }
  };

  const fetchRatings = async () => {
    try {
      const query = `
        query {
          getTurfs {
            id
            turfName
          }
        }
      `;
      const data = await graphQLCommand(query);

      const ratingPromises = (data.getTurfs || []).map(async (turf) => {
        const ratingQuery = `
          query ($turfId: ID!) {
            getReviews(turfId: $turfId) {
              averageRating
            }
          }
        `;
        const variables = { turfId: turf.id };

        try {
          const ratingData = await graphQLCommand(ratingQuery, variables);
          return {
            id: turf.id,
            averageRating: ratingData.getReviews.averageRating || 0,
          };
        } catch (error) {
          console.error(`Error fetching rating for turf ${turf.id}:`, error);
          return { id: turf.id, averageRating: 0 };
        }
      });

      const ratingsData = await Promise.all(ratingPromises);
      const ratingsMap = {};
      ratingsData.forEach(({ id, averageRating }) => {
        ratingsMap[id] = averageRating;
      });
      setRatings(ratingsMap);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  const handleSearch = () => {
    const filtered = turfs.filter(
      (turf) =>
        (!selectedCity || turf.location === selectedCity) &&
        (!selectedSport || turf.sportType === selectedSport)
    );
    setFilteredTurfs(filtered);
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
    fetchRatings();
    fetchNavBarData();
  }, []);

  return (
    <div>
      <NavBarComponent
        navBarData={navBarData}
        className="search-page-nav-bar"
      />

      <div
        className="search-page-hero-section"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/assests/images/hero-image.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "250px",
          position: "relative",
        }}
      >
        <div className="search-page-hero-content">
          <h1>Find Your Perfect Turf</h1>
          <p>Book the best spots for your sports games with ease.</p>
          <div className="search-page-search-bar">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">Select the City</option>
              <option value="Kitchener">Kitchener</option>
              <option value="Cambridge">Cambridge</option>
              <option value="Waterloo">Waterloo</option>
            </select>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
            >
              <option value="">Select Sport</option>
              <option value="Football">Football</option>
              <option value="Basketball">Basketball</option>
              <option value="Cricket">Cricket</option>
              <option value="Tennis">Tennis</option>
            </select>
            <button
              onClick={() => {
                handleSearch();
                document
                  .getElementById("featured-turfs")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="search-page-new-turf-section">
        <div
          className="search-page-new-turf-card"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/assests/images/football.jpg)`,
          }}
          onClick={() => {
            setSelectedSport("Football");
            setFilteredTurfs(
              turfs.filter((turf) => turf.sportType === "Football")
            );
          }}
        >
          <div className="search-page-tag">New Turf</div>
          <div className="search-page-turf-info-search">
            <h3>Football</h3>
            <p>Book turf and score like a pro!</p>
          </div>
        </div>

        <div
          className="search-page-new-turf-card"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/assests/images/badminton.jpg)`,
          }}
          onClick={() => {
            setSelectedSport("Tennis");
            setFilteredTurfs(
              turfs.filter((turf) => turf.sportType === "Tennis")
            );
          }}
        >
          <div className="search-page-tag">New Turf</div>
          <div className="search-page-turf-info-search">
            <h3>Tennis</h3>
            <p>Smash your way to victory!</p>
          </div>
        </div>

        <div
          className="search-page-new-turf-card"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/assests/images/basketball.jpg)`,
          }}
          onClick={() => {
            setSelectedSport("Basketball");
            setFilteredTurfs(
              turfs.filter((turf) => turf.sportType === "Basketball")
            );
          }}
        >
          <div className="search-page-tag">New Turf</div>
          <div className="search-page-turf-info-search">
            <h3>Basketball</h3>
            <p>Dominate the court!</p>
          </div>
        </div>

        <div
          className="search-page-new-turf-card"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/assests/images/football.jpg)`,
          }}
          onClick={() => {
            setSelectedSport("Cricket");
            setFilteredTurfs(
              turfs.filter((turf) => turf.sportType === "Cricket")
            );
          }}
        >
          <div className="search-page-tag">New Turf</div>
          <div className="search-page-turf-info-search">
            <h3>Cricket</h3>
            <p>Hit it out of the park!</p>
          </div>
        </div>
      </div>

      <h1 className="search-page-turf-list-heading" id="featured-turfs">Featured Turfs Nearby</h1>

      <div className="search-page-turf-list">
        {filteredTurfs.length > 0 ? (
          filteredTurfs.map((turf) => (
            <Link
              to={`/turf/${turf.id}`}
              key={turf.id}
              className="search-page-turf-card-link"
            >
              <TurfCardComponent
                imageUrl={turf.mainImage}
                sport={turf.sportType}
                name={turf.turfName}
                location={turf.location}
                rating={ratings[turf.id] || "0.0"}
                price={turf.price}
                firstTimeDiscount={turf.firstTimeDiscount}
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
