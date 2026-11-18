import { useState } from "react";
import { Link } from "react-router-dom";
import { useHotel } from "../context/HotelContext";
import "./ManageBookings.css";

export default function ManageBookings() {
  const {
    bookings,
    rooms,
    updateBookingStatus,
    updatePaymentStatus
  } = useHotel();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [message, setMessage] = useState("");

  function normalizeStatus(status) {
    return String(status || "Pending").toLowerCase();
  }

  function getGuestName(booking) {
    return (
      booking.guestName ||
      booking.customerName ||
      booking.guest?.name ||
      "Guest"
    );
  }

  function getGuestEmail(booking) {
    return (
      booking.email ||
      booking.customerEmail ||
      booking.guest?.email ||
      "No email"
    );
  }

  function getGuestPhone(booking) {
    return (
      booking.phone ||
      booking.customerPhone ||
      booking.guest?.phone ||
      "-"
    );
  }

  function getGuestAddress(booking) {
    return (
      booking.address ||
      booking.guest?.address ||
      "-"
    );
  }

  function getBookingStatus(booking) {
    return (
      booking.bookingStatus ||
      booking.status ||
      "Pending"
    );
  }

  function getPaymentStatus(booking) {
    return booking.paymentStatus || "Pending";
  }

  function getBookingAmount(booking) {
    return Number(
      booking.totalAmount ??
      booking.totalPrice ??
      0
    );
  }

  function getRoomName(roomId, booking) {
    for (const room of rooms) {
      if (String(room.id) === String(roomId)) {
        return room.name;
      }
    }

    return booking?.roomName || "Room not found";
  }

  function getStatusClass(status) {
    const currentStatus = normalizeStatus(status);

    if (
      currentStatus === "confirmed" ||
      currentStatus === "completed"
    ) {
      return "booking-confirmed";
    }

    if (currentStatus === "cancelled") {
      return "booking-cancelled";
    }

    return "booking-pending";
  }

  const filteredBookings = bookings.filter((booking) => {
    const guestName = getGuestName(booking);
    const guestEmail = getGuestEmail(booking);
    const roomName = getRoomName(booking.roomId, booking);

    const searchValue = search.toLowerCase();

    const matchesSearch =
      guestName.toLowerCase().includes(searchValue) ||
      guestEmail.toLowerCase().includes(searchValue) ||
      String(booking.id).toLowerCase().includes(searchValue) ||
      roomName.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "All" ||
      normalizeStatus(getBookingStatus(booking)) ===
        statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  let totalRevenue = 0;
  let pendingCount = 0;
  let confirmedCount = 0;
  let cancelledCount = 0;

  for (const booking of bookings) {
    const status = normalizeStatus(
      getBookingStatus(booking)
    );

    if (
      status === "confirmed" ||
      status === "completed"
    ) {
      confirmedCount++;
      totalRevenue += getBookingAmount(booking);
    }

    if (status === "pending") {
      pendingCount++;
    }

    if (status === "cancelled") {
      cancelledCount++;
    }
  }

  function handleStatusChange(id, status) {
    updateBookingStatus(id, status);

    setMessage("Booking status updated successfully.");
    setSelectedBooking(null);
  }

  function handlePaymentChange(id, status) {
    updatePaymentStatus(id, status);

    setMessage("Payment status updated successfully.");
    setSelectedBooking(null);
  }

  function closeMessage() {
    setMessage("");
  }

  return (
    <div className="manage-bookings-page">

      {/* Page Heading */}
      <div className="manage-bookings-heading">
        <div>
          <span className="admin-eyebrow">
            RESERVATION MANAGEMENT
          </span>

          <h1>Manage Bookings</h1>

          <p>
            View and manage all customer reservations.
          </p>
        </div>

        <Link to="/admin" className="booking-back-btn">
          ← Dashboard
        </Link>
      </div>

      {/* Success Message */}
      {message && (
        <div className="booking-success-message">
          <span>{message}</span>

          <button onClick={closeMessage}>
            ×
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="booking-stat-grid">

        <div className="booking-stat-card">
          <span>Total Bookings</span>

          <h2>{bookings.length}</h2>

          <small>All reservations</small>
        </div>

        <div className="booking-stat-card">
          <span>Confirmed</span>

          <h2>{confirmedCount}</h2>

          <small>Confirmed reservations</small>
        </div>

        <div className="booking-stat-card">
          <span>Pending</span>

          <h2>{pendingCount}</h2>

          <small>Waiting for approval</small>
        </div>

        <div className="booking-stat-card">
          <span>Total Revenue</span>

          <h2>
            ₹{totalRevenue.toLocaleString("en-IN")}
          </h2>

          <small>
            {cancelledCount} cancelled bookings
          </small>
        </div>

      </div>

      {/* Booking List */}
      <div className="booking-table-card">

        <div className="booking-table-heading">
          <div>
            <h2>Reservation List</h2>

            <p>
              Search and manage customer bookings.
            </p>
          </div>

          <span className="booking-count">
            {filteredBookings.length} Bookings
          </span>
        </div>

        {/* Search and Filter */}
        <div className="booking-filters">

          <div className="booking-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search guest, room or booking ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

        </div>

        {/* Booking Cards */}
        {filteredBookings.length === 0 ? (
          <div className="booking-empty">
            <div>▤</div>

            <h3>No Bookings Found</h3>

            <p>
              There are no reservations matching your search.
            </p>
          </div>
        ) : (
          <div className="booking-card-grid">

            {filteredBookings.map((booking) => {
              const guestName = getGuestName(booking);
              const guestEmail = getGuestEmail(booking);
              const bookingStatus = getBookingStatus(booking);
              const paymentStatus = getPaymentStatus(booking);
              const totalAmount = getBookingAmount(booking);

              return (
                <article
                  className="booking-card"
                  key={booking.id}
                >

                  {/* Card Header */}
                  <div className="booking-card-top">
                    <div>
                      <span className="booking-card-label">
                        BOOKING ID
                      </span>

                      <h3>#{booking.id}</h3>
                    </div>

                    <span
                      className={`booking-status ${getStatusClass(
                        bookingStatus
                      )}`}
                    >
                      {bookingStatus}
                    </span>
                  </div>

                  {/* Guest Details */}
                  <div className="booking-card-guest">

                    <div className="booking-avatar">
                      {guestName.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <strong>{guestName}</strong>

                      <small>{guestEmail}</small>
                    </div>

                  </div>

                  {/* Booking Information */}
                  <div className="booking-card-details">

                    <div>
                      <span>Room</span>

                      <strong>
                        {getRoomName(booking.roomId, booking)}
                      </strong>
                    </div>

                    <div>
                      <span>Check-in</span>

                      <strong>
                        {booking.checkIn || "-"}
                      </strong>
                    </div>

                    <div>
                      <span>Check-out</span>

                      <strong>
                        {booking.checkOut || "-"}
                      </strong>
                    </div>

                    <div>
                      <span>Payment</span>

                      <strong
                        className={
                          normalizeStatus(paymentStatus) === "paid"
                            ? "booking-paid-text"
                            : "booking-unpaid-text"
                        }
                      >
                        {paymentStatus}
                      </strong>
                    </div>

                  </div>

                  {/* Card Footer */}
                  <div className="booking-card-bottom">

                    <div>
                      <span>Total Amount</span>

                      <strong>
                        ₹{totalAmount.toLocaleString("en-IN")}
                      </strong>
                    </div>

                    <button
                      className="booking-view-btn"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      View Details <span>→</span>
                    </button>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div
          className="booking-modal-overlay"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="booking-details-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="booking-modal-close"
              onClick={() => setSelectedBooking(null)}
            >
              ×
            </button>

            <span className="admin-eyebrow">
              RESERVATION DETAILS
            </span>

            <h2>
              Booking #{selectedBooking.id}
            </h2>

            <div className="booking-detail-list">

              <p>
                <span>Guest Name</span>

                <strong>
                  {getGuestName(selectedBooking)}
                </strong>
              </p>

              <p>
                <span>Email</span>

                <strong>
                  {getGuestEmail(selectedBooking)}
                </strong>
              </p>

              <p>
                <span>Phone</span>

                <strong>
                  {getGuestPhone(selectedBooking)}
                </strong>
              </p>

              <p>
                <span>Room</span>

                <strong>
                  {getRoomName(
                    selectedBooking.roomId,
                    selectedBooking
                  )}
                </strong>
              </p>

              <p>
                <span>Guest Count</span>

                <strong>
                  {selectedBooking.adults
                    ? `${selectedBooking.adults} Adults`
                    : `${selectedBooking.guests || 0} Guests`}

                  {selectedBooking.children
                    ? `, ${selectedBooking.children} Children`
                    : ""}
                </strong>
              </p>

              <p>
                <span>Guest Address</span>

                <strong>
                  {getGuestAddress(selectedBooking)}
                </strong>
              </p>

              <p>
                <span>Check In</span>

                <strong>
                  {selectedBooking.checkIn || "-"}
                </strong>
              </p>

              <p>
                <span>Check Out</span>

                <strong>
                  {selectedBooking.checkOut || "-"}
                </strong>
              </p>

              <p>
                <span>Price Per Night</span>

                <strong>
                  ₹{Number(
                    selectedBooking.pricePerNight ||
                    selectedBooking.price ||
                    0
                  ).toLocaleString("en-IN")}
                </strong>
              </p>

              <p>
                <span>Room Amount</span>

                <strong>
                  ₹{Number(
                    selectedBooking.roomTotal ||
                    selectedBooking.totalAmount ||
                    selectedBooking.totalPrice ||
                    0
                  ).toLocaleString("en-IN")}
                </strong>
              </p>

              <p>
                <span>Service Fee</span>

                <strong>
                  ₹{Number(
                    selectedBooking.serviceFee || 0
                  ).toLocaleString("en-IN")}
                </strong>
              </p>

              <p>
                <span>Total Amount</span>

                <strong>
                  ₹{getBookingAmount(
                    selectedBooking
                  ).toLocaleString("en-IN")}
                </strong>
              </p>

              <p>
                <span>Special Requests</span>

                <strong>
                  {selectedBooking.requests ||
                    selectedBooking.specialRequests ||
                    "No special requests"}
                </strong>
              </p>

              <p>
                <span>Booking Created</span>

                <strong>
                  {selectedBooking.createdAt
                    ? new Date(
                        selectedBooking.createdAt
                      ).toLocaleString("en-IN")
                    : "-"}
                </strong>
              </p>

              <p>
                <span>Booking Status</span>

                <strong>
                  {getBookingStatus(selectedBooking)}
                </strong>
              </p>

              <p>
                <span>Payment Status</span>

                <strong>
                  {getPaymentStatus(selectedBooking)}
                </strong>
              </p>

            </div>

            {/* Modal Actions */}
            <div className="booking-modal-actions">

              {normalizeStatus(
                getBookingStatus(selectedBooking)
              ) !== "confirmed" &&
              normalizeStatus(
                getBookingStatus(selectedBooking)
              ) !== "completed" &&
              normalizeStatus(
                getBookingStatus(selectedBooking)
              ) !== "cancelled" && (
                <button
                  className="booking-confirm-action"
                  onClick={() =>
                    handleStatusChange(
                      selectedBooking.id,
                      "Confirmed"
                    )
                  }
                >
                  Confirm Booking
                </button>
              )}

              {normalizeStatus(
                getBookingStatus(selectedBooking)
              ) !== "cancelled" && (
                <button
                  className="booking-cancel-action"
                  onClick={() =>
                    handleStatusChange(
                      selectedBooking.id,
                      "Cancelled"
                    )
                  }
                >
                  Cancel Booking
                </button>
              )}

              {normalizeStatus(
                getPaymentStatus(selectedBooking)
              ) !== "paid" && (
                <button
                  className="booking-payment-action"
                  onClick={() =>
                    handlePaymentChange(
                      selectedBooking.id,
                      "Paid"
                    )
                  }
                >
                  Mark as Paid
                </button>
              )}

              <button
                className="booking-close-action"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}