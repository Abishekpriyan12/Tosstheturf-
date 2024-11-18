import React, { useState, useEffect, useCallback } from "react";
import { graphQLCommand } from "../../../util";
import { useParams, useNavigate } from "react-router-dom";
import SliderComponent from "../../Reusable-Components/slider-component/SliderComponent";
import ButtonComponent from "../../Reusable-Components/Button-Component/ButtonComponent";
import ScrollerComponent from "../../Reusable-Components/Scroller-Component/ScrollerComponent";
import offerIcon from "../../../assests/icons/offericon.png";
import "./TurfDetailComponent.css";

const TurfDetailComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [turfDetail, setTurfDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [filteredTurfs, setFilteredTurfs] = useState([]);

  const fetchTurfDetail = useCallback(async () => {
    const query = `
      query ($id: ID!) {
        turf(id: $id) {
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
          averageRating
          firstTimeDiscount
        }
      }
    `;

    const variables = { id };

    try {
      const data = await graphQLCommand(query, variables);
      if (!data.turf) {
        setError("Turf not found.");
      } else {
        setTurfDetail(data.turf);
      }
    } catch (err) {
      console.error("Error fetching turf details:", err);
      setError(
        `Failed to fetch turf details: ${err.message || "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchFilteredTurfs = useCallback(async () => {
    const query = `
      query {
        getTurfs {
          id
          turfName
          location
          mainImage
          sportType
          averageRating
          price
          firstTimeDiscount
        }
      }
    `;

    try {
      const data = await graphQLCommand(query);
      if (turfDetail && data.getTurfs) {
        const relatedTurfs = data.getTurfs.filter(
          (turf) =>
            turf.location.toLowerCase() === turfDetail.location.toLowerCase() &&
            turf.id !== turfDetail.id
        );
        setFilteredTurfs(relatedTurfs);
      }
    } catch (error) {
      console.error("Error fetching related turfs:", error);
    }
  }, [turfDetail]);

  const updateTurfRating = async () => {
    const mutation = `
      mutation ($id: ID!, $rating: Float!) {
        updateTurfRating(id: $id, rating: $rating) {
          id
          averageRating
        }
      }
    `;

    const variables = { id, rating: userRating };

    try {
      const data = await graphQLCommand(mutation, variables);
      setTurfDetail((prev) => ({
        ...prev,
        averageRating: data.updateTurfRating.averageRating,
      }));
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  const handleStarClick = (rating) => {
    setUserRating(rating);
  };

  useEffect(() => {
    fetchTurfDetail();
  }, [fetchTurfDetail]);

  useEffect(() => {
    if (turfDetail) fetchFilteredTurfs();
  }, [fetchFilteredTurfs, turfDetail]);

  if (loading) return <div>Loading turf details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!turfDetail) return <div>No turf details available.</div>;

  return (
    <div className="turf-detail">
      <div className="back-button">
        <ButtonComponent btnName={"Back"} onClick={() => navigate(-1)} />
      </div>
      <SliderComponent class="slider-comp" slides={turfDetail.sliderImages} />

      <div className="info-section">
        <div className="turf-header">
          <div className="turf-details">
            <h1>
              {turfDetail.turfName}, <span>{turfDetail.location}</span>
            </h1>
            <div className="sport-type-rating">
              <span className="badge">{turfDetail.sportType}</span>
              <span className="average-rating">
                ★ {turfDetail.averageRating.toFixed(1)}
              </span>
            </div>
          </div>
          <ButtonComponent
            btnName="Book Now"
            onClick={() => navigate(`/bookingPage/${id}`)}
          />
        </div>

        <div className="address-section">
          <h3>Address</h3>
          <p>{turfDetail.address}</p>
          <div className="address-icons">
            <img src={offerIcon} alt="Discount Icon" className="discountIcon" />
            <p>{turfDetail.phone}</p>
          </div>
        </div>

        <div className="amenities-section">
          <h3>Amenities</h3>
          <ul className="amenities-list">
            {turfDetail.amenities.parking && (
              <li>
                <i className="fas fa-parking"></i> Parking
              </li>
            )}
            {turfDetail.amenities.drinkingWater && (
              <li>
                <i className="fas fa-water"></i> Drinking Water
              </li>
            )}
            {turfDetail.amenities.spareKits && (
              <li>
                <i className="fas fa-toolbox"></i> Spare Kits
              </li>
            )}
            {turfDetail.amenities.nonAC && (
              <li>
                <i className="fas fa-fan"></i> Non A/C
              </li>
            )}
          </ul>
        </div>

        <div className="timing-section">
          <h3>Timings</h3>
          <p>{turfDetail.timing}</p>
        </div>

        <div className="rating-section">
          <h3>Rate this Turf</h3>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= userRating ? "star filled" : "star"}
                onClick={() => handleStarClick(star)}
              >
                ★
              </span>
            ))}
          </div>
          <button onClick={updateTurfRating}>Submit Rating</button>
        </div>
      </div>

      <div className="related-turfs-section">
        {filteredTurfs.length > 0 ? (
          <ScrollerComponent items={filteredTurfs} />
        ) : (
          <p>No related turfs available in this location.</p>
        )}
      </div>
    </div>
  );
};

export default TurfDetailComponent;
