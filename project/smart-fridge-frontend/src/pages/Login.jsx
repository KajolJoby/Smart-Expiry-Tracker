import { useState } from "react";
import "../styles/Login.css";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import logo from "../assets/fridge-logo.png";


function Login() {

const [email, setEmail] = useState("");

const [password, setPassword] = useState("");

const [emailError, setEmailError] = useState("");

const [passwordError, setPasswordError] = useState("");
const handleLogin = () => {

  setEmailError("");
  setPasswordError("");

  if (email.trim() === "") {
    setEmailError("Email is required.");
    return;
  }

  if (!email.endsWith("@gmail.com")) {
    setEmailError("Please enter a valid Gmail address.");
    return;
  }

  if (password.trim() === "") {
    setPasswordError("Password is required.");
    return;
  }

  if (password.length < 8) {
    setPasswordError("Password must be at least 8 characters.");
    return;
  }

  alert("Login Successful!");
};
  return (
    <div className="login-container">

      {/* Left Panel */}
      <div className="left-panel">
        <img src={logo} className="logo" />
        <h1 className="logo-title">
          Smart <br />
          Fridge
        </h1>
        <p className="assistant-text">Your Food Assistant</p>
      <div className="tagline">
    <h3>Track your food.</h3>
    <h3>Get timely reminders.</h3>
    <h3>Reduce waste.</h3>
</div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">

        <div className="login-card">

          <h1>Welcome Back</h1>

          <p className="subtitle">
            Sign in to continue to Smart Fridge
          </p>

          <label>Email Address</label>

         <div className="input-box">

         <MdEmail className="icon"/>

         <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
         />

         </div>
        
        {emailError && (
         <p className="error">{emailError}</p>
        )}

          <label>Password</label>

          <div className="input-box">

          <FaLock className="icon"/>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          </div>
          {passwordError && (
          <p className="error">{passwordError}</p>
         )}

          <div className="options">

            <div>

              <input type="checkbox" />

              <span>Remember me</span>

            </div>

            <a href="#">Forgot Password?</a>

          </div>

          <button className="login-btn" onClick={handleLogin}>
            Sign In
          </button>
           

           
          <div className="divider">
            <hr />
            <br/>
                <span>Or</span>
            <hr />
          </div>

          <button className="google-btn">

             <FcGoogle className="google-icon" />

                  Continue with Google

          </button>


          <p className="signup-text">
                Don't have an account? <a href="#">Create Account</a>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;