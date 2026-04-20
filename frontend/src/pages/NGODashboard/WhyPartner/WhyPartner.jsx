import React, { useEffect, useState } from 'react';
import './WhyPartner.css';

const images = [
  'https://images.unsplash.com/photo-1683498073270-888cec8e7abb?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
  'https://images.unsplash.com/photo-1633700426170-461c0f26b6c7?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1669137759430-3a04cd1a7cd0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

const WhyPartner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
<section className="why-partner-section">
  <div className="why-partner-content">
    <h1 className="why-partner-heading">
      JOIN <span className="annseva-highlight">ANNSEVA</span>
    </h1>
    <p className="why-partner-text">
      Partnering with AnnSeva means becoming part of a purpose-driven network—
      empowering delivery agents with meaningful work, enabling volunteers to give from the heart,
      and uniting NGOs to connect food to those who need it most.
    </p>
  </div>
  <div className="why-partner-image-container">
    <img
      src={images[currentIndex]}
      alt="Slideshow"
      className="why-partner-image"
    />
  </div>
</section>

  );
};

export default WhyPartner;
