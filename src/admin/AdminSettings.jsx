import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminSettings.css";

export default function AdminSettings() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: localStorage.getItem("rrAdminName") || "RR Resort Admin",
    email: localStorage.getItem("rrAdminEmail") || "admin@rrresort.com",
    phone: localStorage.getItem("rrAdminPhone") || ""
  });

  const [password, setPassword] = useState({
    current: "",
    newPassword: "",
    confirm: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleProfileChange(e) {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  }

  function handlePasswordChange(e) {
    setPassword({
      ...password,
      [e.target.name]: e.target.value
    });
  }

  function saveProfile(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!profile.name || !profile.email) {
      setError("Please enter your name and email.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    localStorage.setItem("rrAdminName", profile.name);
    localStorage.setItem("rrAdminEmail", profile.email);
    localStorage.setItem("rrAdminPhone", profile.phone);

    setMessage("Profile updated successfully!");
  }

  function changePassword(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    const savedPassword = localStorage.getItem("rrAdminPassword") || "admin123";

    if (password.current !== savedPassword) {
      setError("Current password is incorrect.");
      return;
    }

    if (password.newPassword.length < 6) {
      setError("New password must contain at least 6 characters.");
      return;
    }

    if (password.newPassword !== password.confirm) {
      setError("New password and confirm password do not match.");
      return;
    }

    localStorage.setItem("rrAdminPassword", password.newPassword);

    setPassword({
      current: "",
      newPassword: "",
      confirm: ""
    });

    setMessage("Password changed successfully!");
  }

  function handleLogout() {
    localStorage.removeItem("rrAdminLoggedIn");
    navigate("/admin/login");
  }

  return (
    <div className="admin-settings-page">
      <div className="settings-page-heading">
        <div>
          <span>ACCOUNT MANAGEMENT</span>
          <h1>Admin Settings</h1>
          <p>Manage your administrator account and security.</p>
        </div>
      </div>

      {message && <div className="settings-message">{message}</div>}
      {error && <div className="settings-error">{error}</div>}

      <div className="settings-layout">
        <section className="settings-card">
          <div className="settings-card-heading">
            <div className="settings-icon">♙</div>
            <div>
              <h2>Profile Information</h2>
              <p>Update your administrator details.</p>
            </div>
          </div>

          <form onSubmit={saveProfile}>
            <div className="settings-avatar">
              {profile.name.charAt(0).toUpperCase()}
            </div>

            <div className="settings-form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                placeholder="Enter your name"
              />
            </div>

            <div className="settings-form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                placeholder="Enter email address"
              />
            </div>

            <div className="settings-form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                placeholder="Enter phone number"
              />
            </div>

            <button className="settings-save-btn" type="submit">
              Save Profile
            </button>
          </form>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading">
            <div className="settings-icon">♧</div>
            <div>
              <h2>Change Password</h2>
              <p>Keep your administrator account secure.</p>
            </div>
          </div>

          <form onSubmit={changePassword}>
            <div className="settings-form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="current"
                value={password.current}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
              />
            </div>

            <div className="settings-form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={password.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
              />
            </div>

            <div className="settings-form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirm"
                value={password.confirm}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
              />
            </div>

            <button className="settings-save-btn" type="submit">
              Update Password
            </button>
          </form>
        </section>

        <section className="settings-card settings-danger-card">
          <div className="settings-card-heading">
            <div className="settings-icon">↗</div>
            <div>
              <h2>Account Session</h2>
              <p>Sign out from the administrator panel.</p>
            </div>
          </div>

          <p className="settings-session-text">
            Make sure you save your changes before signing out.
          </p>

          <button
            className="settings-logout-btn"
            onClick={handleLogout}
          >
            Logout from Admin Panel
          </button>
        </section>
      </div>
    </div>
  );
}