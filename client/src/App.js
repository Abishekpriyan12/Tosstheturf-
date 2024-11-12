import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import OwnerDashboardComponent from "./components/Pages/owner-dashboard/ownerDashboardComponent"
function App() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  return (
    <div className="App">
      <Routes>
        {/* Public routes accessible to all users */}
        <Route path="/" element={<HomePageComponent />} />
        <Route path="/faq" element={<FaqComponent />} />
        <Route path="/about" element={<AboutUsComponent />} />
        <Route path="/turfSearch" element={<TurfSearchPageComponent />} />
        <Route path="/turf/:id" element={<TurfDetailComponent />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/owner" element={<OwnerDashboardComponent />} />
        
        {userRole === "Admin" ? (
          <>
            {/* Protected admin routes */}
            <Route path="/displayturf" element={<DisplayTurfComponent />} />
            <Route path="/addTurf" element={<AddTurfForm />} />
            <Route path="/editturfdetail" element={<EditTurfDetailComponent />} />
            <Route path="*" element={<Navigate to="/displayturf" replace />} />
          </>
        ) : userRole === "User" ? (
          <>
            {/* Protected user routes */}
            <Route path="/contact" element={<ContactUsComponent />} />
            <Route path="/payment" element={<PaymentComponent />} />
            <Route path="/bookinghistory" element={<BookingHistoryComponent />} />
            <Route path="/bookingPage/:id" element={<BookingPageComponent />} />
            <Route path="/bookingConfirmation" element={<BookingConfirmation />} />
            <Route path="/user" element={<UserProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
