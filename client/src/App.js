import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePageComponent from "./components/Home-Component/HomePageComponent";
import ContactUsComponent from "./components/ContactUs-Component/ContactUsComponent";
import FaqComponent from "./components/Faq-Component/FaqComponent";
import AboutUsComponent from "./components/AboutUs-Component/AboutUsComponent";
import PaymentComponent from "./components/Payment-Component/PaymentComponent";
import TurfDetailComponent from "./components/TurfDetail-Component/TurfDetailComponent";
import LoginPage from "./components/LoginPage/LoginpageComponent";
import SignupPage from "./components/SignupPage/SignupPageComponent";
import EditTurfDetailComponent from "./components/EditTurfDetail-Component/EditTurfDetailComponent";





function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePageComponent />} />
        <Route path="/contact" element={<ContactUsComponent />} />
        <Route path="/faq" element={<FaqComponent />} />
        <Route path="/payment" element={<PaymentComponent />} />
        <Route path="/about" element={<AboutUsComponent />} />
        <Route path="/turfDetail" element={<TurfDetailComponent />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/editturfdetail" element={<EditTurfDetailComponent />} />
      </Routes>
    </div>
  );
}

export default App;
