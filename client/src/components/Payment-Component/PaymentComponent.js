import React, { useState } from "react";
import NavBarComponent from "../navigation-component/NavBarComponent";
import FooterComponent from "../footer-component/FooterComponent";
import ButtonComponent from "../Button-Component/ButtonComponent";
import CardComponent from "../Card-Component/CardComponent";
import "./PaymentComponent.css";

const PaymentComponent = () => {
  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    cvv: "",
    expiryYear: "",
    month: "",
    postalCode: "",
  });

  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  const navBarData = [
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    { name: "Contact Us", url: "/contact" },
    { name: "Deals", url: "/deals" },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = (e) => {
    e.preventDefault();

    const { name, cardNumber, cvv, expiryYear, month, postalCode } = formData;

    if (!name || !cardNumber || !cvv || !expiryYear || !month || !postalCode) {
      setPaymentError("Please fill in all fields.");
      setPaymentSuccess(null);
      return;
    }

    if (cardNumber.length !== 16 || isNaN(cardNumber)) {
      setPaymentError("Invalid card number.");
      setPaymentSuccess(null);
      return;
    }

    if (cvv.length !== 3 || isNaN(cvv)) {
      setPaymentError("Invalid CVV.");
      setPaymentSuccess(null);
      return;
    }

    setPaymentError(null);
    setPaymentSuccess("Payment successful!");
  };

  return (
    <div>
      {/* Navigation Bar */}
      <NavBarComponent navBarData={navBarData} />

      <div className="payment-body">
        <h2>PAYMENT CONFIRMATION</h2>
        <div className="payment-icons">
          <img src="/assests/icons/visa.png" alt="Visa" />
          <img src="/assests/icons/mastercard.png" alt="MasterCard" />
          <img src="/assests/icons/discover.png" alt="DiscoverCard" />
          <img src="/assests/icons/amex.png" alt="American Express" />
        </div>

        <div className="payment-container">
          <div className="payment-card">
            <CardComponent>
              <h2>Payment Details</h2>
              <div className="fillup-form">
                <div className="input-row">
                  <div className="input-container">
                    <label>Name on the Card</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Cardholder Name"
                    />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-container">
                    <label>Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={16}
                    />
                  </div>
                  <div className="input-container">
                    <label>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength={3}
                    />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-container">
                    <label>Expiry Month</label>
                    <input
                      type="text"
                      name="month"
                      value={formData.month}
                      onChange={handleInputChange}
                      placeholder="MM"
                      maxLength={2}
                    />
                  </div>
                  <div className="input-container">
                    <label>Expiry Year</label>
                    <input
                      type="text"
                      name="expiryYear"
                      value={formData.expiryYear}
                      onChange={handleInputChange}
                      placeholder="YYYY"
                      maxLength={4}
                    />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-container">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="Postal Code"
                    />
                  </div>
                </div>

                <ButtonComponent btnName="Pay" />

                {/* Error and Success Messages */}
                {paymentError && (
                  <div className="error-message">{paymentError}</div>
                )}
                {paymentSuccess && (
                  <div className="success-message">{paymentSuccess}</div>
                )}
              </div>
            </CardComponent>
          </div>
        </div>
      </div>

      {/* Footer */}
      <FooterComponent />
    </div>
  );
};

export default PaymentComponent;
