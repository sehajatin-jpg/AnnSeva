import React, { useEffect, useState } from "react";
import styles from "./HeroSection.module.css";
import Button from "../../components/Buttons/buttons";
import { Link } from "react-router-dom";

const images = [
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1609817137540-c31d3eb192b0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1661962834814-2086d028cda1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1694286068611-d0c24cbc2cd5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

];

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [triggerZoom, setTriggerZoom] = useState(true);

  useEffect(() => {
    // Trigger zoom-out on image change
    setTriggerZoom(true);

    const zoomOutTimer = setTimeout(() => {
      setTriggerZoom(false); // Zoom-out finishes
    }, 3000); // 3s zoom-out

    const imageChangeTimer = setTimeout(() => {
      setCurrentImage((prev) => (prev + 1) % images.length); // Switch to next image
    }, 3000); // Immediately after zoom-out

    return () => {
      clearTimeout(zoomOutTimer);
      clearTimeout(imageChangeTimer);
    };
  }, [currentImage]);

  return (
    <section className={styles.hero}>
      <div className={styles.headingContainer}>
        <div className={styles.line}>
          <h1>Your extra food is</h1>
          <img src={images[1]} alt="Helping" />
        </div>
        <div className={styles.line}>
          <h1>Someone's only hope.</h1>
          <img src={images[2]} alt="Donations" />
        </div>
      </div>

      <div className={styles.bottomContainer}>
        <div className={styles.textContent}>
          <h2>One Tap. <span className={styles.oneMeal}>One Meal.</span> One Change.</h2>
          <div className={styles.buttons}>
            <Link to={"/signup-volunteer"}><Button>Donate Now</Button></Link>
            
          </div>
        </div>

        <div className={styles.imageWrapper}>
          <img
            key={currentImage} // Ensures re-animation
            src={images[currentImage]}
            className={styles.zoomingImage}
            alt="Donation"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;