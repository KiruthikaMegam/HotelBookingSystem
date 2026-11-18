
import { Link } from "react-router-dom";
import "./RoomCard.css";

export default function RoomCard({ room }) {
  return (
    <div className="room-card">

      <div className="room-card-image">
        <img src={room.image} alt={room.name} />

        {room.featured && (
          <span className="room-featured">POPULAR</span>
        )}

        <span className="room-rating">
          ★ {room.rating}
        </span>
      </div>

      <div className="room-card-content">

        <div className="room-card-location">
          <span>⌖ {room.location}</span>
          <span>{room.type}</span>
        </div>

        <h3>{room.name}</h3>

        <p className="room-description">
          {room.description}
        </p>

        <div className="room-card-info">
          <span>♙ {room.capacity} Guests</span>
          <span>▣ {room.beds}</span>
          <span>◫ {room.size}</span>
        </div>

        <div className="room-amenities">
          {room.amenities.slice(0, 3).map((amenity, index) => (
            <span key={index}>{amenity}</span>
          ))}
        </div>

        <div className="room-card-bottom">

          <div className="room-price">
            <span>Starting from</span>
            <h3>
              ₹{Number(room.price).toLocaleString("en-IN")}
              <small> / night</small>
            </h3>
          </div>

          <Link
            to={`/rooms/${room.id}`}
            className="room-details-btn"
          >
            View Details →
          </Link>

        </div>

      </div>

    </div>
  );
}
