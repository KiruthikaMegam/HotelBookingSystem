
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { initialAdmin } from "../data/hotelData";
import "./AdminLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleLogin(e) {
    e.preventDefault();

    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }

    if (
      email.trim().toLowerCase() === initialAdmin.email.toLowerCase() &&
      password === initialAdmin.password
    ) {
      localStorage.setItem("rrAdminLoggedIn", "true");
      setError("");
      navigate("/admin");
    } else {
      setError("Invalid email or password.");
    }
  }

  function fillDemoCredentials() {
    setEmail(initialAdmin.email);
    setPassword(initialAdmin.password);
    setError("");
  }

  return (
    <div className="admin-login-page">

      <div className="admin-login-image">
        <div className="admin-login-image-overlay">

          <div className="admin-login-brand">
            <span>RR</span>
            <h2>RESORT</h2>
          </div>

          <div className="admin-login-welcome">
            <span>WELCOME BACK</span>
            <h1>Manage Your Resort With Elegance.</h1>
            <p>
              Manage reservations, rooms and guest experiences
              from your resort administration panel.
            </p>
          </div>

          <div className="admin-login-image-footer">
            RR RESORT · ADMINISTRATION
          </div>

        </div>
      </div>

      <div className="admin-login-form-area">

        <form className="admin-login-form" onSubmit={handleLogin}>

          <div className="admin-login-mobile-logo">
            <span>RR</span>
            <strong>RESORT</strong>
          </div>

          <span className="admin-eyebrow">
            ADMINISTRATION PORTAL
          </span>

          <h2>Admin Login</h2>

          <p className="admin-login-subtitle">
            Sign in to access your resort dashboard.
          </p>

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          <label htmlFor="admin-email">Email Address</label>

          <input
            id="admin-email"
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
          />

          <label htmlFor="admin-password">Password</label>

          <div className="admin-password-field">

            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />

            <button
              type="button"
              className="admin-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>

          </div>

          <button
            type="submit"
            className="admin-login-submit"
          >
            Sign In to Dashboard
            <span>→</span>
          </button>

          <div className="admin-login-demo">

            <div className="admin-demo-heading">
              <span>DEMO ACCESS</span>
              <h3>Admin Login Credentials</h3>
              <p>
                Use the following details to access the dashboard.
              </p>
            </div>

            <div className="admin-demo-details">

              <div className="admin-demo-item">
                <div>
                  <small>EMAIL ADDRESS</small>
                  <strong>{initialAdmin.email}</strong>
                </div>
              </div>

              <div className="admin-demo-item">
                <div>
                  <small>PASSWORD</small>
                  <strong>{initialAdmin.password}</strong>
                </div>
              </div>

            </div>

            <button
              type="button"
              className="admin-demo-button"
              onClick={fillDemoCredentials}
            >
              Use Demo Login
              <span>→</span>
            </button>

          </div>

          <button
            type="button"
            className="admin-login-home"
            onClick={() => navigate("/")}
          >
            ← Back to Resort Website
          </button>

        </form>

      </div>
    </div>
  );
}
