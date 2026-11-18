
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useHotel } from "../context/HotelContext";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const { registerCustomer } = useHotel();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function handleRegister(e) {
    e.preventDefault();
    setError("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();
    const address = form.address.trim();

    if (
      !name ||
      !email ||
      !phone ||
      !address ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const result = registerCustomer({
      name,
      email,
      phone,
      address,
      password: form.password
    });

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/login", { replace: true });
  }

  return (
    <div className="customer-register-page">
      <div className="register-image-panel">
        <div className="register-image-content">
          <span>YOUR PERFECT GETAWAY</span>
          <h1>Make Every Stay a Beautiful Memory.</h1>
          <p>
            Join RR RESORT and enjoy a relaxing stay with comfort,
            luxury and memorable experiences.
          </p>
        </div>
      </div>

      <div className="register-form-panel">
        <form className="register-form" onSubmit={handleRegister}>
          <Link to="/" className="register-logo">
            RR <span>RESORT</span>
          </Link>

          <span className="register-eyebrow">
            CREATE YOUR ACCOUNT
          </span>

          <h2>Join RR RESORT</h2>

          <p className="register-description">
            Enter your details to create your guest account.
          </p>

          {error && (
            <div className="register-error">
              {error}
            </div>
          )}

          <div className="register-input-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="register-input-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="register-input-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="10-digit phone number"
              maxLength="10"
            />
          </div>

          <div className="register-input-group">
            <label>Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter your address"
              rows="2"
            />
          </div>

          <div className="register-input-group">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
            />
          </div>

          <div className="register-input-group">
            <label>Confirm Password</label>

            <div className="register-password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="register-submit-btn"
          >
            Create Account
          </button>

          <p className="register-login-link">
            Already have an account?{" "}
            <Link to="/login">Sign In</Link>
          </p>

          <Link to="/" className="register-back-link">
            ← Back to Home
          </Link>
        </form>
      </div>
    </div>
  );
}
