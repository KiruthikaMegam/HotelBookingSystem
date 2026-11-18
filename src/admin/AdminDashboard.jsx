import { Link } from "react-router-dom";
import { useHotel } from "../context/HotelContext";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const { rooms, bookings } = useHotel();

  function getBookingStatus(booking) {
    return booking.status || booking.bookingStatus || "Pending";
  }

  function getGuestName(booking) {
    return (
      booking.customerName ||
      booking.guestName ||
      booking.guest?.name ||
      "Guest"
    );
  }

  function getGuestEmail(booking) {
    return (
      booking.customerEmail ||
      booking.email ||
      booking.guest?.email ||
      "Customer reservation"
    );
  }

  function getBookingAmount(booking) {
    return Number(
      booking.totalPrice ||
      booking.totalAmount ||
      booking.roomTotal ||
      0
    );
  }

  function getRoomName(booking) {
    const room = rooms.find(
      (item) => String(item.id) === String(booking.roomId)
    );

    return room
      ? room.name
      : booking.roomName || "Room";
  }

  const confirmedBookings = bookings.filter(
    (booking) =>
      getBookingStatus(booking).toLowerCase() === "confirmed"
  );

  const pendingBookings = bookings.filter(
    (booking) =>
      getBookingStatus(booking).toLowerCase() === "pending"
  );

  const cancelledBookings = bookings.filter(
    (booking) =>
      getBookingStatus(booking).toLowerCase() === "cancelled"
  );

  const completedBookings = bookings.filter(
    (booking) =>
      getBookingStatus(booking).toLowerCase() === "completed"
  );

  let totalRevenue = 0;

  for (const booking of bookings) {
    const status = getBookingStatus(booking).toLowerCase();

    if (status === "confirmed" || status === "completed") {
      totalRevenue += getBookingAmount(booking);
    }
  }

  const availableRooms = rooms.filter(
    (room) => room.available === true
  );

  const recentBookings = [...bookings]
    .sort((a, b) => {
      const dateA = new Date(
        a.createdAt || a.checkIn || 0
      ).getTime();

      const dateB = new Date(
        b.createdAt || b.checkIn || 0
      ).getTime();

      return dateB - dateA;
    })
    .slice(0, 5);

  function handleLogout() {
    localStorage.removeItem("rrAdminLoggedIn");
    window.location.href = "/admin/login";
  }

  return (
    <main className="admin-dashboard page-animation">
      <div className="admin-container">

        {/* Dashboard Heading */}
        <div className="admin-heading">
          <div>
            <span>RR RESORT MANAGEMENT</span>

            <h1>Dashboard</h1>

            <p>
              Welcome back! Here's your resort overview.
            </p>
          </div>

          <div className="admin-heading-actions">

            <div className="admin-date">
              <span>Today</span>

              <strong>
                {new Date().toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                })}
              </strong>
            </div>

            <button
              className="admin-logout-btn"
              onClick={handleLogout}
            >
              <span>↗</span> Logout
            </button>

          </div>
        </div>

        {/* Statistics */}
        <section className="admin-stat-grid">

          <div className="admin-stat-card">
            <div className="admin-stat-icon teal-icon">
              ▣
            </div>

            <div>
              <p>Total Rooms</p>
              <h2>{rooms.length}</h2>
              <span>Registered rooms</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon green-icon">
              ✓
            </div>

            <div>
              <p>Available Rooms</p>
              <h2>{availableRooms.length}</h2>
              <span>Currently listed as available</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon blue-icon">
              ▤
            </div>

            <div>
              <p>Total Bookings</p>
              <h2>{bookings.length}</h2>
              <span>All reservations</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon orange-icon">
              ◷
            </div>

            <div>
              <p>Pending Bookings</p>
              <h2>{pendingBookings.length}</h2>
              <span>Waiting for confirmation</span>
            </div>
          </div>

        </section>

        {/* Revenue and Room Overview */}
        <section className="admin-overview-grid">

          {/* Revenue */}
          <div className="admin-panel revenue-panel">

            <div className="admin-panel-heading">
              <div>
                <span>FINANCIAL OVERVIEW</span>
                <h2>Total Revenue</h2>
              </div>

              <div className="revenue-icon">
                ₹
              </div>
            </div>

            <h1>
              ₹{totalRevenue.toLocaleString("en-IN")}
            </h1>

            <p>
              Revenue from confirmed and completed bookings
            </p>

            <div className="revenue-details">

              <div>
                <span>Confirmed</span>
                <strong>{confirmedBookings.length}</strong>
              </div>

              <div>
                <span>Pending</span>
                <strong>{pendingBookings.length}</strong>
              </div>

              <div>
                <span>Cancelled</span>
                <strong>{cancelledBookings.length}</strong>
              </div>

            </div>

          </div>

          {/* Room Overview */}
          <div className="admin-panel room-overview">

            <div className="admin-panel-heading">
              <div>
                <span>ROOM STATUS</span>
                <h2>Room Overview</h2>
              </div>

              <Link to="/admin/rooms">
                Manage
              </Link>
            </div>

            <div className="room-progress-info">
              <span>Available Rooms</span>

              <strong>
                {rooms.length > 0
                  ? Math.round(
                      (availableRooms.length / rooms.length) * 100
                    )
                  : 0}%
              </strong>
            </div>

            <div className="room-progress">
              <div
                style={{
                  width: `${
                    rooms.length > 0
                      ? (availableRooms.length / rooms.length) * 100
                      : 0
                  }%`
                }}
              ></div>
            </div>

            <div className="room-status-row">
              <span>
                <i className="available-dot"></i>
                Available
              </span>

              <strong>{availableRooms.length}</strong>
            </div>

            <div className="room-status-row">
              <span>
                <i className="unavailable-dot"></i>
                Unavailable
              </span>

              <strong>
                {rooms.length - availableRooms.length}
              </strong>
            </div>

          </div>

        </section>

        {/* Recent Bookings */}
        <section className="admin-panel recent-bookings-panel">

          <div className="admin-panel-heading">
            <div>
              <span>RESERVATION ACTIVITY</span>
              <h2>Recent Bookings</h2>
            </div>

            <Link to="/admin/bookings">
              View All
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="admin-empty-state">
              <div>▤</div>

              <h3>No bookings yet</h3>

              <p>
                New customer reservations will appear here.
              </p>
            </div>
          ) : (
            <div className="recent-booking-grid">

              {recentBookings.map((booking) => {
                const bookingStatus = getBookingStatus(booking);

                return (
                  <article
                    className="recent-booking-card"
                    key={booking.id}
                  >

                    {/* Booking Header */}
                    <div className="recent-booking-card-top">

                      <span>
                        #{booking.id}
                      </span>

                      <span
                        className={`admin-status ${bookingStatus.toLowerCase()}`}
                      >
                        {bookingStatus}
                      </span>

                    </div>

                    {/* Guest Information */}
                    <h3>
                      {getGuestName(booking)}
                    </h3>

                    <p>
                      {getGuestEmail(booking)}
                    </p>

                    {/* Booking Details */}
                    <div className="recent-booking-meta">

                      <div>
                        <span>Room</span>

                        <strong>
                          {getRoomName(booking)}
                        </strong>
                      </div>

                      <div>
                        <span>Stay</span>

                        <strong>
                          {booking.checkIn || "-"}
                          {" – "}
                          {booking.checkOut || "-"}
                        </strong>
                      </div>

                    </div>

                    {/* Booking Amount */}
                    <div className="recent-booking-card-bottom">

                      <span>Total Amount</span>

                      <strong>
                        ₹{getBookingAmount(booking).toLocaleString("en-IN")}
                      </strong>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

        </section>

        {/* Quick Actions */}
        <section className="admin-quick-actions">

          <h2>Quick Actions</h2>

          <div className="quick-action-grid">

            <Link to="/admin/rooms">

              <span>＋</span>

              <div>
                <h3>Manage Rooms</h3>
                <p>Add or update resort rooms</p>
              </div>

              <b>→</b>

            </Link>

            <Link to="/admin/bookings">

              <span>▤</span>

              <div>
                <h3>Manage Bookings</h3>
                <p>View and update reservations</p>
              </div>

              <b>→</b>

            </Link>

          </div>

        </section>

      </div>
    </main>
  );
}