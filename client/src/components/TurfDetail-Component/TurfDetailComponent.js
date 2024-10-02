import React from "react";
import NavBarComponent from "../navigation-component/NavBarComponent";
import SliderComponent from "../slider-component/SliderComponent";
import ScrollerComponent from "../Scroller-Component/ScrollerComponent";

const TurfDetailComponent = () => {
  const navBarData = [
    { name: "About us", url: "/" },
    { name: "Venue", url: "/" },
    { name: "Contact Us", url: "/contact" },
    { name: "Deals", url: "/" },
  ];

  const sliderData = [
    {
      src: "home_image2.png",
      alt: "home_image",
    },
    {
      src: "home_image.png",
      alt: "home_image",
    },
    {
      src: "home_image2.png",
      alt: "home_image",
    },
  ];
  const items = [
    {
      title: 'Tri-City Sports Dome',
      location: 'Cambridge',
      rating: '4.2',
      price: '$18 / Hr',
      discount: '10% OFF ON FIRST TIME',
      image: 'home_Image2.png',
    },
    {
      title: 'Preston Indoor Courts',
      location: 'Kitchener',
      rating: '4.2',
      price: '$18 / Hr',
      discount: '10% OFF ON FIRST TIME',
      image: 'home_Image.png',
    },
    {
      title: 'Tiki Pika',
      location: 'Cambridge',
      rating: '4.2',
      price: '$18 / Hr',
      discount: '10% OFF ON FIRST TIME',
      image: 'home_Image2.png',
    },
    {
        title: 'Tiki Pika',
        location: 'Cambridge',
        rating: '4.2',
        price: '$18 / Hr',
        discount: '10% OFF ON FIRST TIME',
        image: 'home_Image.png',
      },
  ];
  return (
    <div className="turf-detail">
      <NavBarComponent navBarData={navBarData}></NavBarComponent>
      <SliderComponent slides={sliderData}></SliderComponent>
      <ScrollerComponent items={items}></ScrollerComponent>
    </div>
  );
};

export default TurfDetailComponent;
