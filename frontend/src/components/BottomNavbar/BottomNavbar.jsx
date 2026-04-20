import { CgProfile } from "react-icons/cg";
import { BiHomeAlt, BiDonateHeart } from "react-icons/bi";
import { RiTimeLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import styles from "./bottomNavbar.module.css";
import logo from "../../assets/annseva-logo.png";

const BottomNavbar = () => {
  const location = useLocation();

  return (
    <div className={styles.navbar}>
      {/* Logo */}
      <Link to="/" className={styles.logoContainer}>
        <img src={logo} alt="AnnSeva Logo" className={styles.logo} />
      </Link>

      {/* Navigation Links */}
      <div className={styles.navLinks}>
        {/* <Link to="/" className={`${styles.link} ${location.pathname === "/" ? styles.active : ""}`}>
          <BiHomeAlt className={styles.icon} />
          <p className={styles.link_text}>Home</p>
        </Link> */}

        {/* <Link to="/activity" className={`${styles.link} ${location.pathname === "/activity" ? styles.active : ""}`}>
          <RiTimeLine className={styles.icon} />
          <p className={styles.link_text}>Activity</p>
        </Link> */}
{/* 
        <Link to="/donationType" className={`${styles.link} ${location.pathname === "/donationType" ? styles.active : ""}`}>
          <BiDonateHeart className={styles.icon} />
          <p className={styles.link_text}>Donate</p>
        </Link> */}

        {/* <Link to="/profile" className={`${styles.link} ${location.pathname === "/profile" ? styles.active : ""}`}>
          <CgProfile className={styles.icon} />
          <p className={styles.link_text}>Profile</p>
        </Link> */}
      </div>

      {/* Login / Signup */}
      <div className={styles.loginSignup}>
        <Link to="/login">
          <button className={styles.loginBtn}>Login</button>
        </Link>

        <div className={styles.dropdown}>
          <button className={styles.signupBtn}>Signup ▾</button>
          <div className={styles.dropdownContent}>
            <Link to="/signup-ngo">As NGO</Link>
            <Link to="/signup-delivery">As Delivery Agent</Link>
            <Link to="/signup-volunteer">As Volunteer</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomNavbar;