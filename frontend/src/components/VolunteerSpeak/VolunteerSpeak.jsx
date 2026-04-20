import React, { useEffect, useRef } from 'react';
import './VolunteerSpeak.css';

const volunteers = [
  {
    name: "Astha Singhal",
    image: "https://plus.unsplash.com/premium_photo-1681140560580-28cdbc874e50?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quote: "These children helped me realize that you just need your little dreams and the motivation to fulfill them."
  },
  {
    name: "Bhanuja",
    image: "https://images.unsplash.com/photo-1655150086584-405904683319?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quote: "These children offered me to celebrate Diwali with them. I'm going to cherish each moment."
  },
  {
    name: "Anushka Sureka",
    image: "https://images.unsplash.com/photo-1653508310086-bd5f097286ac?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quote: "Innocent giggles with beaming eyes is what I noticed when I entered the Mission Education centre."
  },
  {
    name: "Julie Mansuy",
    image: "https://plus.unsplash.com/premium_photo-1678132566297-0c5255de1de1?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quote: "I learnt so much about public health, medicine, and Indian lifestyle. Loved working with the foundation."
  },
  {
    name: "Ravi Kumar",
    image: "https://images.unsplash.com/photo-1582043586275-2f68b290384a?q=80&w=2304&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quote: "Volunteering has changed my perspective about life and made me more grateful."
  },
  {
    name: "Meera Joshi",
    image: "https://images.unsplash.com/photo-1670841063394-d6909f7529aa?q=80&w=3136&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quote: "It's a joy to see children smile because of our small acts of service."
  },
  {
    name: "Samir Khan",
    image: "https://images.unsplash.com/photo-1677728847589-086e72e5c8d4?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quote: "The happiness in their eyes is what drives me to keep helping."
  },
  {
    name: "Priya Sharma",
    image: "https://images.unsplash.com/photo-1652772589253-c1ab2308fbf4?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quote: "This experience has taught me the power of empathy and human connection."
  },
  {
    name: "Arjun Patel",
    image: "https://plus.unsplash.com/premium_photo-1723921217150-fc37db07f568?q=80&w=2890&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quote: "Volunteering here brought meaning and direction to my life."
  },
  {
    name: "Neha Verma",
    image: "https://images.unsplash.com/photo-1639351823492-9e78ad6d0bae?q=80&w=3149&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quote: "Every child deserves a smile—and I'm grateful to be part of that journey."
  }
];

const VolunteerSpeak = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({
          left: 300,
          behavior: 'smooth',
        });

        // Loop back if scrolled to the end
        if (
          scrollRef.current.scrollLeft + scrollRef.current.offsetWidth >=
          scrollRef.current.scrollWidth
        ) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }
    }, 3000); // Scroll every 1 sec

    return () => clearInterval(interval);
  }, []);

  return (
        <section className="volunteer-speak-section">
        <h2 className="volunteer-title">VOLUNTEER SPEAK</h2>
        <div className="volunteer-carousel" ref={scrollRef}>
            {volunteers.map((v, index) => (
            <div className="volunteer-card" key={index}>
                <div className="volunteer-image-container">
                <img src={v.image} alt={v.name} />
                </div>
                <div className="volunteer-info">
                <h3>{v.name}</h3>
                <p>{v.quote}</p>
                </div>
            </div>
            ))}
        </div>
</section>

  );
};

export default VolunteerSpeak;
