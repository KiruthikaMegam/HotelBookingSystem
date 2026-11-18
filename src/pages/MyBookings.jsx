import { useState } from "react";
import { Link } from "react-router-dom";
import { useHotel } from "../context/HotelContext";
import "./MyBookings.css";

export default function MyBookings() {
  const {
    bookings,
    customer,
    currentCustomerId,
    cancelBooking
  } = useHotel();

  const [activeFilter, setActiveFilter] = useState("All");
  const [cancelId, setCancelId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const isLoggedIn =
    localStorage.getItem("rrCustomerLoggedIn") === "true" &&
    Boolean(currentCustomerId) &&
    Boolean(customer?.email);

  // Get booking status
  function getBookingStatus(booking) {
    return booking.bookingStatus || booking.status || "Pending";
  }

  // Get customer name
  function getGuestName(booking) {
    return (
      booking.customerName ||
      booking.guestName ||
      booking.guest?.name ||
      customer.name ||
      "Guest"
    );
  }

  // Get customer email
  function getGuestEmail(booking) {
    return (
      booking.customerEmail ||
      booking.email ||
      booking.guest?.email ||
      "-"
    );
  }

  // Get customer phone
  function getGuestPhone(booking) {
    return (
      booking.customerPhone ||
      booking.phone ||
      booking.guest?.phone ||
      customer.phone ||
      "-"
    );
  }

  // Get booking amount
  function getBookingAmount(booking) {
    return Number(
      booking.totalAmount ||
      booking.totalPrice ||
      0
    );
  }

  // Get room amount
  function getRoomAmount(booking) {
    return Number(
      booking.roomTotal ||
      booking.totalAmount ||
      booking.totalPrice ||
      0
    );
  }

  // Get payment status
  function getPaymentStatus(booking) {
    return booking.paymentStatus || "Pending";
  }

  // Get guest count
  function getGuestCount(booking) {
    if (booking.guests) {
      return booking.guests;
    }

    const adults = Number(booking.adults || 0);
    const children = Number(booking.children || 0);

    return adults + children;
  }

  // Get duration
  function getNights(booking) {
    if (booking.nights) {
      return booking.nights;
    }

    if (!booking.checkIn || !booking.checkOut) {
      return 0;
    }

    const start = new Date(
      booking.checkIn + "T00:00:00"
    );

    const end = new Date(
      booking.checkOut + "T00:00:00"
    );

    const difference = end - start;

    return Math.round(
      difference / (1000 * 60 * 60 * 24)
    );
  }

  // Get booking room name
  function getRoomName(booking) {
    return booking.roomName || "Room";
  }

  // Get booking room image
  function getRoomImage(booking) {
    return booking.roomImage || booking.image || "";
  }

  // Get room type
  function getRoomType(booking) {
    return booking.roomType || "Room";
  }

  // Get booking status class
  function getStatusClass(status) {
    return String(status || "Pending").toLowerCase();
  }

  // Get current customer's bookings
  const customerBookings = bookings.filter((booking) => {
    const bookingCustomerId = booking.customerId;

    const matchesCustomerId =
      bookingCustomerId &&
      String(bookingCustomerId) ===
        String(currentCustomerId);

    const bookingEmail =
      booking.customerEmail ||
      booking.email ||
      booking.guest?.email ||
      "";

    const matchesEmail =
      bookingEmail.toLowerCase() ===
      (customer?.email || "").toLowerCase();

    return matchesCustomerId || matchesEmail;
  });

  // Filter bookings
  const filteredBookings = customerBookings.filter(
    (booking) => {
      if (activeFilter === "All") {
        return true;
      }

      return (
        getBookingStatus(booking) === activeFilter
      );
    }
  );

  // Sort latest booking first
  const sortedBookings = [...filteredBookings].sort(
    (a, b) => {
      const dateA = a.createdAt
        ? new Date(a.createdAt).getTime()
        : 0;

      const dateB = b.createdAt
        ? new Date(b.createdAt).getTime()
        : 0;

      return dateB - dateA;
    }
  );

  // Statistics
  let confirmedCount = 0;
  let cancelledCount = 0;
  let totalBookingValue = 0;

  for (const booking of customerBookings) {
    const status = getBookingStatus(booking);

    if (status === "Confirmed") {
      confirmedCount++;
    }

    if (status === "Cancelled") {
      cancelledCount++;
    }

    if (status !== "Cancelled") {
      totalBookingValue += getBookingAmount(booking);
    }
  }

  // Format date
  function formatDate(date) {
    if (!date) {
      return "-";
    }

    return new Date(
      date + "T00:00:00"
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  // Open cancellation modal
  function openCancelModal(id) {
    setCancelId(id);
    setShowCancelModal(true);
    setSuccessMessage("");
  }

  // Close cancellation modal
  function closeCancelModal() {
    setCancelId(null);
    setShowCancelModal(false);
  }

  // Cancel booking
  function handleCancelBooking() {
    if (!cancelId) {
      return;
    }

    const result = cancelBooking(cancelId);

    if (result) {
      setSuccessMessage(
        "Your booking has been cancelled successfully."
      );
    } else {
      setSuccessMessage(
        "Unable to cancel this booking. Please try again."
      );
    }

    closeCancelModal();
  }

  // Sign-in page
  if (!isLoggedIn) {
    return (
      <main className="my-bookings-page page-animation">
        <div className="my-bookings-container">

          <div className="my-bookings-empty">

            <div className="empty-booking-icon">
              🔒
            </div>

            <h2>Sign In to View Your Bookings</h2>

            <p>
              Please sign in to your RR Resort account to view
              your booking history and manage your reservations.
            </p>

            <Link
              to="/login"
              className="primary-btn"
            >
              Sign In
            </Link>

            <p style={{ marginTop: "15px" }}>
              Don't have an account?{" "}
              <Link to="/register">
                Create an Account
              </Link>
            </p>

          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="my-bookings-page page-animation">
      <div className="my-bookings-container">

        {/* Heading */}
        <div className="my-bookings-heading">

          <div>
            <span>YOUR RR RESORT JOURNEY</span>

            <h1>My Bookings</h1>

            <p>
              Manage your reservations and plan your next getaway.
            </p>
          </div>

          <Link
            to="/rooms"
            className="primary-btn"
          >
            + Book a Room
          </Link>

        </div>

        {/* Booking Statistics */}
        <div className="booking-stat-grid">

          <div className="booking-stat-card">
            <span className="booking-stat-icon">
              📋
            </span>

            <div>
              <strong>{customerBookings.length}</strong>

              <small>Total Bookings</small>
            </div>
          </div>

          <div className="booking-stat-card">
            <span className="booking-stat-icon">
              ✓
            </span>

            <div>
              <strong>{confirmedCount}</strong>

              <small>Confirmed</small>
            </div>
          </div>

          <div className="booking-stat-card">
            <span className="booking-stat-icon">
              ✕
            </span>

            <div>
              <strong>{cancelledCount}</strong>

              <small>Cancelled</small>
            </div>
          </div>

          <div className="booking-stat-card">
            <span className="booking-stat-icon">
              ₹
            </span>

            <div>
              <strong>
                ₹{totalBookingValue.toLocaleString("en-IN")}
              </strong>

              <small>Total Booking Value</small>
            </div>
          </div>

        </div>

        {/* Reservation History */}
        <div className="my-bookings-toolbar">

          <div>
            <h2>Reservation History</h2>

            <p>
              {sortedBookings.length} reservations found
            </p>
          </div>

          <div className="booking-filter-tabs">

            {["All", "Confirmed", "Pending", "Cancelled"].map(
              (filter) => (
                <button
                  key={filter}
                  className={
                    activeFilter === filter
                      ? "active"
                      : ""
                  }
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              )
            )}

          </div>

        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="booking-success-message">

            <span>✓</span>

            {successMessage}

            <button
              onClick={() => setSuccessMessage("")}
            >
              ×
            </button>

          </div>
        )}

        {/* Booking List */}
        {sortedBookings.length > 0 ? (
          <div className="my-bookings-list">

            {sortedBookings.map((booking) => {
              const status = getBookingStatus(booking);
              const roomImage = getRoomImage(booking);

              return (
                <div
                  className="my-booking-card"
                  key={booking.id}
                >

                  {/* Room Image */}
                  <div className="my-booking-image">

                    {roomImage ? (
                      <img
                        src={roomImage}
                        alt={getRoomName(booking)}
                      />
                    ) : (
                      <div className="booking-image-placeholder">
                        🏨
                      </div>
                    )}

                  </div>

                  {/* Booking Content */}
                  <div className="my-booking-content">

                    {/* Booking Header */}
                    <div className="my-booking-top">

                      <div>
                        <span className="my-booking-type">
                          {getRoomType(booking)}
                        </span>

                        <h3>
                          {getRoomName(booking)}
                        </h3>

                        <p className="my-booking-id">
                          Booking ID: {booking.id}
                        </p>
                      </div>

                      <span
                        className={`booking-status-badge ${getStatusClass(
                          status
                        )}`}
                      >
                        {status}
                      </span>

                    </div>

                    {/* Booking Information */}
                    <div className="my-booking-info-grid">

                      <div>
                        <span>CHECK-IN</span>

                        <strong>
                          {formatDate(booking.checkIn)}
                        </strong>
                      </div>

                      <div>
                        <span>CHECK-OUT</span>

                        <strong>
                          {formatDate(booking.checkOut)}
                        </strong>
                      </div>

                      <div>
                        <span>GUESTS</span>

                        <strong>
                          {getGuestCount(booking)} Guests
                        </strong>
                      </div>

                      <div>
                        <span>DURATION</span>

                        <strong>
                          {getNights(booking)} Nights
                        </strong>
                      </div>

                    </div>

                    {/* Extra Booking Information */}
                    <div className="my-booking-extra-grid">

                      <div>
                        <span>GUEST NAME</span>

                        <strong>
                          {getGuestName(booking)}
                        </strong>
                      </div>

                      <div>
                        <span>CONTACT</span>

                        <strong>
                          {getGuestPhone(booking)}
                        </strong>
                      </div>

                      <div>
                        <span>PRICE / NIGHT</span>

                        <strong>
                          ₹
                          {Number(
                            booking.pricePerNight ||
                            booking.price ||
                            0
                          ).toLocaleString("en-IN")}
                        </strong>
                      </div>

                      <div>
                        <span>ROOM AMOUNT</span>

                        <strong>
                          ₹
                          {getRoomAmount(
                            booking
                          ).toLocaleString("en-IN")}
                        </strong>
                      </div>

                      <div>
                        <span>SERVICE FEE</span>

                        <strong>
                          ₹
                          {Number(
                            booking.serviceFee || 0
                          ).toLocaleString("en-IN")}
                        </strong>
                      </div>

                      <div className="booking-extra-wide">
                        <span>EMAIL ADDRESS</span>

                        <strong>
                          {getGuestEmail(booking)}
                        </strong>
                      </div>

                      <div className="booking-extra-wide">
                        <span>GUEST ADDRESS</span>

                        <strong>
                          {booking.customerAddress ||
                            booking.address ||
                            booking.guest?.address ||
                            "-"}
                        </strong>
                      </div>

                      {(booking.requests ||
                        booking.specialRequests) && (
                        <div className="booking-extra-wide">

                          <span>SPECIAL REQUESTS</span>

                          <strong>
                            {booking.requests ||
                              booking.specialRequests}
                          </strong>

                        </div>
                      )}

                    </div>

                    {/* Booking Bottom */}
                    <div className="my-booking-bottom">

                      <div>
                        <span>Total Amount</span>

                        <strong>
                          ₹
                          {getBookingAmount(
                            booking
                          ).toLocaleString("en-IN")}
                        </strong>

                        <small>
                          Payment: {getPaymentStatus(booking)}
                        </small>
                      </div>

                      {status !== "Cancelled" && (
                        <button
                          className="cancel-booking-btn"
                          onClick={() =>
                            openCancelModal(booking.id)
                          }
                        >
                          Cancel Booking
                        </button>
                      )}

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        ) : (
          /* Empty State */
          <div className="my-bookings-empty">

            <div className="empty-booking-icon">
              ▤
            </div>

            <h2>
              {customerBookings.length === 0
                ? "No Bookings Yet"
                : "No Reservations Found"}
            </h2>

            <p>
              {customerBookings.length === 0
                ? "You haven't made any reservations yet. Explore our rooms and plan your stay."
                : "There are no bookings under this status."}
            </p>

            <Link
              to="/rooms"
              className="primary-btn"
            >
              Explore Rooms
            </Link>

          </div>
        )}

      </div>

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div className="cancel-modal-overlay">

          <div className="cancel-modal">

            <div className="cancel-modal-icon">
              !
            </div>

            <h2>Cancel Reservation?</h2>

            <p>
              Are you sure you want to cancel this booking?
              This action cannot be undone.
            </p>

            <div className="cancel-modal-actions">

              <button
                className="cancel-modal-back"
                onClick={closeCancelModal}
              >
                Keep Booking
              </button>

              <button
                className="cancel-modal-confirm"
                onClick={handleCancelBooking}
              >
                Yes, Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}