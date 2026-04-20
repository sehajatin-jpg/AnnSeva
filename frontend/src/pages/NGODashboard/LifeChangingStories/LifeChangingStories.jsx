import React, { useRef, useEffect, useState } from "react";
import "./LifeChangingStories.css";

const stories = [
  {
    image: "https://images.unsplash.com/photo-1653508311016-f8ea769c9cb4?q=80&w=3087&auto=format&fit=crop",
    name: "Ravi Mehta",
    role: "Volunteer",
    ngo: "Feeding Hope",
    quote: "Donating food gave my life meaning. I've seen how a single meal can bring joy.",
  },
  {
    image: "https://images.unsplash.com/photo-1739525347075-b44e8b16b92b?q=80&w=3125&auto=format&fit=crop",
    name: "Pooja Sharma",
    role: "Delivery Agent",
    ngo: "CareServe",
    quote: "From a job seeker to a changemaker—this journey gave me purpose.",
  },
  {
    image: "https://images.unsplash.com/photo-1583692331507-fc0bd348695d?q=80&w=3087&auto=format&fit=crop",
    name: "Arjun Patel",
    role: "Volunteer",
    ngo: "FoodBridge",
    quote: "Helping others helped me heal. This work is my therapy.",
  },
  {
    image: "https://images.unsplash.com/photo-1739523915441-ffdeaefb41f9?q=80&w=3087&auto=format&fit=crop",
    name: "Salma Qureshi",
    role: "Delivery Agent",
    ngo: "ServeNow",
    quote: "Delivering food taught me dignity, discipline, and joy.",
  },
  {
    image: "https://images.unsplash.com/photo-1716749653173-d2e4865ad6de?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Nikhil Rao",
    role: "Volunteer",
    ngo: "Unity Bites",
    quote: "I never knew community work could be this fulfilling.",
  },
  {
    image: "https://plus.unsplash.com/premium_photo-1726718504149-1411b7651bf2?q=80&w=3167&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Fatima Noor",
    role: "Delivery Agent",
    ngo: "HungerFree",
    quote: "Being on the frontline made me feel like a real hero.",
  },
  {
    image: "https://images.unsplash.com/photo-1723201223411-7a53a744055c?q=80&w=2700&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Imran Sheikh",
    role: "Volunteer",
    ngo: "MealMission",
    quote: "Volunteering changed how I see the world—and myself.",
  },
  {
    image: "https://plus.unsplash.com/premium_photo-1671656333460-793292581bc6?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Anjali Desai",
    role: "Delivery Agent",
    ngo: "HopeMeals",
    quote: "This job gave me stability, but it also gave me pride.",
  },
  {
    image: "https://images.unsplash.com/photo-1726722886957-2ed42b15aaa3?q=80&w=2277&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Rohan Kulkarni",
    role: "Volunteer",
    ngo: "Seva Bhojan",
    quote: "Every donation is a step toward a better society.",
  },
  {
    image: "https://images.unsplash.com/photo-1694818021860-0fde63beadbe?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Neha Reddy",
    role: "Delivery Agent",
    ngo: "NourishNation",
    quote: "The gratitude in people's eyes is the biggest reward.",
  },
];

const LifeChangingStories = () => {
    const containerRef = useRef(null);
    const intervalRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);
  
    // Auto-scroll every 3 seconds
    useEffect(() => {
      startAutoScroll();
      return () => stopAutoScroll();
    }, []);
  
    const startAutoScroll = () => {
      intervalRef.current = setInterval(() => {
        if (!isPaused && containerRef.current) {
          containerRef.current.scrollLeft += 1;
        }
      }, 20); // smaller = smoother scroll
    };
  
    const stopAutoScroll = () => clearInterval(intervalRef.current);
  
    const scrollLeft = () => {
      if (containerRef.current) containerRef.current.scrollLeft -= 300;
    };
  
    const scrollRight = () => {
      if (containerRef.current) containerRef.current.scrollLeft += 300;
    };
  
    return (
      <section
        className="life-changing-stories-section"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <h2 className="animated-title">Voices of Change</h2>
  
        <div className="arrows">
          <button onClick={scrollLeft}>&larr;</button>
          <button onClick={scrollRight}>&rarr;</button>
        </div>
  
        <div className="story-cards-container" ref={containerRef}>
          {stories.map((s, idx) => (
            <div className="story-card" key={idx}>
              <img src={s.image} alt={s.name} />
              <h3>{s.name}</h3>
              <p className="role">
                {s.role} at <span>{s.ngo}</span>
              </p>
              <blockquote>{s.quote}</blockquote>
            </div>
          ))}
        </div>
      </section>
    );
  };
  
  export default LifeChangingStories;
