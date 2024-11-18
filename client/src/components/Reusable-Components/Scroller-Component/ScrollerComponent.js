import React, { useEffect, useState } from 'react';
import './ScrollerComponent.css';

const ScrollerComponent = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
console.log(items)
  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth <= 480) {
        setVisibleCards(1); 
      } else if (window.innerWidth <= 768) {
        setVisibleCards(2); 
      } else {
        setVisibleCards(3); 
      }
    };

    window.addEventListener('resize', updateVisibleCards);
    updateVisibleCards();

    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < items.length - visibleCards ? prevIndex + 1 : prevIndex));
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  const showArrows = items.length > visibleCards;

  return (
    <div className="scroller-wrapper">
      {showArrows && (
        <button className="scroll-button left" onClick={handlePrev}>
          &#8249;
        </button>
      )}
      <div className="scroller-container">
        <div
          className="scroller"
          style={{ transform: `translateX(-${currentIndex * (100 / visibleCards)}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="card">
              <img src={item.mainImage} alt={item.turfName} className="card-image" />
              
              <div className="sport-type">
                {item.sportType}{" "}
                {item.sportType === "Football" && "⚽"}
                {item.sportType === "Cricket" && "🏏"}
                {item.sportType === "Basketball" && "🏀"}
                {item.sportType === "Tennis" && "🎾"}
              </div>

              <div className="card-content">
                <h3>
                  {item.turfName}, <span>{item.location}</span>
                  <span className="rating">★ {item.averageRating.toFixed(1)}</span>
                </h3>
                <div className="rating-price">
                  <span className="vs-button">7 VS 7</span>
                  <span className="price">${item.price} / Hr</span>
                </div>
                <div className="discount-line"></div>
                {Number(item.firstTimeDiscount) > 0 && (
                  <p className="discount">
                    {item.firstTimeDiscount}% OFF ON FIRST TIME
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {showArrows && (
        <button className="scroll-button right" onClick={handleNext}>
          &#8250;
        </button>
      )}
    </div>
  );
};

export default ScrollerComponent;
