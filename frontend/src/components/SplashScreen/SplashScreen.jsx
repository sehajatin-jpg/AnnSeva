import React, { useEffect } from "react";
import styles from "./SplashScreen.module.css";

const SplashScreen = ({ setShowSplash }) => {
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, [setShowSplash]);

  return (
    <div className={styles.splash_container}>
      <h1 className={styles.splash_text}>अन्न Seva</h1>
    </div>
  );
};

export default SplashScreen;
