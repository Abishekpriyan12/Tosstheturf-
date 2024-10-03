import React from "react";
import ButtonComponent from '../Button-Component/ButtonComponent';
import './SignupPageComponent.css';  
import signupBackground from './../../assests/images/signupbg.jpg'
import logo from './../../assests/images/logov1.png'


const SignupPage = () => {
    return (
      <div className="signup-container">
        <div className="signup-form">
          <div className="logo">
            <img src={logo} alt="TOSS Logo" className="logo-image" />
          </div>
          <h2>Start Your Journey</h2>
          <p>Streamline turf care with efficient scheduling, monitoring, and resource management.</p>
  
          <form>
            <div className="two-column">
              <div className="input-wrapper">
                <label htmlFor="firstName" className='labelSignup'>First Name</label>
                <input type="text" id="firstName" placeholder="Enter Your First Name" />
              </div>
  
              <div className="input-wrapper">
                <label htmlFor="lastName" className='labelSignup'>Last Name</label>
                <input type="text" id="lastName" placeholder="Enter Your Last Name" />
              </div>
            </div>
  
            <div className="form-group">
              <label htmlFor="email" className='labelSignup'>Email</label>
              <div className="input-wrapper">
                <input type="email" id="email" placeholder="Enter Your Email" />
              </div>
            </div>
  
            <div className="form-group">
              <label htmlFor="password" className='labelSignup'>Password</label>
              <div className="input-wrapper">
                <input type="password" id="password" placeholder="Enter Your Password" />
              </div>
            </div>
  
            <div className="form-group">
              <label htmlFor="confirmPassword" className='labelSignup'>Confirm Password</label>
              <div className="input-wrapper">
                <input type="password" id="confirmPassword" placeholder="Confirm Your Password" />
              </div>
            </div>
  
            <ButtonComponent  btnName={"Sign Up"} />
          </form>
  
          <p className="signup-text">
            Have an account? <a href="/login">Log in to get started</a>
          </p>
        </div>
  
        <div
          className="signup-background"
          style={{ backgroundImage: `url(${signupBackground})` }}
        >
          {/* Background Image */}
        </div>
      </div>
    );
  };
  
  export default SignupPage;