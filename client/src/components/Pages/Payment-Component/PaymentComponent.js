import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import NavBarComponent from "../../Reusable-Components/navigation-component/NavBarComponent";
import FooterComponent from "../../Reusable-Components/footer-component/FooterComponent";
import "./PaymentComponent.css";
import { graphQLCommand } from "../../../util"; // GraphQL utility function

// Initialize Stripe with your public key
const stripePromise = loadStripe("pk_test_51QMj2AFVBeJqSxXdduljyneDhiZCJfl1k5uljbb5khNDmuDWvp1sofI2WZJUy0ZafgZIn1gZVDmdaLmGa71gLSEA00AtA8HDeP");

// GraphQL Mutation for creating a Payment Intent
const CREATE_PAYMENT_INTENT = `
  mutation CreatePaymentIntent($amount: Int!, $currency: String!) {
    createPaymentIntent(amount: $amount, currency: $currency) {
      id
      clientSecret
    }
  }
`;

// GraphQL Mutation for confirming booking
const CONFIRM_BOOKING = `
  mutation ConfirmBooking(
    $paymentIntentId: String,
    $userId: ID!,
    $turfId: ID!,
    $turfName: String!,
    $date: String!,
    $time: [String!]!,
    $duration: Int!,
    $price: Float!
  ) {
    confirmBooking(
      paymentIntentId: $paymentIntentId,
      userId: $userId,
      turfId: $turfId,
      turfName: $turfName,
      date: $date,
      time: $time,
      duration: $duration,
      price: $price
    ) {
      id
      turfName
      date
      time
      duration
      price
    }
  }
`;

const PaymentComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Refs to store stripe and elements
  const elementsRef = useRef(null);
  const paymentElementRef = useRef(null);

  // State variables
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [navBarData, setNavBarData] = useState([]);
  const bookingDetails = location.state?.bookingDetails;

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      if (!bookingDetails) {
        setPaymentError("Missing booking details. Please try again.");
        return;
      }

      try {
        const { price } = bookingDetails;
        const response = await graphQLCommand(CREATE_PAYMENT_INTENT, {
          amount: Math.round(price * 100),
          currency: "cad",
        });

        if (response.createPaymentIntent?.clientSecret) {
          setClientSecret(response.createPaymentIntent.clientSecret);
        } else {
          throw new Error("Client secret not found in the response.");
        }
      } catch (error) {
        setPaymentError("Failed to initialize payment. Please try again.");
      }
    };

    const fetchNavBarData = async () => {
      const query = `
        query {
          getNavItems {
            id
            name
            url
          }
        }
      `;
      const data = await graphQLCommand(query);
      setNavBarData(data.getNavItems || []);
    };

    fetchPaymentIntent();
    fetchNavBarData();
  }, [bookingDetails]);

  useEffect(() => {
    const mountPaymentElement = async () => {
      if (!clientSecret || !paymentElementRef.current) return;

      try {
        const stripe = await stripePromise;
        const elements = stripe.elements({ clientSecret });
        elementsRef.current = elements;

        const paymentElement = elements.create("payment");
        paymentElement.mount(paymentElementRef.current);
      } catch (error) {
        setPaymentError("Failed to mount the payment element.");
      }
    };

    mountPaymentElement();
  }, [clientSecret]);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!elementsRef.current || !clientSecret) {
      setPaymentError("Payment element is not ready. Please refresh and try again.");
      return;
    }

    try {
      setIsLoading(true);

      const stripe = await stripePromise;
      const paymentResult = await stripe.confirmPayment({
        elements: elementsRef.current,
        confirmParams: {
          return_url: window.location.origin + "/bookingConfirmation",
        },
        redirect: "if_required",
      });

      console.log('paymentresult',paymentResult)

      if (paymentResult.error) {
        setPaymentError(paymentResult.error.message);
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        const confirmBookingResponse = await graphQLCommand(CONFIRM_BOOKING, {
          paymentIntentId: paymentResult.paymentIntent.id,
          ...bookingDetails,
        });

        setPaymentSuccess("Payment and Booking Successful!");
        setTimeout(() => {
          navigate("/bookingConfirmation", {
            state: confirmBookingResponse.confirmBooking,
          });
        }, 3000);
      } else {
        setPaymentError("Payment failed. Please try again.");
      }
    } catch (error) {
      console.log(error)
      setPaymentError("An error occurred while processing the payment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <NavBarComponent navBarData={navBarData} />

      <div className="payment-body">
        <h2 className="payment-header">PAYMENT CONFIRMATION</h2>
        {clientSecret ? (
          <form className="payment-container" onSubmit={handlePayment}>
            <div id="payment-element" ref={paymentElementRef}></div>
            <button
              className="pay-button"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
            </button>
            {paymentError && <div className="error-message">{paymentError}</div>}
            {paymentSuccess && <div className="success-message">{paymentSuccess}</div>}
          </form>
        ) : (
          <div>Loading payment details...</div>
        )}
      </div>
      <FooterComponent />
    </div>
  );
};

export default PaymentComponent;
