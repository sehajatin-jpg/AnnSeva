import React, { useEffect, useState } from "react";
import "./VolunteerDashboardHeroSection.css";

const slides = [
  {
    image:
      "https://plus.unsplash.com/premium_photo-1681152780997-df17709cbb06?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Inspire. Serve. Uplift.",
    text: "Be a light in someone’s darkness by lending a helping hand.",
  },
  {
    image:
      "https://plus.unsplash.com/premium_photo-1683121334505-907a00cf904c?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Spreading Hope",
    text: "Food, love, and community—delivered through selfless service.",
  },
  {
    image:
      "https://images.unsplash.com/flagged/photo-1574380555089-06f915e8c074?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Volunteer Voices",
    text: "Every hand that gives creates a ripple of change.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Together We Serve",
    text: "Join the movement to serve and support those in need.",
  },
];

const VolunteerDashboardHeroSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
      <section className="volunteer-dashboard-hero-section">
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

export default VolunteerDashboardHeroSection;
