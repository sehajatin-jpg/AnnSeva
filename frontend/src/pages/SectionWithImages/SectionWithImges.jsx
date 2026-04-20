import React from "react";
import styles from "./SectionWithImages.module.css";

const images = [
  { src: "https://images.unsplash.com/photo-1710092784814-4a6f158913b8?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", text: "Where Generosity Meets Hunger 🍱" },
  { src: "https://plus.unsplash.com/premium_photo-1683121608450-08d5ee613dd8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", text: "Feeding Futures, Not Just Bellies✨" },
  { src: "https://images.unsplash.com/photo-1694886322023-0b0c4283f3f7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", text: "Fueling with Kindness😊" },
  { src: "https://images.unsplash.com/photo-1621354599227-11f1a2edbe62?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", text: "Plates of Purpose🍽️" },
  { src: "https://images.unsplash.com/photo-1698795635937-31264cdbf359?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", text: "Hope, Handed Over🤝" },
  { src: "https://plus.unsplash.com/premium_photo-1683140538884-07fb31428ca6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", text: "Shared with Heart💟" },
  { src: "https://images.unsplash.com/photo-1660015154831-21c5c17370d8?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", text: "Give. Nourish. Repeat.🥗" },
  { src: "https://plus.unsplash.com/premium_photo-1663045467897-6ff808fb7bac?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", text: "Meals with Meaning🌸" },
];

const SectionWithImages = () => {
  return (
    <div className={styles.section}>
      <h2 className={styles.title}>
        <span className={styles.heart}></span> Don’t Waste It — Share It.
      </h2>
      <p className={styles.subtitle}>HELP US NOW</p>

      <div className={styles.imageGrid}>
        {images.map((item, index) => (
          <div key={index} className={styles.imageContainer}>
            <img src={item.src} alt="Cause" className={styles.image} />
            <div className={styles.overlay}>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.donationSection}>
        <h3>
        Your Extra Food Can Fill Someone’s Empty Stomach,
Instead of throwing it away, share it with someone who needs it.
{" "}
          <span className={styles.highlight}></span>
        </h3>
        <p>
        Every day, good food from homes, hotels, and restaurants goes to waste—while so many people go to sleep hungry. If you have clean, untouched food left over, don’t let it go to the bin.
        A simple act of sharing can bring comfort, warmth, and a smile to someone’s face. Let’s make sure no plate goes empty when we have enough to share. 🍛❤️
        </p>
      </div>
    </div>
  );
};

export default SectionWithImages;