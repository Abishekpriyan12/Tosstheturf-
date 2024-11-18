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
  const [reviewText, setReviewText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [filteredTurfs, setFilteredTurfs] = useState([]);
  const [visibleReviews, setVisibleReviews] = useState(1);

  const handleViewMore = () => {
    setVisibleReviews((prev) => prev + 2);
  };

  // Fetch Turf Details
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
      setError("Failed to fetch turf details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fetch Reviews
  const fetchReviews = useCallback(async () => {
    const query = `
      query ($turfId: ID!) {
        getReviews(turfId: $turfId) {
          averageRating
          reviews {
            username
            rating
            review
            createdAt
          }
        }
      }
    `;
    const variables = { turfId: id };

    try {
      const data = await graphQLCommand(query, variables);
      setReviews(data.getReviews.reviews || []);
      setAverageRating(data.getReviews.averageRating);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  }, [id]);

  // Fetch Related Turfs
  const fetchFilteredTurfs = useCallback(async () => {
    const query = `
      query {
        getTurfs {
          id
          turfName
          location
          mainImage
          sportType
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

  // Submit Review
  const submitReview = async () => {
    const mutation = `
      mutation ($turfId: ID!, $username: String!, $rating: Float!, $review: String!) {
        addReview(turfId: $turfId, username: $username, rating: $rating, review: $review) {
          username
          rating
          review
        }
      }
    `;

    const variables = {
      turfId: id,
      username: sessionStorage.getItem("username"),
      rating: userRating,
      review: reviewText,
    };

    try {
      await graphQLCommand(mutation, variables);
      setIsModalOpen(false);
      fetchReviews(); // Refresh reviews
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  const handleStarClick = (rating) => {
    setUserRating(rating);
  };

  useEffect(() => {
    fetchTurfDetail();
    fetchReviews();
  }, [fetchTurfDetail, fetchReviews]);

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
              <span className="rating">★ {averageRating.toFixed(1) || "N/A"}</span>
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
  {reviews.length === 0 && (
    <div className="no-reviews">No reviews yet. Be the first one to review!</div>
  )}
  <div className="reviews-header">
    <h3 className="reviews-title">
      Reviews <span className="reviews-count">({reviews.length})</span>
    </h3>
    <div className="add-review">
      <ButtonComponent
        btnName={"Add Review"}
        onClick={() => setIsModalOpen(true)}
      ></ButtonComponent>
    </div>
  </div>

  <div className="reviews-section">
    {reviews.slice(0, visibleReviews).map((review, index) => (
      <div key={index} className="review-item">
        <strong className="username-review">@{review.username}</strong>
        <span className="rating"> ★ {review.rating.toFixed(1)}</span>
        <div className="review-box">"{review.review}"</div>
      </div>
    ))}
    {visibleReviews < reviews.length && (
      <i onClick={handleViewMore} className="view-more">
        View More Reviews
      </i>
    )}
  </div>
</div>

      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Your Review</h3>
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
            <textarea
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>
            <button onClick={submitReview}>Submit</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

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
