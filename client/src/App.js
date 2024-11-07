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

function App() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  if (userRole === null) {
    return <div>Loading...</div>; // Show a loading screen until role is fetched
  }

  return (
    <div className="App">
      <Routes>
        {userRole === "Admin" ? (
          <>
            {/* Redirect from root to /displayturf for admins */}
            <Route path="/" element={<Navigate to="/displayturf" replace />} />
            <Route path="/displayturf" element={<DisplayTurfComponent />} />
            <Route path="/addTurf" element={<AddTurfForm />} />
            <Route path="/editturfdetail" element={<EditTurfDetailComponent />} />
            {/* Catch-all for unmatched paths */}
            <Route path="*" element={<Navigate to="/displayturf" replace />} />
          </>
        ) : (
          <>
            {/* Show HomePageComponent for regular users at root */}
            <Route path="/" element={<HomePageComponent />} />
            <Route path="/contact" element={<ContactUsComponent />} />
            <Route path="/faq" element={<FaqComponent />} />
            <Route path="/payment" element={<PaymentComponent />} />
            <Route path="/about" element={<AboutUsComponent />} />
            <Route path="/turf/:id" element={<TurfDetailComponent />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/bookinghistory" element={<BookingHistoryComponent />} />
            <Route path="/turfSearch" element={<TurfSearchPageComponent />} />
            <Route path="/bookingPage/:id" element={<BookingPageComponent />} />
            <Route path="/bookingConfirmation" element={<BookingConfirmation />} />
            <Route path="/user" element={<UserProfilePage />} />
            {/* Catch-all for unmatched paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
