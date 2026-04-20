// AnimatedCardsSection.jsx
import React, { useEffect, useState } from 'react';
import './AnimatedCardsSection.css';

const AnimatedCardsSection = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation on component mount
    setAnimate(true);
  }, []);

  return (
    <div className="animated-section">
      <h2 className="animated-heading">Our Impact</h2>
      <div className={`animated-cards-container ${animate ? 'animate' : ''}`}>
        {/* Left Image Card */}
        <div className="animated-card image-card slide-in-left">
          <img
            src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Helping child study"
            className="impact-image"
          />
        </div>

        {/* Right Text Card */}
        <div className="animated-card text-card slide-in-right">
          <h3>
            Best NGO for CSR in India: <span className="highlight">AnnSeva</span>
          </h3>
          <p>
          We are a leading food-sharing platform in India, connecting volunteers, NGOs, and delivery agents to reduce food waste and hunger. Dedicated to empowering communities through food donations, we ensure timely collection and distribution to those in need—focusing on compassion, sustainability, and impactful service.
          </p>
          <p>
                At Seva, we believe that access to food is a fundamental human right—aligned with the spirit of Article 21 (Right to Life) of the Indian Constitution.
                Our platform bridges the gap between those who have excess food and those who need it most. Through a connected network of passionate volunteers, committed NGOs, and reliable delivery agents, we ensure that no meal goes to waste.
                Seva isn't just a system—it's a movement. A tech-enabled ecosystem where people, purpose, and technology come together to create real change, one meal at a time.

          </p>
        </div>
      </div>
    </div>
  );
};

export default AnimatedCardsSection;