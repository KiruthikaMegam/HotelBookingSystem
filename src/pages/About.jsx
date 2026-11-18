
import { Link } from "react-router-dom";
import "./About.css";

export default function About() {
  return (
    <main className="about-page page-animation">

      {/* Hero Banner */}
      <section className="about-hero">
        <div className="about-hero-overlay">
          <div className="container">
            <span>WELCOME TO RR RESORT</span>
            <h1>Experience Luxury.<br />Embrace Nature.</h1>
            <p>
              Discover a peaceful destination where comfort,
              nature and unforgettable memories come together.
            </p>
            <Link to="/rooms" className="about-hero-btn">
              Explore Our Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="about-story section-padding">
        <div className="container about-story-layout">

          <div className="about-story-images">
            <img
              className="about-main-image"
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=85"
              alt="Luxury resort swimming pool"
            />

            <div className="about-small-image">
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=85"
                alt="Beautiful resort exterior"
              />
            </div>

            <div className="about-experience">
              <strong>RR</strong>
              <span>RESORT</span>
            </div>
          </div>

          <div className="about-story-content">
            <span className="about-eyebrow">OUR STORY</span>
            <h2>A Beautiful Escape From Everyday Life</h2>

            <p>
              Welcome to RR RESORT, a destination designed for
              relaxation, comfort and memorable experiences.
              We believe every stay should be special, whether
              you are travelling with family, friends or someone
              close to your heart.
            </p>

            <p>
              From comfortable rooms to welcoming hospitality,
              our goal is to make every guest feel at home while
              enjoying a peaceful resort atmosphere.
            </p>

            <div className="about-story-points">
              <div>
                <span>✦</span>
                <p>Comfortable Accommodation</p>
              </div>

              <div>
                <span>✦</span>
                <p>Warm Hospitality</p>
              </div>

              <div>
                <span>✦</span>
                <p>Memorable Experiences</p>
              </div>
            </div>

            <Link to="/rooms" className="about-primary-btn">
              Discover Our Rooms
            </Link>
          </div>

        </div>
      </section>

      {/* Mission and Vision */}
      <section className="about-mission section-padding">
        <div className="container">
          <div className="section-heading">
            <span>WHAT DRIVES US</span>
            <h2>Our Mission & Vision</h2>
            <p>Creating better stays through comfort and care.</p>
          </div>

          <div className="about-mission-grid">
            <div className="about-mission-card">
              <div className="about-card-icon">✧</div>
              <h3>Our Mission</h3>
              <p>
                To provide every guest with comfortable
                accommodation, friendly service and a relaxing
                environment that makes every visit special.
              </p>
            </div>

            <div className="about-mission-card">
              <div className="about-card-icon">❋</div>
              <h3>Our Vision</h3>
              <p>
                To become a preferred destination for guests
                seeking quality hospitality, peaceful stays
                and memorable travel experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="about-why section-padding">
        <div className="container">
          <div className="section-heading">
            <span>THE RR EXPERIENCE</span>
            <h2>Why Choose RR RESORT?</h2>
            <p>Everything you need for a comfortable stay.</p>
          </div>

          <div className="about-features-grid">

            <div className="about-feature-card">
              <div className="about-feature-icon">⌂</div>
              <h3>Comfortable Rooms</h3>
              <p>
                Relax in thoughtfully designed rooms
                with comfortable amenities.
              </p>
            </div>

            <div className="about-feature-card">
              <div className="about-feature-icon">♡</div>
              <h3>Friendly Hospitality</h3>
              <p>
                Enjoy a welcoming experience with
                attentive guest service.
              </p>
            </div>

            <div className="about-feature-card">
              <div className="about-feature-icon">✧</div>
              <h3>Peaceful Atmosphere</h3>
              <p>
                Take a break from your routine
                and enjoy a relaxing environment.
              </p>
            </div>

            <div className="about-feature-card">
              <div className="about-feature-icon">♧</div>
              <h3>Memorable Stays</h3>
              <p>
                Make beautiful memories with
                your family and loved ones.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="about-cta">
        <div className="container">
          <span>YOUR NEXT GETAWAY STARTS HERE</span>
          <h2>Make Your Stay Special With RR RESORT</h2>
          <p>
            Explore our rooms and find the perfect space
            for your next relaxing getaway.
          </p>
          <Link to="/rooms" className="about-cta-btn">
            Book Your Stay
          </Link>
        </div>
      </section>

    </main>
  );
}
