import React from 'react';
import './TurfCardComponent.css';

const TurfCardComponent = ({ imageUrl, name, location, sport, rating, price }) => {
  return (
    <div className="turf-card">
      {/* Image Section */}
      <div className="turf-image">
        <img src={imageUrl} alt={name} className="turf-main-img" />
        <div className="sport-tag">
          {sport} ⚽
        </div>
      </div>
      
      {/* Info Section */}
      <div className="turf-info">
        <div className="turf-title-rating">
          <h3>{name}, <span className="location">{location}</span></h3>
          <div className="turf-rating">
            <span>{rating}</span> ★
          </div>
        </div>
        <div className="turf-price-tag">
          <div className="turf-price">
            ${price} / Hr
          </div>
          <div className="turf-tag">
            <span>7 VS 7</span>
          </div>
        </div>
      </div>

      {/* Divider Line */}
      <div className="line"></div>

      {/* Discount Section */}
      <div className="turf-discount">
        <img src="/assets/icons/coupon.png" alt="Discount Icon" className="discountIcon" />
        10% OFF ON FIRST TIME
      </div>
    </div>
  );
};

export default TurfCardComponent;
