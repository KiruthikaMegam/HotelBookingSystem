
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubscribe(e) {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setMessage("Thank you for subscribing!");
    setEmail("");
  }

  return (
    <footer className="footer" id="contact">
      <div className="footer-main container">

        <div className="footer-about">
          <Link to="/" className="footer-logo">
            <span className="footer-logo-icon">RR</span>
            <span>RESORT</span>
          </Link>

          <p>
            Experience comfort, luxury and unforgettable hospitality.
            Make every moment special with your stay at RR RESORT.
          </p>

          <div className="footer-socials">
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
              f
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
              ◎
            </a>
            <a href="https://www.youtube.com/" target="_blank" rel="noreferrer">
              ▶
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
              in
            </a>
          </div>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/rooms">Our Rooms</Link>
          <Link to="/my-bookings">My Bookings</Link>
          <Link to="/profile">My Account</Link>
          <a href="/#about">About Us</a>
        </div>

        <div className="footer-links">
          <h3>Our Services</h3>
          <a href="/#services">Luxury Rooms</a>
          <a href="/#services">Room Service</a>
          <a href="/#services">Restaurant</a>
          <a href="/#services">Swimming Pool</a>
          <a href="/#services">Free Wi-Fi</a>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>

          <p>
            <span>⌖</span>
            RR Resort, Tamil Nadu, India
          </p>

          <p>
            <span>☎</span>
            +91 98765 43210
          </p>

          <p>
            <span>✉</span>
            info@rrresort.com
          </p>

          <div className="footer-newsletter">
            <h4>Subscribe to Newsletter</h4>

            <form onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setMessage("");
                }}
              />

              <button type="submit">→</button>
            </form>

            {message && (
              <p className="newsletter-message">{message}</p>
            )}
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>© {new Date().getFullYear()} RR RESORT. All Rights Reserved.</p>

          <div>
            <a href="/#privacy">Privacy Policy</a>
            <a href="/#terms">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
