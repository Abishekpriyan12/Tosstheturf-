import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from "@stripe/react-stripe-js";
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
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();

  // State variables
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [navBarData, setNavBarData] = useState([]);
  const bookingDetails = location.state?.bookingDetails;

  // Fetch clientSecret and navbar data
  useEffect(() => {
    const fetchPaymentIntent = async () => {
      if (!bookingDetails) {
        setPaymentError("Missing booking details. Please try again.");
        return;
      }

      try {
        const { price } = bookingDetails;
        console.log("Creating Payment Intent for price:", price);

        const response = await graphQLCommand(CREATE_PAYMENT_INTENT, {
          amount: Math.round(price * 100), // Amount in cents
          currency: "cad",
        });

        if (response.createPaymentIntent?.clientSecret) {
          setClientSecret(response.createPaymentIntent.clientSecret);
          console.log("Fetched clientSecret:", response.createPaymentIntent.clientSecret);
        } else {
          throw new Error("Client secret not found in the response.");
        }
      } catch (error) {
        console.error("Error creating payment intent:", error);
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
      console.log("NavBar Data:", data.getNavItems);
    };

    fetchPaymentIntent();
    fetchNavBarData();
  }, [bookingDetails]);

  // Function to wait for Payment Element
  const waitForPaymentElement = async (maxRetries = 10, delay = 500) => {
    console.log("Waiting for PaymentElement to be ready...");
    for (let i = 0; i < maxRetries; i++) {
      const paymentElement = elements?.getElement(PaymentElement);
      if (paymentElement) {
        console.log("PaymentElement is ready:", paymentElement); // Logging the actual PaymentElement
        return paymentElement;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      console.log(`Retry ${i + 1}/${maxRetries}`);
    }
    throw new Error("PaymentElement is not ready.");
  };

  // Handle payment submission
  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setPaymentError("Stripe is not properly loaded. Please try again.");
      return;
    }

    try {
      setIsLoading(true);
      await waitForPaymentElement();

      console.log("Calling stripe.confirmPayment...");
      const paymentResult = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/bookingConfirmation",
        },
        redirect: "if_required",
      });

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
      console.error("Error processing payment:", error);
      setPaymentError("An error occurred while processing the payment.");
    } finally {
      setIsLoading(false);
    }
  };

  // Appearance settings for Payment Element
  const appearance = useMemo(
    () => ({
      theme: "stripe",
      variables: {
        colorPrimary: "#37e534",
        colorBackground: "#000000",
        colorText: "#FFFF",
        colorDanger: "#DF1B41",
      },
      rules: {
        ".Input": { borderRadius: "8px" },
        ".Label": { color: "#ffffff" },
      },
    }),
    []
  );

  const options = useMemo(() => ({ clientSecret, appearance }), [clientSecret, appearance]);

  console.log("Options passed to Elements:", options);

  return (
    <div>
     

 <NavBarComponent/>

      <div className="payment-body">
        <h2 className="payment-header">PAYMENT CONFIRMATION</h2>
        {clientSecret ? (
          <Elements stripe={stripePromise} options={options}>
            <form className="payment-container" onSubmit={handlePayment}>
              <PaymentElement id="payment-element" />
              <button
                className="pay-button"
                type="submit"
                disabled={isLoading || !stripe || !elements}
              >
                {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
              </button>
              {paymentError && <div className="error-message">{paymentError}</div>}
              {paymentSuccess && <div className="success-message">{paymentSuccess}</div>}
            </form>
          </Elements>
        ) : (
          <div>Loading payment details...</div>
        )}
      </div>
      <FooterComponent />
    </div>
  );
};

export default PaymentComponent;
