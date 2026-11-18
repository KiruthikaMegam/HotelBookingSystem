import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHotel } from "../context/HotelContext";
import "./Profile.css";

export default function Profile() {
  const { customer, updateCustomer, bookings } = useHotel();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: customer.name || "",
    email: customer.email || "",
    phone: customer.phone || "",
    address: customer.address || ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    setError("");
    setSuccess("");
  }

  function handleLogout() {
    localStorage.removeItem("rrCustomerLoggedIn");
    navigate("/", { replace: true });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.address) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    updateCustomer(form);

    setSuccess("Your profile has been updated successfully.");
    setError("");
  }

  const initials = form.name
    ? form.name.charAt(0).toUpperCase()
    : "G";

  const myBookings = bookings.filter(
    (booking) =>
      booking.email === customer.email ||
      booking.guest?.email === customer.email
  );

  return (
    <main className="profile-page page-animation">
      <section className="profile-banner">
        <div className="container">
          <span>MY ACCOUNT</span>
          <h1>My Profile</h1>
          <p>Manage your personal information and account details.</p>
        </div>
      </section>

      <section className="profile-section container">
        <div className="profile-layout">

          <aside className="profile-sidebar">
            <div className="profile-avatar">
              {initials}
            </div>

            <h2>{form.name || "Guest User"}</h2>
            <p>{form.email || "guest@gmail.com"}</p>

            <div className="profile-divider"></div>

            <div className="profile-stat">
              <span>Total Bookings</span>
              <strong>{myBookings.length}</strong>
            </div>

            <div className="profile-stat">
              <span>Account Type</span>
              <strong>Guest</strong>
            </div>

            <div className="profile-note">
              <span>RR RESORT</span>
              <p>
                Enjoy a comfortable stay and create beautiful memories
                with us.
              </p>
            </div>
            <button
              type="button"
              className="profile-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </aside>

          <div className="profile-form-card">
            <div className="profile-form-heading">
              <div>
                <span>PERSONAL DETAILS</span>
                <h2>Personal Information</h2>
                <p>Update your details below.</p>
              </div>

              <div className="profile-edit-icon">✎</div>
            </div>

            {error && (
              <div className="profile-message error-message">
                {error}
              </div>
            )}

            {success && (
              <div className="profile-message success-message">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="profile-input-grid">

                <div className="profile-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="profile-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="profile-field">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter 10-digit phone number"
                    value={form.phone}
                    onChange={handleChange}
                    maxLength="10"
                  />
                </div>

                <div className="profile-field">
                  <label>Address</label>
                  <textarea
                    name="address"
                    placeholder="Enter your address"
                    value={form.address}
                    onChange={handleChange}
                    rows="4"
                  />
                </div>

              </div>

              <div className="profile-form-actions">
                <button
                  type="button"
                  className="profile-reset-btn"
                  onClick={() => {
                    setForm({
                      name: customer.name || "",
                      email: customer.email || "",
                      phone: customer.phone || "",
                      address: customer.address || ""
                    });
                    setError("");
                    setSuccess("");
                  }}
                >
                  Reset
                </button>

                <button type="submit" className="profile-save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>

        </div>
      </section>
    </main>
  );
}
