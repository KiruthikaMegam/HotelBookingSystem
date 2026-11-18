
import { useLocation, Link, Navigate } from "react-router-dom";
import { useHotel } from "../context/HotelContext";
import "./Confirmation.css";

export default function Confirmation() {
  const location = useLocation();
  const { bookings } = useHotel();

  const bookingFromState = location.state?.booking;

  const booking = bookingFromState
    ? bookings.find((item) => item.id === bookingFromState.id) || bookingFromState
    : null;

  if (!booking) {
    return <Navigate to="/my-bookings" replace />;
  }

  function formatDate(date) {
    if (!date) return "-";

    return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  }

  return (
    <main className="confirmation-page page-animation">

      <div className="confirmation-container">

        <div className="confirmation-success">
          <div className="success-icon">
            <span>✓</span>
          </div>

          <span className="confirmation-label">RR RESORT RESERVATION</span>

          <h1>Your Booking is Confirmed!</h1>

          <p>
            Thank you for choosing RR Resort. We look forward to
            making your stay special.
          </p>

          <div className="confirmation-booking-id">
            <span>BOOKING REFERENCE</span>
            <strong>{booking.id}</strong>
          </div>
        </div>

        <div className="confirmation-details-card">

          <div className="confirmation-card-heading">
            <div>
              <span>YOUR RESERVATION</span>
              <h2>Booking Details</h2>
            </div>

            <span className="confirmed-badge">
              {booking.status}
            </span>
          </div>

          <div className="confirmation-room">
            <img
              src={booking.roomImage}
              alt={booking.roomName}
            />

            <div>
              <span>{booking.roomType} Collection</span>
              <h3>{booking.roomName}</h3>
              <p>⭐ RR Resort Premium Stay</p>
            </div>
          </div>

          <div className="confirmation-info-grid">

            <div className="confirmation-info">
              <span>CHECK-IN</span>
              <strong>{formatDate(booking.checkIn)}</strong>
            </div>

            <div className="confirmation-info">
              <span>CHECK-OUT</span>
              <strong>{formatDate(booking.checkOut)}</strong>
            </div>

            <div className="confirmation-info">
              <span>DURATION</span>
              <strong>{booking.nights} Nights</strong>
            </div>

            <div className="confirmation-info">
              <span>GUESTS</span>
              <strong>{booking.guests} Guests</strong>
            </div>

          </div>

          <div className="confirmation-divider"></div>

          <div className="confirmation-guest-details">
            <h3>Guest Information</h3>

            <div>
              <span>Full Name</span>
              <strong>{booking.guestName}</strong>
            </div>

            <div>
              <span>Email Address</span>
              <strong>{booking.email}</strong>
            </div>

            <div>
              <span>Phone Number</span>
              <strong>{booking.phone}</strong>
            </div>

            <div>
              <span>Address</span>
              <strong>{booking.address || booking.guest?.address || "-"}</strong>
            </div>

            {booking.requests && (
              <div>
                <span>Special Requests</span>
                <strong>{booking.requests}</strong>
              </div>
            )}
          </div>

          <div className="confirmation-divider"></div>

          <div className="confirmation-payment">

            <h3>Payment Summary</h3>

            <div>
              <span>Price Per Night</span>
              <strong>
                ₹{Number(booking.pricePerNight).toLocaleString("en-IN")}
              </strong>
            </div>

            <div>
              <span>Room Total ({booking.nights} Nights)</span>
              <strong>
                ₹{Number(booking.roomTotal ?? booking.totalPrice).toLocaleString("en-IN")}
              </strong>
            </div>

            {Number(booking.serviceFee) > 0 && (
              <div>
                <span>Service Fee</span>
                <strong>
                  ₹{Number(booking.serviceFee).toLocaleString("en-IN")}
                </strong>
              </div>
            )}

            <div className="confirmation-total">
              <span>Total Amount</span>
              <strong>
                ₹{Number(booking.totalPrice).toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="confirmation-payment-status">
              <span>Payment Status</span>
              <strong>{booking.paymentStatus}</strong>
            </div>

          </div>

          <div className="confirmation-footer-note">
            <span>✦</span>
            <p>
              Please keep your booking reference handy when you arrive
              at RR Resort.
            </p>
          </div>

        </div>

        <div className="confirmation-actions">
          <Link to="/my-bookings" className="primary-btn">
            View My Bookings
          </Link>

          <Link to="/rooms" className="confirmation-secondary-btn">
            Explore More Rooms
          </Link>
        </div>

      </div>

    </main>
  );
}
