import React, { useEffect, useState } from "react";
import "./NGODashboardHeroSection.css";

const slides = [
  {
    image:
      "https://plus.unsplash.com/premium_photo-1678837404951-578690ddd9c7?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Lead With Compassion",
    text: "Your actions have the power to nourish both body and soul.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1610093366806-b2907e880fb7?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Impact Starts Here",
    text: "Empower change, uplift lives, and build stronger communities.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1628717341663-0007b0ee2597?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Together, We Heal",
    text: "Bridge hunger with hope through every act of kindness.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Be the Difference",
    text: "Every meal shared is a story of love and dignity restored.",
  },
];

const NGODashboardHeroSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="ngo-dashboard-hero-section">
      <div
        className="hero-slide"
        style={{ backgroundImage: `url(${slides[current].image})` }}
      ></div>

      <div className="hero-content">
        <h1>{slides[current].title}</h1>
        <p>{slides[current].text}</p>
      </div>
    </section>
  );
};

export default NGODashboardHeroSection;
