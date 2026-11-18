
import { useState } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { useHotel } from "../context/HotelContext";
import RoomCard from "../components/RoomCard";
import "./RoomDetails.css";

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { rooms, isRoomAvailable } = useHotel();

  const room = rooms.find((item) => String(item.id) === id);

  const [selectedImage, setSelectedImage] = useState(
    room ? room.image : ""
  );

  const [checkIn, setCheckIn] = useState(
    searchParams.get("checkIn") || getToday()
  );

  const [checkOut, setCheckOut] = useState(
    searchParams.get("checkOut") || ""
  );

  const [adults, setAdults] = useState(
    Number(searchParams.get("adults")) || 2
  );

  const [children, setChildren] = useState(
    Number(searchParams.get("children")) || 0
  );

  const [error, setError] = useState("");

  if (!room) {
    return (
      <div className="room-not-found">
        <h2>Room Not Found</h2>
        <p>The room you are looking for is not available.</p>
        <Link to="/rooms" className="primary-btn">
          Browse Rooms
        </Link>
      </div>
    );
  }

  const images = room.images && room.images.length > 0
    ? room.images
    : [room.image];

  const totalGuests = adults + children;

  const nights = checkOut && checkIn
    ? Math.ceil(
        (new Date(checkOut + "T00:00:00") -
          new Date(checkIn + "T00:00:00")) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const totalPrice = nights > 0
    ? nights * room.price
    : room.price;

  const similarRooms = rooms.filter(
    (item) => item.id !== room.id && item.type === room.type
  ).slice(0, 3);

  function handleBooking() {
    setError("");

    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates.");
      return;
    }

    if (checkIn < getToday()) {
      setError("Check-in date cannot be in the past.");
      return;
    }

    if (checkOut <= checkIn) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    if (totalGuests < 1) {
      setError("Please select at least one guest.");
      return;
    }

    if (totalGuests > room.capacity) {
      setError(`This room can accommodate maximum ${room.capacity} guests.`);
      return;
    }

    if (!isRoomAvailable(room.id, checkIn, checkOut)) {
      setError("Sorry, this room is not available for the selected dates.");
      return;
    }

    navigate(
      `/booking/${room.id}?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}`
    );
  }

  return (
    <main className="room-details-page page-animation">

      <div className="room-details-container">

        <div className="room-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/rooms">Rooms</Link>
          <span>/</span>
          <strong>{room.name}</strong>
        </div>

        <div className="room-details-heading">
          <div>
            <span className="room-category">{room.type} Collection</span>
            <h1>{room.name}</h1>

            <div className="room-heading-info">
              <span>⭐ {room.rating} ({room.reviews} Reviews)</span>
              <span>📍 {room.location}</span>
            </div>
          </div>

          <div className="room-heading-price">
            <h2>₹{room.price.toLocaleString("en-IN")}</h2>
            <span>Per Night</span>
          </div>
        </div>

        <div className="room-gallery">

          <div className="room-main-image">
            <img src={selectedImage || room.image} alt={room.name} />
            <span className="gallery-label">RR RESORT</span>
          </div>

          <div className="room-thumbnail-list">
            {images.map((image, index) => (
              <button
                key={index}
                className={
                  selectedImage === image
                    ? "room-thumbnail active"
                    : "room-thumbnail"
                }
                onClick={() => setSelectedImage(image)}
              >
                <img src={image} alt={`${room.name} ${index + 1}`} />
              </button>
            ))}
          </div>

        </div>

        <div className="room-details-layout">

          <div className="room-information">

            <section className="details-section">
              <span className="details-eyebrow">WELCOME TO COMFORT</span>
              <h2>About This Room</h2>
              <p>{room.description}</p>
            </section>

            <section className="details-section">
              <h2>Room Highlights</h2>

              <div className="room-highlight-grid">
                <div className="room-highlight">
                  <span>🛏️</span>
                  <div>
                    <strong>{room.beds}</strong>
                    <small>Bed Configuration</small>
                  </div>
                </div>

                <div className="room-highlight">
                  <span>👥</span>
                  <div>
                    <strong>{room.capacity} Guests</strong>
                    <small>Maximum Capacity</small>
                  </div>
                </div>

                <div className="room-highlight">
                  <span>📐</span>
                  <div>
                    <strong>{room.size}</strong>
                    <small>Room Size</small>
                  </div>
                </div>

                <div className="room-highlight">
                  <span>📍</span>
                  <div>
                    <strong>{room.location}</strong>
                    <small>Room Location</small>
                  </div>
                </div>
              </div>
            </section>

            <section className="details-section">
              <h2>Room Amenities</h2>

              <div className="room-amenities-grid">
                {room.amenities.map((amenity, index) => (
                  <div className="room-amenity" key={index}>
                    <span>✓</span>
                    {amenity}
                  </div>
                ))}
              </div>
            </section>

            <section className="room-note">
              <span>✦</span>
              <div>
                <h3>Experience Luxury at RR Resort</h3>
                <p>
                  Relax, refresh, and enjoy a comfortable stay with
                  our thoughtfully designed rooms.
                </p>
              </div>
            </section>

          </div>

          <aside className="room-booking-card">

            <div className="booking-card-heading">
              <span>YOUR STAY</span>
              <h2>Reserve This Room</h2>
              <p>Choose your dates and guests.</p>
            </div>

            <div className="booking-field">
              <label>Check In</label>
              <input
                type="date"
                min={getToday()}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>

            <div className="booking-field">
              <label>Check Out</label>
              <input
                type="date"
                min={checkIn || getToday()}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>

            <div className="booking-guest-fields">

              <div className="booking-field">
                <label>Adults</label>
                <select
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6].map((number) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
                </select>
              </div>

              <div className="booking-field">
                <label>Children</label>
                <select
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                >
                  {[0, 1, 2, 3, 4].map((number) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div className="booking-capacity">
              <span>Maximum capacity</span>
              <strong>{room.capacity} Guests</strong>
            </div>

            <div className="booking-price-summary">
              <div>
                <span>Price per night</span>
                <strong>₹{room.price.toLocaleString("en-IN")}</strong>
              </div>

              <div>
                <span>Number of nights</span>
                <strong>{nights || "--"}</strong>
              </div>

              <div className="booking-total">
                <span>Estimated Total</span>
                <strong>
                  ₹{totalPrice.toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            {error && (
              <p className="room-booking-error">{error}</p>
            )}

            <button
              className="primary-btn room-book-now"
              onClick={handleBooking}
            >
              Book This Room →
            </button>

            <p className="booking-safe-note">
              ✓ Secure booking · Best price guaranteed
            </p>

          </aside>

        </div>

        {similarRooms.length > 0 && (
          <section className="similar-rooms-section">
            <div className="section-heading">
              <span>EXPLORE MORE</span>
              <h2>Similar Rooms</h2>
              <p>Discover more comfortable stays at RR Resort.</p>
            </div>

            <div className="similar-rooms-grid">
              {similarRooms.map((item) => (
                <RoomCard key={item.id} room={item} />
              ))}
            </div>
          </section>
        )}

      </div>

    </main>
  );
}
