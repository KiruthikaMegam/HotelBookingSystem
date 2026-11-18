
import { useState } from "react";
import { useHotel } from "../context/HotelContext";
import "./ManageRooms.css";

const emptyRoom = {
  name: "",
  type: "Deluxe",
  price: "",
  originalPrice: "",
  capacity: "2",
  beds: "1 King Bed",
  size: "350 sq.ft",
  location: "Resort View",
  image: "",
  description: "",
  amenities: "",
  available: true,
  featured: false
};

export default function ManageRooms() {
  const { rooms, bookings, addRoom, updateRoom, deleteRoom } = useHotel();

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyRoom);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [message, setMessage] = useState("");

  const roomTypes = [
    "All",
    "Standard",
    "Deluxe",
    "Premium",
    "Suite",
    "Family",
    "Villa",
    "Executive"
  ];

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesType =
      filterType === "All" || room.type === filterType;

    return matchesSearch && matchesType;
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });

    setError("");
  }

  function openAddForm() {
    setForm(emptyRoom);
    setEditId(null);
    setError("");
    setMessage("");
    setShowForm(true);
  }

  function openEditForm(room) {
    setForm({
      name: room.name || "",
      type: room.type || "Deluxe",
      price: room.price || "",
      originalPrice: room.originalPrice || "",
      capacity: room.capacity || "2",
      beds: room.beds || "",
      size: room.size || "",
      location: room.location || "",
      image: room.image || "",
      description: room.description || "",
      amenities: Array.isArray(room.amenities)
        ? room.amenities.join(", ")
        : "",
      available: room.available,
      featured: room.featured || false
    });

    setEditId(room.id);
    setError("");
    setMessage("");
    setShowForm(true);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.name ||
      !form.price ||
      !form.capacity ||
      !form.image ||
      !form.description
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (Number(form.price) <= 0 || Number(form.capacity) <= 0) {
      setError("Price and capacity must be greater than zero.");
      return;
    }

    const roomData = {
      ...form,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice || form.price),
      capacity: Number(form.capacity),
      amenities: form.amenities
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== ""),
      images: [form.image]
    };

    if (editId !== null) {
      updateRoom(editId, roomData);
      setMessage("Room updated successfully.");
    } else {
      addRoom(roomData);
      setMessage("New room added successfully.");
    }

    setShowForm(false);
    setEditId(null);
    setForm(emptyRoom);
    setError("");
  }

  function handleDelete() {
    const result = deleteRoom(deleteId);

    if (result) {
      setMessage("Room deleted successfully.");
    } else {
      setMessage("This room has an active booking and cannot be deleted.");
    }

    setDeleteId(null);
  }

  function toggleAvailability(room) {
    updateRoom(room.id, {
      available: !room.available
    });

    setMessage(
      room.available
        ? "Room marked as unavailable."
        : "Room marked as available."
    );
  }

  return (
    <main className="manage-rooms-page page-animation">
      <div className="manage-rooms-container">

        <div className="manage-rooms-heading">
          <div>
            <span>ROOM MANAGEMENT</span>
            <h1>Manage Rooms</h1>
            <p>Add, update and manage your resort rooms.</p>
          </div>

          <button className="add-room-btn" onClick={openAddForm}>
            <span>＋</span> Add New Room
          </button>
        </div>

        {message && (
          <div className="rooms-message">
            <span>{message}</span>
            <button onClick={() => setMessage("")}>×</button>
          </div>
        )}

        <div className="rooms-summary">
          <div>
            <span>Total Rooms</span>
            <strong>{rooms.length}</strong>
          </div>

          <div>
            <span>Available</span>
            <strong>
              {rooms.filter((room) => room.available).length}
            </strong>
          </div>

          <div>
            <span>Unavailable</span>
            <strong>
              {rooms.filter((room) => !room.available).length}
            </strong>
          </div>

          <div>
            <span>Room Types</span>
            <strong>
              {new Set(rooms.map((room) => room.type)).size}
            </strong>
          </div>
        </div>

        <section className="rooms-management-panel">

          <div className="rooms-toolbar">
            <div>
              <h2>All Rooms</h2>
              <p>Manage your resort room collection</p>
            </div>

            <div className="rooms-filters">
              <input
                type="text"
                placeholder="Search room name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                {roomTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "All" ? "All Room Types" : type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredRooms.length === 0 ? (
            <div className="rooms-empty">
              <span>▣</span>
              <h3>No rooms found</h3>
              <p>Try changing your search or room type filter.</p>
            </div>
          ) : (
            <div className="manage-room-grid">
              {filteredRooms.map((room) => (
                <div className="manage-room-card" key={room.id}>

                  <div className="manage-room-image">
                    <img src={room.image} alt={room.name} />

                    {room.featured && (
                      <span className="featured-label">FEATURED</span>
                    )}

                    <span
                      className={`room-availability ${
                        room.available ? "is-available" : "is-unavailable"
                      }`}
                    >
                      {room.available ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  <div className="manage-room-content">
                    <div className="manage-room-type">
                      {room.type} Room
                    </div>

                    <h3>{room.name}</h3>

                    <p className="manage-room-description">
                      {room.description}
                    </p>

                    <div className="manage-room-info">
                      <span>♙ {room.capacity} Guests</span>
                      <span>▣ {room.beds}</span>
                    </div>

                    <div className="manage-room-price">
                      <strong>
                        ₹{Number(room.price).toLocaleString("en-IN")}
                      </strong>
                      <span>/ night</span>
                    </div>

                    <div className="manage-room-actions">
                      <button
                        className="room-edit-btn"
                        onClick={() => openEditForm(room)}
                      >
                        Edit
                      </button>

                      <button
                        className="room-toggle-btn"
                        onClick={() => toggleAvailability(room)}
                      >
                        {room.available ? "Disable" : "Enable"}
                      </button>

                      <button
                        className="room-delete-btn"
                        onClick={() => setDeleteId(room.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {showForm && (
        <div className="room-modal-overlay">
          <div className="room-form-modal">

            <div className="room-modal-heading">
              <div>
                <span>RR RESORT</span>
                <h2>{editId !== null ? "Edit Room" : "Add New Room"}</h2>
              </div>

              <button
                className="room-modal-close"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            {error && (
              <div className="rooms-form-error">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="room-form-grid">

                <div className="room-form-field">
                  <label>Room Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter room name"
                  />
                </div>

                <div className="room-form-field">
                  <label>Room Type *</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  >
                    {roomTypes.slice(1).map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="room-form-field">
                  <label>Price Per Night (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    min="1"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                  />
                </div>

                <div className="room-form-field">
                  <label>Original Price (₹)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    min="0"
                    value={form.originalPrice}
                    onChange={handleChange}
                    placeholder="Enter original price"
                  />
                </div>

                <div className="room-form-field">
                  <label>Guest Capacity *</label>
                  <input
                    type="number"
                    name="capacity"
                    min="1"
                    value={form.capacity}
                    onChange={handleChange}
                  />
                </div>

                <div className="room-form-field">
                  <label>Beds</label>
                  <input
                    name="beds"
                    value={form.beds}
                    onChange={handleChange}
                    placeholder="Example: 1 King Bed"
                  />
                </div>

                <div className="room-form-field">
                  <label>Room Size</label>
                  <input
                    name="size"
                    value={form.size}
                    onChange={handleChange}
                    placeholder="Example: 350 sq.ft"
                  />
                </div>

                <div className="room-form-field">
                  <label>Room Location</label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Example: Garden View"
                  />
                </div>

                <div className="room-form-field full-field">
                  <label>Room Image URL *</label>
                  <input
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="Paste room image URL"
                  />
                </div>

                <div className="room-form-field full-field">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Enter room description"
                    rows="3"
                  />
                </div>

                <div className="room-form-field full-field">
                  <label>Amenities</label>
                  <input
                    name="amenities"
                    value={form.amenities}
                    onChange={handleChange}
                    placeholder="Wi-Fi, Air Conditioning, TV, Breakfast"
                  />
                  <small>Separate each amenity with a comma.</small>
                </div>

              </div>

              <div className="room-form-options">
                <label>
                  <input
                    type="checkbox"
                    name="available"
                    checked={form.available}
                    onChange={handleChange}
                  />
                  Room Available
                </label>

                <label>
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                  />
                  Featured Room
                </label>
              </div>

              <div className="room-modal-actions">
                <button
                  type="button"
                  className="room-cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="room-submit-btn">
                  {editId !== null ? "Update Room" : "Add Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="room-modal-overlay">
          <div className="room-delete-modal">
            <div className="delete-warning-icon">!</div>
            <h2>Delete Room?</h2>
            <p>
              Are you sure you want to delete this room? This action cannot
              be undone.
            </p>

            <div className="room-modal-actions">
              <button
                className="room-cancel-btn"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>

              <button
                className="room-confirm-delete-btn"
                onClick={handleDelete}
              >
                Delete Room
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
