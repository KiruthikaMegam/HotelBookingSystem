
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Contact.css";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
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

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.subject ||
      !form.message
    ) {
      setError("Please fill in all fields.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (form.message.length < 10) {
      setError("Message must contain at least 10 characters.");
      return;
    }

    setSuccess(
      "Thank you for contacting RR RESORT! Your message has been received."
    );

    setForm({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
  }

  return (
    <main className="contact-page page-animation">

      {/* Banner */}
      <section className="contact-banner">
        <div className="container">
          <span>GET IN TOUCH</span>
          <h1>Contact Us</h1>
          <p>
            We would love to hear from you.
            Let us help make your stay special.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="contact-section section-padding">
        <div className="container">

          <div className="section-heading">
            <span>WE ARE HERE FOR YOU</span>
            <h2>Let's Start a Conversation</h2>
            <p>
              Have a question about your stay? Contact our team.
            </p>
          </div>

          <div className="contact-info-grid">

            <div className="contact-info-card">
              <div className="contact-info-icon">☎</div>
              <h3>Call Us</h3>
              <p>Speak with our hospitality team.</p>
              <a href="tel:+919876543210">+91 98765 43210</a>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">✉</div>
              <h3>Email Us</h3>
              <p>Send us your questions anytime.</p>
              <a href="mailto:info@rrresort.com">
                info@rrresort.com
              </a>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">⌖</div>
              <h3>Visit Us</h3>
              <p>We look forward to welcoming you.</p>
              <span>RR RESORT, India</span>
            </div>

          </div>

          {/* Contact Form */}
          <div className="contact-form-layout">

            <div className="contact-form-content">
              <span className="contact-eyebrow">SEND US A MESSAGE</span>
              <h2>How Can We Help You?</h2>

              <p>
                Whether you need help with a reservation,
                want to know more about our rooms, or have
                a special request, please send us a message.
              </p>

              <div className="contact-form-image">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=85"
                  alt="Beautiful RR Resort"
                />
              </div>

              <div className="contact-help-note">
                <strong>RR RESORT</strong>
                <p>
                  Your comfort and satisfaction are always
                  important to us.
                </p>
              </div>
            </div>

            <div className="contact-form-card">
              <div className="contact-form-heading">
                <h3>Send a Message</h3>
                <p>Fill out the form below.</p>
              </div>

              {error && (
                <div className="contact-message error-message">
                  {error}
                </div>
              )}

              {success && (
                <div className="contact-message success-message">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="contact-input-grid">

                  <div className="contact-field">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="contact-field">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="contact-field">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="10-digit phone number"
                      maxLength="10"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="contact-field">
                    <label>Subject</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                    >
                      <option value="">Select a subject</option>
                      <option value="Room Booking">Room Booking</option>
                      <option value="Room Information">Room Information</option>
                      <option value="Payment Enquiry">Payment Enquiry</option>
                      <option value="Other">Other Enquiry</option>
                    </select>
                  </div>

                  <div className="contact-field contact-message-field">
                    <label>Your Message</label>
                    <textarea
                      name="message"
                      placeholder="Write your message here..."
                      rows="5"
                      value={form.message}
                      onChange={handleChange}
                    />
                  </div>

                </div>

                <button type="submit" className="contact-submit-btn">
                  Send Message <span>→</span>
                </button>
              </form>
            </div>

          </div>

        </div>
      </section>

      {/* Location */}
      <section className="contact-location">
        <div className="container">
          <div className="contact-location-content">
            <div>
              <span>FIND OUR LOCATION</span>
              <h2>We Look Forward to Welcoming You</h2>
              <p>
                Plan your next relaxing getaway with RR RESORT.
                Explore our rooms and book your stay today.
              </p>
            </div>

            <Link to="/rooms" className="contact-location-btn">
              Explore Rooms
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
