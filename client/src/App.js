import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePageComponent from './components/Home-Component/HomePageComponent';
import ContactUsComponent from './components/ContactUs-Component/ContactUsComponent'
import AboutUsComponent from './components/AboutUs-Component/AboutUsComponent';
import TurfDetailComponent from './components/TurfDetail-Component/TurfDetailComponent';



function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePageComponent />} />
          <Route path="/contact" element={<ContactUsComponent></ContactUsComponent>} />
          <Route path="/about" element={<AboutUsComponent></AboutUsComponent>} />
          <Route path="/turfDetail" element={<TurfDetailComponent></TurfDetailComponent>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
