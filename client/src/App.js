import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import HomePageComponent from "./components/Pages/Home-Component/HomePageComponent";
import ContactUsComponent from "./components/Pages/ContactUs-Component/ContactUsComponent";
import FaqComponent from "./components/Pages/Faq-Component/FaqComponent";
import AboutUsComponent from "./components/Pages/AboutUs-Component/AboutUsComponent";
import PaymentComponent from "./components/Pages/Payment-Component/PaymentComponent";
import TurfDetailComponent from "./components/Pages/TurfDetail-Component/TurfDetailComponent";
import LoginPage from "./components/Pages/LoginPage/LoginpageComponent";
import SignupPage from "./components/Pages/SignupPage/SignupPageComponent";
import EditTurfDetailComponent from "./components/Pages/EditTurfDetail-Component/EditTurfDetailComponent";
import BookingHistoryComponent from "./components/Pages/BookingHistory-Component/BookingHistoryComponent";
import AddTurfForm from "./components/Pages/Add-Turf/AddTurfForm";
import TurfSearchPageComponent from "./components/Pages/TurfSearchPage-Component/TurfSearchPageComponent";
import BookingPageComponent from "./components/Pages/BookingPage_Component/BookingPageComponent";
import DisplayTurfComponent from "./components/Pages/DisplayTurf-Component/DisplayTurfComponent";
import BookingConfirmation from "./components/Pages/BookingConfirmation-Component/BookingConfirmation";
import UserProfilePage from "./components/Pages/UserProfilePage-Component/UserProfilePage";
import OwnerDashboardComponent from "./components/Pages/owner-dashboard/OwnerDashboardComponent";
import AdminDashboardComponent from "./components/Pages/Admin-Dashboard/AdminDashboardComponent";
import OwnerTurfBookingHistory from "./components/Pages/owner-booking/OwnerTurfBookingHistory";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51QMj2AFVBeJqSxXdduljyneDhiZCJfl1k5uljbb5khNDmuDWvp1sofI2WZJUy0ZafgZIn1gZVDmdaLmGa71gLSEA00AtA8HDeP");

function App() {
  const [role, setRole] = useState(null); // Role stored in state
  const [loading, setLoading] = useState(true); // Loading state to check if role is loaded
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch role from sessionStorage on component mount
    const userRole = sessionStorage.getItem("role");  
    if (userRole) {
      setRole(userRole);  // Set the role if available
    } else {
      navigate("/login");  // Redirect to login if no role is found
    }

    // Set loading to false after role is set
    setLoading(false);
  }, [navigate]);

  if (loading) {
    // Show a loading screen while the role is being determined
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Routes>
        {/* All users land on the HomePage */}
        <Route path="/" element={<HomePageComponent />} />

        {/* Public Routes */}
        <Route path="/contact" element={<ContactUsComponent />} />
        <Route path="/faq" element={<FaqComponent />} />
        <Route path="/payment" element={<Elements stripe={stripePromise}><PaymentComponent /></Elements>} />
        <Route path="/about" element={<AboutUsComponent />} />
        <Route path="/turfSearch" element={<TurfSearchPageComponent />} />
        <Route path="/turf/:id" element={<TurfDetailComponent />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Routes for Users */}
        {role === "User" && (
          <>
            <Route path="/bookingPage/:id" element={<BookingPageComponent />} />
            <Route path="/displayturf" element={<DisplayTurfComponent />} />
            <Route path="/bookingConfirmation" element={<BookingConfirmation />} />
            <Route path="/user" element={<UserProfilePage />} />
          </>
        )}

        {/* Routes for Admin */}
        {role === "Admin" && (
          <>
            <Route path="/adminDashboard" element={<AdminDashboardComponent />} />
            <Route path="/bookinghistory" element={<BookingHistoryComponent />} />
            <Route path="/displayturf" element={<DisplayTurfComponent />} />
            <Route path="/edit-turf" element={<EditTurfDetailComponent />} />
            <Route path="/user" element={<UserProfilePage />} />
          </>
        )}

        {/* Routes for Owners */}
        {role === "Owner" && (
          <>
            <Route path="/ownerDashboard" element={<OwnerDashboardComponent />} />
            <Route path="/addTurf" element={<AddTurfForm />} />
            <Route path="/user" element={<UserProfilePage />} />
            <Route path="/bookinghistory/:turfId" element={<OwnerTurfBookingHistory />} />
          </>
        )}

      
      </Routes>
    </div>
  );
}

export default App;
