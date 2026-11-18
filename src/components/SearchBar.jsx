
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function SearchBar() {
  const navigate = useNavigate();

  const today = getToday();

  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [error, setError] = useState("");

  function handleSearch(e) {
    e.preventDefault();

    if (destination.trim() === "") {
      setError("Please enter your destination.");
      return;
    }

    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates.");
      return;
    }

    if (checkIn < today) {
      setError("Check-in date cannot be in the past.");
      return;
    }

    if (checkOut <= checkIn) {
      setError("Check-out must be after check-in.");
      return;
    }

    if (Number(adults) < 1) {
      setError("At least one adult is required.");
      return;
    }

    setError("");

    const params = new URLSearchParams({
      destination,
      checkIn,
      checkOut,
      adults,
      children
    });

    navigate(`/rooms?${params.toString()}`);
  }

  return (
    <section className="search-section">
      <form className="search-bar" onSubmit={handleSearch}>

        <div className="search-field destination-field">
          <label>DESTINATION</label>

          <div className="search-input">
            <span className="search-icon">⌖</span>

            <input
              type="text"
              placeholder="Where are you going?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
        </div>

        <div className="search-field">
          <label>CHECK IN</label>

          <div className="search-input">
            <span className="search-icon">▣</span>

            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
        </div>

        <div className="search-field">
          <label>CHECK OUT</label>

          <div className="search-input">
            <span className="search-icon">▣</span>

            <input
              type="date"
              min={checkIn || today}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        </div>

        <div className="search-field guests-field">
          <label>GUESTS</label>

          <div className="guest-inputs">
            <div>
              <span>Adults</span>
              <select
                value={adults}
                onChange={(e) => setAdults(e.target.value)}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>

            <div>
              <span>Children</span>
              <select
                value={children}
                onChange={(e) => setChildren(e.target.value)}
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className="search-button">
          <span>⌕</span> Search
        </button>

        {error && (
          <p className="search-error">{error}</p>
        )}

      </form>
    </section>
  );
}
