import React from "react";
import styles from "./SDGSection.module.css";
import { FaHeartbeat, FaVenusMars, FaGraduationCap, FaBriefcase, FaEquals, FaHandshake } from "react-icons/fa";

const SDG_DATA = [
  { id: 3, title: "Zero Hunger", color: "#b38bfa", Icon: FaHeartbeat },
  { id: 5, title: "Good Health & Well-Being", color: "#f77c92", Icon: FaVenusMars },
  { id: 4, title: "Responsible Consumption & Production", color: "#ffd966", Icon: FaGraduationCap },
  { id: 8, title: "Reduced Inequalities", color: "#7dcf86", Icon: FaBriefcase },
  { id: 10, title: "Partnerships for the Goals", color: "#6f7dfb", Icon: FaEquals },
  { id: 17, title: "Climate Action", color: "#7dcc92", Icon: FaHandshake },
];

const SDGSection = () => {
  return (
    <div className={styles.sdgSection}>
      <h2 className={styles.heading}>Working Towards a Better World</h2>
      <h1 className={styles.mainHeading}>Through Food Sharing and Zero Waste</h1>
      <div className={styles.sdgGrid}>
        {SDG_DATA.map((sdg) => (
          <div key={sdg.id} className={styles.sdgCard} style={{ backgroundColor: sdg.color }}>
            <div className={styles.sdgIcon}><sdg.Icon size={40} color="white" /></div>
            <p className={styles.sdgTitle}>{sdg.title}</p>
            <p className={styles.sdgNumber}>#{sdg.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SDGSection;