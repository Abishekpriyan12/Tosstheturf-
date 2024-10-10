import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import "./LoginPageComponent.css";
import loginBackground from "./../../assests/images/loginbg.jpg";
import ButtonComponent from "../Button-Component/ButtonComponent";
import logo from "./../../assests/images/logov1.png";
import { graphQLCommand } from "../../util"; // Ensure this path is correct

const LoginPage = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // State for role selection
  const [errorMessage, setErrorMessage] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault(); 
    setErrorMessage(''); 
  
    console.log("Attempting login with:", { email, password, role });
  
    try {
      const response = await graphQLCommand(
        `
        mutation Login($email: String!, $password: String!, $role: String!) {
            login(email: $email, password: $password, role: $role) {
                id
                firstName
                lastName
                email
                role
            }
        }
        `,
        {
          email,
          password,
          role,
        }
      );
  
  
      
      if (response && response.login) {
       
  
        const userRole = response.login.role;
        if (userRole === "User") {
          navigate("/turfDetail");
        } else if (userRole === "Admin") {
          navigate("/payment");
        } else if (userRole === "Owner") {
          navigate("/home");
        }
      } else {
        setErrorMessage("Login failed. Please check your credentials and role.");
      }
    } catch (error) {
      
    }
  };
  
  
  
  
  

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="logo">
          <img src={logo} alt="TOSS Logo" className="logo-image" />
        </div>
        <h2>Welcome Back!</h2>
        <p>
          Streamline turf care with efficient scheduling, monitoring, and
          resource management.
        </p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email" className="labelLogin">
              Email
            </label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                placeholder="Enter Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required // Ensure the input is required
              />
              <span className="icon">📧</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password" className="labelLogin">
              Password
            </label>
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required // Ensure the input is required
              />
              <span className="icon">👁️</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="role" className="labelLogin">
              Role
            </label>
            <select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="">Select Role</option> {/* Add a default option */}
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="Owner">Owner</option>
            </select>
          </div>
          <div className="form-group remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
          <ButtonComponent btnName={"Login"} />
          <p className="signup-text">
            Don’t Have an Account? <a href="/signup">Sign up</a>
          </p>
        </form>
      </div>

      <div
        className="login-background"
        style={{ backgroundImage: `url(${loginBackground})` }}
      />
    </div>
  );
};

export default LoginPage;
