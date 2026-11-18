
import { Link } from "react-router-dom";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="hero-container">

          <div className="hero-content">

            <span className="hero-tag">
              WELCOME TO RR RESORT
            </span>

            <h1>
              Your Dream Stay
              <br />
              Awaits <span>You</span>
            </h1>

            <p>
              Escape the ordinary and experience extraordinary luxury.
              Discover peaceful surroundings, beautiful rooms and
              unforgettable hospitality at RR Resort.
            </p>

            <div className="hero-buttons">
              <Link to="/rooms" className="hero-btn-primary">
                Explore Rooms <span>→</span>
              </Link>

              <Link to="/about" className="hero-btn-outline">
                Discover More
              </Link>
            </div>

            <div className="hero-rating">
              <div className="rating-stars">★★★★★</div>
              <span>Experience Luxury & Comfort</span>
            </div>

          </div>

          <div className="hero-scroll">
            <span></span>
            Scroll to Explore
          </div>

        </div>
      </div>
    </section>
  );
}
