import React from 'react';
import './ScrollerComponent.css';

const ScrollerComponent = ({ items }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < items.length - 3 ? prevIndex + 1 : prevIndex));
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  return (
    <div className="scroller-wrapper">
      <button className="scroll-button left" onClick={handlePrev}>
        &#8249; {/* Left arrow */}
      </button>
      <div className="scroller-container">
        <div
          className="scroller"
          style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
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
      </div>
      <button className="scroll-button right" onClick={handleNext}>
        &#8250; {/* Right arrow */}
      </button>
    </div>
  );
};

export default ScrollerComponent;
