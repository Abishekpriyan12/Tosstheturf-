import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
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
import OwnerDashboardComponent from "./components/Pages/owner-dashboard/OwnerDashboardComponent"
import AdminDashboardComponent from "./components/Pages/Admin-Dashboard/AdminDashboardComponent"
import OwnerTurfBookingHistory from "./components/Pages/owner-booking/OwnerTurfBookingHistory";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51QMj2AFVBeJqSxXdduljyneDhiZCJfl1k5uljbb5khNDmuDWvp1sofI2WZJUy0ZafgZIn1gZVDmdaLmGa71gLSEA00AtA8HDeP");

 
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePageComponent />} />
        <Route path="/contact" element={<ContactUsComponent />} />
        <Route path="/faq" element={<FaqComponent />} />
        <Route
          path="/payment"
          element={
            <Elements stripe={stripePromise}>
              <PaymentComponent />
            </Elements>
          }
        />
        <Route path="/about" element={<AboutUsComponent />} />
        <Route path="/turf/:id" element={<TurfDetailComponent />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/edit-turf" element={<EditTurfDetailComponent />} />
        <Route path="/bookinghistory" element={<BookingHistoryComponent />} />
        <Route path="/addTurf" element={<AddTurfForm />} />
        <Route path="/turfSearch" element={<TurfSearchPageComponent />} />
        <Route path="/bookingPage/:id" element={<BookingPageComponent />} />
        <Route path="/displayturf" element={<DisplayTurfComponent />} />
        <Route path="/bookingConfirmation" element={<BookingConfirmation />} />
        <Route path="/user" element={<UserProfilePage />} />
        <Route path="/ownerDashboard" element={<OwnerDashboardComponent/>}></Route>
        <Route path="/adminDashboard" element={<AdminDashboardComponent/>}></Route>
        <Route path="/bookinghistory/:turfId" element={<OwnerTurfBookingHistory />} />
      </Routes>
    </div>
  );
}
 
export default App;
