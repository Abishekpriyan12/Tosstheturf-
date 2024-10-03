import React, { useState } from "react";
import './SliderComponent.css'
const SliderComponent = ({ slides }) => {
    console.log(slides)
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? slides.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === slides.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <div className="slider-container">
      <div
        className="slider"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div className="slide" key={index}>
            <img src={slide.src} alt={slide.alt} />
          </div>
        ))}
      </div>
      <button className="prev-btn" onClick={goToPrevious}>
        &#10094;
      </button>
      <button className="next-btn" onClick={goToNext}>
        &#10095;
      </button>
    </div>
  );
};

export default SliderComponent;
