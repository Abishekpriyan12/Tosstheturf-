import React from 'react';
import './TurfCardComponent.css';
import offerIcon from '../../../assests/icons/offericon.png';

const TurfCardComponent = ({ imageUrl, name, location, sport, rating, price,firstTimeDiscount }) => {
  
  return (
    <div className="turf-card">
      
      <div className="turf-image">
  <img src={imageUrl} alt={name} className="turf-main-img" />
  <div className="sport-tag">
    {sport}{" "}
    {sport === "Football" && "⚽"}
    {sport === "Cricket" && "🏏"}
    {sport === "Basketball" && "🏀"}
    {sport === "Tennis" && "🎾"}
  </div>
</div>
      
      {/* Info Section */}
      <div className="turf-info">
        <div className="turf-title-rating">
          <h3><span className='card-name-turf'>{name}</span>, <span className="location">{location}</span></h3>
          <div className="turf-rating">
          ★ <span>{rating}</span> 
          </div>
        </div>
        <div className="turf-price-tag">
          <div className="turf-tag">
            <span>7 VS 7</span>
          </div>
          <div className="turf-price">
            ${price} / Hr
          </div>
        </div>
      </div>

      {/* Divider Line */}
      <div className="line"></div>

      {/* Discount Section */}
      <div className="turf-discount">
        <img src={offerIcon} alt="Discount Icon" className="discountIcon" />
        {firstTimeDiscount}% OFF ON FIRST TIME
      </div>
    </div>
  );
};

export default TurfCardComponent;
