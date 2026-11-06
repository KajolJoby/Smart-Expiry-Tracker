import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import fridgeLogo from "../assets/fridge.png";
import { registerWithEmail, resetPassword, signInWithEmail, signInWithGoogle } from "../services/userStore";
import "./Login.css";

function Login() {
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const messageForError = (authError) => {
    const messages = {
      "auth/invalid-credential": "Incorrect email or password.",
      "auth/email-already-in-use": "An account already exists with this email.",
      "auth/weak-password": "Use a password with at least 6 characters.",
      "auth/invalid-email": "Enter a valid email address.",
      "auth/popup-closed-by-user": "Sign-in was cancelled.",
    };
    return messages[authError.code] || "We could not complete that request. Please try again.";
  };

  const handleGoogleLogin = async () => {
    try {
      setError(""); setNotice("");
      setIsSigningIn(true);
      await signInWithGoogle();
    } catch (loginError) {
      setError(messageForError(loginError));
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setError(""); setNotice("");
    if (isRegistering && name.trim().length < 2) return setError("Enter a username with at least 2 characters.");
    if (isRegistering && password !== confirmPassword) return setError("Passwords do not match.");
    if (password.length < 6) return setError("Use a password with at least 6 characters.");
    try {
      setIsSigningIn(true);
      if (isRegistering) await registerWithEmail({ name: name.trim(), email, password });
      else await signInWithEmail(email, password);
    } catch (authError) {
      setError(messageForError(authError));
    } finally { setIsSigningIn(false); }
  };

  const handlePasswordReset = async () => {
    setError(""); setNotice("");
    if (!email) return setError("Enter your email address first, then select Forgot password.");
    try { await resetPassword(email); setNotice("Password-reset email sent. Check your inbox."); }
    catch (authError) { setError(messageForError(authError)); }
  };

  const switchMode = () => { setIsRegistering((current) => !current); setError(""); setNotice(""); setPassword(""); setConfirmPassword(""); };

  return <main className="login-page">
    <section className="login-hero">
      <img src={fridgeLogo} alt="Smart Fridge" />
      <p className="login-kicker">SMART EXPIRY TRACKER</p>
      <h1>Your food,<br />under control.</h1>
      <p>Track expiry dates, receive timely alerts, and reduce food waste one item at a time.</p>
    </section>
    <section className="login-panel">
      <div className="login-card">
        <p className="login-kicker">{isRegistering ? "CREATE ACCOUNT" : "WELCOME"}</p>
        <h2>{isRegistering ? "Create your fridge account" : "Sign in to your fridge"}</h2>
        <p className="login-subtitle">Your items and reminders stay private to your account.</p>
        <form className="email-login" onSubmit={handleEmailSubmit}>
          {isRegistering ? <label><span>Username</span><div className="login-input"><FaUser /><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" autoComplete="name" required /></div></label> : null}
          <label><span>Email address</span><div className="login-input"><FaEnvelope /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required /></div></label>
          <label><span>Password</span><div className="login-input"><FaLock /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" autoComplete={isRegistering ? "new-password" : "current-password"} required /></div></label>
          {isRegistering ? <label><span>Confirm password</span><div className="login-input"><FaLock /><input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repeat your password" autoComplete="new-password" required /></div></label> : null}
          {!isRegistering ? <button type="button" className="forgot-password" onClick={handlePasswordReset}>Forgot password?</button> : null}
          <button className="email-submit" disabled={isSigningIn}>{isSigningIn ? "Please wait..." : isRegistering ? "Create account" : "Sign in"}</button>
        </form>
        <div className="login-divider"><span>or</span></div>
        <button className="google-login" onClick={handleGoogleLogin} disabled={isSigningIn}>
          <FcGoogle /> {isSigningIn ? "Opening Google..." : "Continue with Google"}
        </button>
        {error ? <p className="login-error" role="alert">{error}</p> : null}
        {notice ? <p className="login-notice" role="status">{notice}</p> : null}
        <p className="login-note">{isRegistering ? "Already have an account?" : "New to Smart Fridge?"} <button className="mode-switch" onClick={switchMode}>{isRegistering ? "Sign in" : "Create an account"}</button></p>
      </div>
    </section>
  </main>;
}

export default Login;
