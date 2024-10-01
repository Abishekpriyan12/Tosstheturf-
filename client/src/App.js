import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePageComponent from "./components/Home-Component/HomePageComponent";
import ContactUsComponent from "./components/ContactUs-Component/ContactUsComponent";
import FaqComponent from "./components/Faq-Component/FaqComponent";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePageComponent />} />
          <Route
            path="/contact"
            element={<ContactUsComponent></ContactUsComponent>}
          />
          <Route path="/faq" element={<FaqComponent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
