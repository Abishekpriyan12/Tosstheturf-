import React, { useState } from "react";
import ButtonComponent from "../Button-Component/ButtonComponent";
import "./SignupPageComponent.css";
import signupBackground from "./../../assests/images/signupbg.jpg";
import logo from "./../../assests/images/logov1.png";
import { graphQLCommand } from "../../util"; // Import the graphQLCommand function
import { useNavigate } from "react-router-dom"; // Change to useNavigate

const SignupPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("User"); // State for selected role
  const navigate = useNavigate(); // Change to useNavigate

  const handleSignup = async (e) => {
    e.preventDefault();

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const query = `
        mutation {
            signup(firstName: "${firstName}", lastName: "${lastName}", email: "${email}", password: "${password}", role: "${role}") {
                id
                email
            }
        }
    `;

    try {
      const response = await graphQLCommand(query);
      console.log("Signup Successful:", response);
      // Redirect to login after successful signup
      navigate("/login"); // Change to navigate
    } catch (error) {
      console.error("Signup Error:", error);
      if (error.message.includes("User already exists")) {
        alert("User already exists. Redirecting to login.");
        navigate(`/login?role=${role}`); // Change to navigate
      } else {
        alert("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <div className="logo">
          <img src={logo} alt="TOSS Logo" className="logo-image" />
        </div>
        <h2>Start Your Journey</h2>
        <p>Streamline turf care with efficient scheduling, monitoring, and resource management.</p>

        <form onSubmit={handleSignup}>
          <div className="two-column">
            <div className="input-wrapper">
              <label htmlFor="firstName" className='labelSignup'>First Name</label>
              <input
                type="text"
                id="firstName"
                placeholder="Enter Your First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="lastName" className='labelSignup'>Last Name</label>
              <input
                type="text"
                id="lastName"
                placeholder="Enter Your Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className='labelSignup'>Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className='labelSignup'>Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className='labelSignup'>Confirm Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm Your Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role" className='labelSignup'>Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="Owner">Owner</option>
            </select>
          </div>

          <ButtonComponent btnName={"Sign Up"} />
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
