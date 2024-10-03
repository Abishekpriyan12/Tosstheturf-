import React from 'react';
import './LoginPageComponent.css';  
import loginBackground from './../../assests/images/loginbg.jpg';
import ButtonComponent from '../Button-Component/ButtonComponent';
import logo from './../../assests/images/logov1.png'


const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="login-form">
        <div className="logo">
          {/* <h1>TOSS</h1> */}
          <img src={logo} alt="TOSS Logo" className="logo-image" /> 

        </div>
        <h2>Welcome Back !</h2>
        <p>Streamline turf care with efficient scheduling, monitoring, and resource management.</p>

        <form>
          <div className="form-group">
            <label htmlFor="email" className='labelLogin'>Email</label>
            <div className="input-wrapper">
              <input type="email" id="email" placeholder="Enter Your Email Address" />
              <span className="icon">📧</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password"  className='labelLogin'>Password</label>
            <div className="input-wrapper">
              <input type="password" id="password" placeholder="Enter your password" />
              <span className="icon">👁️</span>
            </div>
          </div>

          <div className="form-group remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>

          {/* <button className="login-button" type="submit">Login</button> */}
          <ButtonComponent className='login-button' btnName={"Login"}></ButtonComponent>


          <p className="signup-text">
            Don’t Have an Account? <a href="/signup">Sign in</a>
          </p>
        </form>
      </div>

      <div
        className="login-background"
        style={{ backgroundImage: `url(${loginBackground})` }}
      >
        {/* Background image */}
      </div>
    </div>
  );
};

export default LoginPage;
