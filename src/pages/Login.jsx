import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "../firebase";
import "../styles/Login.css";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import logo from "../assets/fridge-logo.png";

function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

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

    setLoading(true);
    try {
      if (isSignUp) {
        // Sign Up Flow
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Registration Successful!");
      } else {
        // Sign In Flow
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (error) {
      console.error("Auth error:", error);
      switch (error.code) {
        case "auth/email-already-in-use":
          setEmailError("This email is already registered.");
          break;
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          setGeneralError("Invalid email or password.");
          break;
        case "auth/weak-password":
          setPasswordError("Password is too weak.");
          break;
        default:
          setGeneralError(error.message || "An authentication error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGeneralError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (error) {
      console.error("Google sign in error:", error);
      if (error.code !== "auth/popup-closed-by-user") {
        setGeneralError("Failed to sign in with Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Panel */}
      <div className="left-panel">
        <img src={logo} className="logo" alt="Smart Fridge Logo" />
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
          <h1>{isSignUp ? "Create Account" : "Welcome Back"}</h1>
          <p className="subtitle">
            {isSignUp
              ? "Register to start tracking food items"
              : "Sign in to continue to Smart Fridge"}
          </p>

          {generalError && <p className="error general-error">{generalError}</p>}

          <label>Email Address</label>
          <div className="input-box">
            <MdEmail className="icon" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          {emailError && <p className="error">{emailError}</p>}

          <label>Password</label>
          <div className="input-box">
            <FaLock className="icon" />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          {passwordError && <p className="error">{passwordError}</p>}

          {!isSignUp && (
            <div className="options">
              <div>
                <input type="checkbox" id="remember-me" disabled={loading} />
                <label htmlFor="remember-me" style={{ cursor: "pointer", fontSize: "14px", fontWeight: "normal", color: "#555" }}> Remember me</label>
              </div>
              <a href="#">Forgot Password?</a>
            </div>
          )}

          <button className="login-btn" onClick={handleAuth} disabled={loading}>
            {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>

          <div className="divider">
            <hr />
            <br />
            <span>Or</span>
            <hr />
          </div>

          <button className="google-btn" onClick={handleGoogleSignIn} disabled={loading}>
            <FcGoogle className="google-icon" />
            Continue with Google
          </button>

          <p className="signup-text">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              onClick={() => {
                setIsSignUp(!isSignUp);
                setEmailError("");
                setPasswordError("");
                setGeneralError("");
              }}
              style={{ color: "#34a853", cursor: "pointer", fontWeight: "bold" }}
            >
              {isSignUp ? "Sign In" : "Create Account"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;