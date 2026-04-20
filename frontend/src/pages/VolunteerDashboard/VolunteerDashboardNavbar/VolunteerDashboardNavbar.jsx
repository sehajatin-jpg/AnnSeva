import { CgProfile } from "react-icons/cg";
import { BiHomeAlt, BiDonateHeart } from "react-icons/bi";
import { RiTimeLine } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import './VolunteerDashboardNavbar.css';
import logo from "../../../assets/annseva-logo.png";


const VolunteerDashboardNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("volunteerToken");
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="/" className="logoContainer">
        <img src={logo} alt="AnnSeva Logo" className="logo" />
      </Link>

      <div className="navLinks">
        <Link
          to="/volunteerDashboard/home"
          className={`link ${location.pathname === "/volunteerDashboard/home" ? "active" : ""}`}
        >
          <BiHomeAlt className="icon" />
          <p className="link_text">Home</p>
        </Link>

        <Link
          to="/volunteerDashboard/NGOlist"
          className={`link ${location.pathname === "/volunteerDashboard/NGOlist" ? "active" : ""}`}
        >
          <BiDonateHeart className="icon" />
          <p className="link_text">Donate</p>
        </Link>

        <Link
          to="/volunteerDashboard/activity"
          className={`link ${location.pathname === "/volunteerDashboard/activity" ? "active" : ""}`}
        >
          <RiTimeLine className="icon" />
          <p className="link_text">Activity</p>
        </Link>

        <Link
          to="/volunteerDashboard/profile"
          className={`link ${location.pathname === "/volunteerDashboard/profile" ? "active" : ""}`}
        >
          <CgProfile className="icon" />
          <p className="link_text">Profile</p>
        </Link>
      </div>

      <button className="logoutBtn" onClick={handleLogout}>
        <FiLogOut className="logoutIcon" />
        Logout
      </button>
    </div>
  );
};

export default VolunteerDashboardNavbar;
