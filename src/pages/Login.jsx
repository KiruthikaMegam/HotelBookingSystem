import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useHotel } from "../context/HotelContext";
import { initialAdmin } from "../data/hotelData";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginCustomer, logoutCustomer } = useHotel();

  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (role === "admin") {
      const isValidAdmin =
        email.trim().toLowerCase() === initialAdmin.email.toLowerCase() &&
        password === initialAdmin.password;

      if (!isValidAdmin) {
        setError("Invalid email or password.");
        return;
      }

      logoutCustomer();
      localStorage.setItem("rrAdminLoggedIn", "true");
      navigate("/admin", { replace: true });
      return;
    }

    localStorage.removeItem("rrAdminLoggedIn");
    const result = loginCustomer(email, password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate(location.state?.from || "/my-bookings", { replace: true });
  }

  return (
    <div className="customer-auth-page">
      <div className="customer-auth-image">
        <div className="customer-auth-image-content">
          <span>WELCOME TO RR RESORT</span>
          <h1>Experience Luxury. Create Memories.</h1>
          <p>
            Discover beautiful stays, relaxing experiences and
            unforgettable moments with us.
          </p>
        </div>
      </div>

      <div className="customer-auth-form-area">
        <div className="customer-auth-form">
          <Link to="/" className="customer-auth-logo">
            RR <span>RESORT</span>
          </Link>

          <span className="customer-auth-subtitle">WELCOME BACK</span>
          <h2>Common Login</h2>
          <p className="customer-auth-description">
            Sign in to continue as a customer or administrator.
          </p>

          <div className="login-role-label">Login As</div>
          <div className="login-role-selector">
            <button
              type="button"
              className={role === "customer" ? "active" : ""}
              onClick={() => {
                setRole("customer");
                setError("");
              }}
            >
              Customer
            </button>
            <button
              type="button"
              className={role === "admin" ? "active" : ""}
              onClick={() => {
                setRole("admin");
                setError("");
              }}
            >
              Admin
            </button>
          </div>

          {error && <div className="customer-auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="customer-auth-input-group">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="customer-auth-input-group">
              <label htmlFor="login-password">Password</label>
              <div className="customer-password-field">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" className="customer-auth-submit">
              Login as {role === "admin" ? "Admin" : "Customer"}
            </button>
          </form>

          {role === "customer" ? (
            <p className="customer-auth-switch">
              Don't have an account? <Link to="/register">Create Account</Link>
            </p>
          ) : (
            <div className="admin-login-hint">
              <strong>Admin Demo Account</strong>
              <p>Email: {initialAdmin.email}</p>
              <p>Password: {initialAdmin.password}</p>
            </div>
          )}

          <Link to="/" className="customer-auth-back">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
