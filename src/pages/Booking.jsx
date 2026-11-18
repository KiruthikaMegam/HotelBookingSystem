
import { useState } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { useHotel } from "../context/HotelContext";
import "./Booking.css";

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { rooms, customer, updateCustomer, createBooking } = useHotel();

  const room = rooms.find((item) => String(item.id) === id);

  const [form, setForm] = useState({
    name: customer.name || "",
    email: customer.email || "",
    phone: customer.phone || "",
    address: customer.address || "",
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
    adults: Number(searchParams.get("adults")) || 2,
    children: Number(searchParams.get("children")) || 0,
    requests: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!room) {
    return (
      <div className="booking-not-found">
        <h2>Room Not Found</h2>
        <Link to="/rooms" className="primary-btn">Browse Rooms</Link>
      </div>
    );
  }

  const nights = form.checkIn && form.checkOut
    ? Math.ceil(
        (new Date(form.checkOut + "T00:00:00") -
          new Date(form.checkIn + "T00:00:00")) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const totalGuests = Number(form.adults) + Number(form.children);
  const roomTotal = nights > 0 ? nights * room.price : 0;
  const serviceFee = roomTotal > 0 ? Math.round(roomTotal * 0.05) : 0;
  const grandTotal = roomTotal + serviceFee;

  function handleChange(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.phone || !form.address) {
      setError("Please complete all required personal details.");
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

    if (!form.checkIn || !form.checkOut) {
      setError("Please select your check-in and check-out dates.");
      return;
    }

    if (form.checkIn < getToday()) {
      setError("Check-in date cannot be in the past.");
      return;
    }

    if (form.checkOut <= form.checkIn) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    if (totalGuests < 1 || totalGuests > room.capacity) {
      setError(`This room allows a maximum of ${room.capacity} guests.`);
      return;
    }

    setLoading(true);

    const customerDetails = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address
    };

    updateCustomer(customerDetails);

    const result = createBooking({
      roomId: room.id,
      guest: customerDetails,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      adults: Number(form.adults),
      children: Number(form.children),
      requests: form.requests,
      serviceFee
    });

    setLoading(false);

    if (!result.success) {
      setError(result.message || "Unable to complete your booking.");
      return;
    }

    navigate("/confirmation", {
      state: { booking: result.booking }
    });
  }

  return (
    <main className="booking-page page-animation">

      <div className="booking-container">

        <div className="booking-page-heading">
          <span>RR RESORT RESERVATION</span>
          <h1>Complete Your Booking</h1>
          <p>Just a few details before your relaxing getaway.</p>
        </div>

        <div className="booking-steps">
          <div className="booking-step completed">
            <span>✓</span>
            <small>Select Room</small>
          </div>

          <div className="booking-step active">
            <span>2</span>
            <small>Guest Details</small>
          </div>

          <div className="booking-step">
            <span>3</span>
            <small>Confirmation</small>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="booking-form-layout">

          <div className="booking-form-content">

            <section className="booking-form-card">
              <div className="form-section-heading">
                <span>01</span>
                <div>
                  <h2>Guest Information</h2>
                  <p>Enter the primary guest's contact details.</p>
                </div>
              </div>

              <div className="booking-input-grid">

                <div className="booking-input-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="booking-input-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="example@gmail.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="booking-input-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={handleChange}
                    maxLength="10"
                    required
                  />
                </div>

                <div className="booking-input-group full-width">
                  <label>Address *</label>
                  <textarea
                    name="address"
                    placeholder="Enter your full address"
                    value={form.address}
                    onChange={handleChange}
                    rows="3"
                    required
                  />
                </div>

              </div>
            </section>

            <section className="booking-form-card">
              <div className="form-section-heading">
                <span>02</span>
                <div>
                  <h2>Stay Information</h2>
                  <p>Review your dates and number of guests.</p>
                </div>
              </div>

              <div className="booking-input-grid">

                <div className="booking-input-group">
                  <label>Check-in Date</label>
                  <input
                    type="date"
                    name="checkIn"
                    min={getToday()}
                    value={form.checkIn}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="booking-input-group">
                  <label>Check-out Date</label>
                  <input
                    type="date"
                    name="checkOut"
                    min={form.checkIn || getToday()}
                    value={form.checkOut}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="booking-input-group">
                  <label>Adults</label>
                  <select
                    name="adults"
                    value={form.adults}
                    onChange={handleChange}
                  >
                    {[1, 2, 3, 4, 5, 6].map((number) => (
                      <option key={number} value={number}>
                        {number} Adult{number > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="booking-input-group">
                  <label>Children</label>
                  <select
                    name="children"
                    value={form.children}
                    onChange={handleChange}
                  >
                    {[0, 1, 2, 3, 4].map((number) => (
                      <option key={number} value={number}>
                        {number} Children
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="booking-guest-note">
                Maximum room capacity: {room.capacity} guests
              </div>
            </section>

            <section className="booking-form-card">
              <div className="form-section-heading">
                <span>03</span>
                <div>
                  <h2>Special Requests</h2>
                  <p>Let us know if you need anything special.</p>
                </div>
              </div>

              <div className="booking-input-group">
                <label>Additional Requests (Optional)</label>
                <textarea
                  name="requests"
                  placeholder="Any special arrangements or preferences?"
                  value={form.requests}
                  onChange={handleChange}
                  rows="4"
                />
              </div>
            </section>

          </div>

          <aside className="booking-summary-card">

            <h2>Booking Summary</h2>

            <div className="booking-summary-room">
              <img src={room.image} alt={room.name} />

              <div>
                <span>{room.type} Room</span>
                <h3>{room.name}</h3>
                <p>⭐ {room.rating} · {room.reviews} Reviews</p>
              </div>
            </div>

            <div className="summary-details">
              <div>
                <span>Check-in</span>
                <strong>{form.checkIn || "Not selected"}</strong>
              </div>

              <div>
                <span>Check-out</span>
                <strong>{form.checkOut || "Not selected"}</strong>
              </div>

              <div>
                <span>Guests</span>
                <strong>{totalGuests} Guests</strong>
              </div>

              <div>
                <span>Duration</span>
                <strong>{nights > 0 ? `${nights} Nights` : "--"}</strong>
              </div>
            </div>

            <div className="summary-price-details">
              <div>
                <span>Room Price</span>
                <strong>₹{roomTotal.toLocaleString("en-IN")}</strong>
              </div>

              <div>
                <span>Service Fee (5%)</span>
                <strong>₹{serviceFee.toLocaleString("en-IN")}</strong>
              </div>

              <div className="summary-grand-total">
                <span>Total Amount</span>
                <strong>₹{grandTotal.toLocaleString("en-IN")}</strong>
              </div>
            </div>

            {error && (
              <div className="booking-form-error">{error}</div>
            )}

            <button
              type="submit"
              className="primary-btn confirm-booking-btn"
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm Booking →"}
            </button>

            <p className="booking-summary-note">
              Your reservation will be saved securely.
            </p>

            <div className="booking-payment-note">
              <span>🔒</span>
              <div>
                <strong>Secure Reservation</strong>
                <p>Payment status will initially be marked as pending.</p>
              </div>
            </div>

          </aside>

        </form>

      </div>

    </main>
  );
}
