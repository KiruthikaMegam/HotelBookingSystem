
import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useHotel } from "../context/HotelContext";
import RoomCard from "../components/RoomCard";
import "./Rooms.css";

export default function Rooms() {
  const { rooms, getAvailableRooms } = useHotel();

  const [searchParams] = useSearchParams();

  const destination = searchParams.get("destination") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const adults = Number(searchParams.get("adults") || 2);
  const children = Number(searchParams.get("children") || 0);

  const totalGuests = adults + children;

  const [search, setSearch] = useState("");
  const [roomType, setRoomType] = useState("All");
  const [maxPrice, setMaxPrice] = useState(12000);
  const [sortBy, setSortBy] = useState("default");

  let availableRooms = [];

  if (checkIn && checkOut) {
    availableRooms = getAvailableRooms(
      checkIn,
      checkOut,
      totalGuests
    );
  } else {
    availableRooms = rooms.filter(
      (room) => room.available
    );
  }

  let filteredRooms = availableRooms.filter((room) => {
    const matchesSearch = room.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesType =
      roomType === "All" || room.type === roomType;

    const matchesPrice = Number(room.price) <= maxPrice;

    const matchesGuests = room.capacity >= totalGuests;

    return (
      matchesSearch &&
      matchesType &&
      matchesPrice &&
      matchesGuests
    );
  });

  if (sortBy === "low") {
    filteredRooms.sort((a, b) => a.price - b.price);
  } else if (sortBy === "high") {
    filteredRooms.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filteredRooms.sort((a, b) => b.rating - a.rating);
  }

  return (
    <main className="rooms-page page-animation">

      <section className="rooms-banner">
        <div className="rooms-banner-overlay">
          <div className="container">
            <span>DISCOVER YOUR PERFECT STAY</span>
            <h1>Our Luxury Rooms</h1>
            <p>
              Find your perfect space to relax, refresh and reconnect.
            </p>
            <div className="rooms-breadcrumb">
              <Link to="/">Home</Link> / Rooms
            </div>
          </div>
        </div>
      </section>

      <section className="rooms-main container">

        <div className="rooms-intro">
          <div>
            <span className="rooms-subtitle">COMFORT MEETS LUXURY</span>
            <h2>Explore Our Rooms</h2>
            <p>
              Choose from our carefully designed rooms and enjoy
              a memorable stay at RR Resort.
            </p>
          </div>

          <div className="rooms-count">
            <strong>{filteredRooms.length}</strong>
            <span>Rooms Available</span>
          </div>
        </div>

        {destination && (
          <div className="search-summary">
            <div>
              <strong>Search destination: {destination}</strong>
              <p>
                {checkIn} to {checkOut} · {totalGuests} Guests
              </p>
            </div>

            <Link to="/">Modify Search</Link>
          </div>
        )}

        <div className="rooms-layout">

          <aside className="rooms-filter">

            <div className="filter-heading">
              <h3>Filter Rooms</h3>
              <button
                onClick={() => {
                  setSearch("");
                  setRoomType("All");
                  setMaxPrice(12000);
                  setSortBy("default");
                }}
              >
                Reset
              </button>
            </div>

            <div className="filter-group">
              <label>Search Room</label>
              <input
                type="text"
                placeholder="Search room name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Room Category</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Premium">Premium</option>
                <option value="Suite">Suite</option>
                <option value="Family">Family</option>
                <option value="Villa">Villa</option>
                <option value="Executive">Executive</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Maximum Price</label>
              <h3 className="filter-price">
                ₹{maxPrice.toLocaleString("en-IN")}
              </h3>
              <input
                type="range"
                min="2000"
                max="12000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
              <div className="price-range-labels">
                <span>₹2,000</span>
                <span>₹12,000</span>
              </div>
            </div>

            <div className="filter-group">
              <label>Guest Capacity</label>
              <p className="guest-filter-value">
                {totalGuests} Guests
              </p>
            </div>

            <div className="filter-note">
              <span>✦</span>
              Enjoy a comfortable stay with premium resort facilities.
            </div>

          </aside>

          <div className="rooms-results">

            <div className="rooms-toolbar">
              <p>
                Showing <strong>{filteredRooms.length}</strong> rooms
              </p>

              <div>
                <label>Sort By:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Recommended</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {filteredRooms.length > 0 ? (
              <div className="rooms-grid">
                {filteredRooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            ) : (
              <div className="rooms-empty">
                <div>⌕</div>
                <h3>No Rooms Found</h3>
                <p>
                  We couldn't find rooms matching your filters.
                  Try changing your search or price range.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setRoomType("All");
                    setMaxPrice(12000);
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}

          </div>

        </div>

      </section>

    </main>
  );
}
