import React from 'react';
import './ScrollerComponent.css';
import CardComponent from "../Card-Component/CardComponent";

const ScrollerComponent = ({ items }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [visibleCards, setVisibleCards] = React.useState(3);

  React.useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth <= 480) {
        setVisibleCards(1); // Mobile: 1 card
      } else if (window.innerWidth <= 768) {
        setVisibleCards(2); // Tablet: 2 cards
      } else {
        setVisibleCards(3); // Default: 3 cards
      }
    };

    window.addEventListener('resize', updateVisibleCards);
    updateVisibleCards(); // Initial call

    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < items.length - visibleCards ? prevIndex + 1 : prevIndex));
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  return (
    <div className="scroller-wrapper">
      <button className="scroll-button left" onClick={handlePrev}>
        &#8249; 
      </button>
      <div className="scroller-container">
        <CardComponent>
          <div
            className="scroller"
            style={{ transform: `translateX(-${currentIndex * (100 / visibleCards)}%)` }}
          >
            {items.map((item, index) => (
              <div key={index} className="card">
                <img src={item.image} alt={item.title} className="card-image" />
                <div className="card-content">
                  <h3>{item.title}</h3>
                  <p>{item.location}</p>
                  <p>Rating: {item.rating} ⭐</p>
                  <p>{item.price}</p>
                  <p className="discount">{item.discount}</p>
                </div>
              </div>
            ))}
          </div>
        </CardComponent>
      </div>
      <button className="scroll-button right" onClick={handleNext}>
        &#8250; 
      </button>
    </div>
  );
};

export default ScrollerComponent;
