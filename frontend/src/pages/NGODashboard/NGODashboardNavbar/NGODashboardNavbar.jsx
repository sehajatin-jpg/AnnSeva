import { CgProfile } from "react-icons/cg";
import { BiHomeAlt } from "react-icons/bi";
import { FaUserPlus } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import { RiHandHeartLine } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import './NGODashboardNavbar.css';
import logo from "../../../assets/annseva-logo.png";

const NGODashboardNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("ngoToken");
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="/" className="logoContainer">
        <img src={logo} alt="AnnSeva Logo" className="logo" />
      </Link>

      <div className="navLinks">
        <Link
          to="/ngoDashboard/home"
          className={`link ${location.pathname === "/ngoDashboard/home" ? "active" : ""}`}
        >
          <BiHomeAlt className="icon" />
          <p className="link_text">Home</p>
        </Link>

        <Link
          to="/NGODashboard/profile"
          className={`link ${location.pathname === "/NGODashboard/profile" ? "active" : ""}`}
        >
          <CgProfile className="icon" />
          <p className="link_text">Profile</p>
        </Link>
        
        <Link
          to="/NGODashboard/hireDeliveryAgents"
          className={`link ${location.pathname === "/NGODashboard/hireDeliveryAgents" ? "active" : ""}`}
        >
          <MdDeliveryDining className="icon" />
          <p className="link_text">Hire Agents</p>
        </Link>

        <Link
          to="/NGODashboard/donations"
          className={`link ${location.pathname === "/NGODashboard/donations" ? "active" : ""}`}
        >
          <RiHandHeartLine className="icon" />
          <p className="link_text">Donations</p>
        </Link>
      </div>

      <button className="logoutBtn" onClick={handleLogout}>
        <FiLogOut className="logoutIcon" />
        Logout
      </button>
    </div>
  );
};

export default NGODashboardNavbar;
