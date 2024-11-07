import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import "./LoginPageComponent.css";
import loginBackground from "../../../assests/images/loginbg.jpg";
import ButtonComponent from "../../Reusable-Components/Button-Component/ButtonComponent";
import logo from "../../../assests/images/logov1.png";
import { graphQLCommand } from "../../../util" 



const LoginPage = () => {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); 
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
  
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
        localStorage.setItem("userRole", userRole); // Store the role
  
        // Redirect based on role
        if (userRole === "Admin") {
          navigate("/displayturf"); 
        } else if (userRole === "User") {
          navigate("/turfDetail");
        } else if (userRole === "Owner") {
          navigate("/home");
        }
      } else {
        setErrorMessage("Login failed. Please check your credentials and role.");
      }
    } catch (error) {
      console.log(error);
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
                required 
              />
              <img src="../../../assests/icons/mail.png" alt="Email Icon" className="icon" />
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
                required 
              />
              <img src="../../../assests/icons/hide.png" alt="Password Icon" className="icon" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="role" className="labelLogin">
              Role
            </label>
            <div className="select-wrapper">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Select Role</option>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                <option value="Owner">Owner</option>
              </select>
              <img src="../../../assests/icons/arrow-down.png" alt="Role Icon" className="icon" /> 
            </div>
          </div>

          <div className="form-group remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>} 
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