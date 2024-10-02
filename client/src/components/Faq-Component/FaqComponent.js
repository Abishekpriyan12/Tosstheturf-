import React, { useState } from "react";
import NavBarComponent from "../navigation-component/NavBarComponent";
import FooterComponent from "../footer-component/FooterComponent";
import CardComponent from "../Card-Component/CardComponent";
import ButtonComponent from "../Button-Component/ButtonComponent";
import "./FaqComponent.css";

const FaqComponent = () => {
  const navBarData = [
    { name: "About us", url: "/" },
    { name: "Venue", url: "/" },
    { name: "Contact Us", url: "/contact" },
    { name: "Deals", url: "/" },
  ];

  const faqData = [
    {
      question: "How do I book a turf?",
      answer: (
        <p>
          "To book a turf, simply select your preferred sport, <br />
          choose a venue, pick a time slot, and complete the booking through our
          secure payment system.",
        </p>
      ),
    },
    {
      question: "Can I cancel or reschedule my booking?",
      answer: (
        <p>
          {" "}
          "Yes, you can cancel or reschedule your booking up to 24 hours before
          your scheduled time.
          <br /> Visit your account page and select the booking you want to
          modify.",
        </p>
      ),
    },
    {
      question: "Do I need to bring my own equipment?",
      answer: (
        <p>
          "Most venues provide basic equipment like nets and goals.
          <br /> However, players are encouraged to bring personal equipment
          like rackets,balls,or shoes.",
        </p>
      ),
    },
    {
      question: "Are group bookings allowed?",
      answer: (
        <p>
          "Yes! You can book the turf for individual or group sessions. <br />
          For larger groups or special events, contact us for custom booking
          options.",
        </p>
      ),
    },
    {
      question:
        "What happens if the turf is unavailable during my booked time?",
      answer: (
        <p>
          "In the rare event of turf unavailability,
          <br /> we will notify you immediately and provide options to
          reschedule or receive a full refund.",
        </p>
      ),
    },
  ];
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <>
      <NavBarComponent navBarData={navBarData} />
      <CardComponent width="60%" height="500px">
      <ButtonComponent btnName={"Pay"}></ButtonComponent>
        <div className="faq-container">
          <h1>Frequently Asked Questions</h1>
          <div className="accordion">
            {faqData.map((faq, index) => (
              <div key={index} className="accordion-item">
                <button
                  className={`accordion-button ${
                    activeIndex === index ? "active" : ""
                  }`}
                  onClick={() =>
                    setActiveIndex(activeIndex === index ? null : index)
                  }
                >
                  {faq.question}
                </button>
                {activeIndex === index && (
                  <div className="accordion-content">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardComponent>
      <FooterComponent />
    </>
  );
};

export default FaqComponent;
