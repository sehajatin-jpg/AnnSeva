import { BiHomeAlt } from "react-icons/bi";
import { MdWorkOutline } from "react-icons/md";
import { FaListUl } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./DeliveryAgentDashboardNavbar.css";
import logo from "../../../assets/annseva-logo.png";

const DeliveryAgentDashboardNavbar = ({ pendingCount }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("deliveryAgentToken");
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="/" className="logoContainer">
        <img src={logo} alt="AnnSeva Logo" className="logo" />
      </Link>

      <div className="navLinks">
        <Link
          to="/DeliveryAgentDashboard/home"
          className={`link ${location.pathname === "/DeliveryAgentDashboard/home" ? "active" : ""}`}
        >
          <BiHomeAlt className="icon" />
          <p className="link_text">Home</p>
        </Link>

        <Link
          to="/DeliveryAgentDashboard/getHired"
          className={`link ${location.pathname === "/DeliveryAgentDashboard/getHired" ? "active" : ""}`}
        >
          <MdWorkOutline className="icon" />
          <p className="link_text">Get Hired</p>
        </Link>

        <Link
          to="/DeliveryAgentDashboard/activity"
          className={`link activityLink ${location.pathname === "/DeliveryAgentDashboard/activity" ? "active" : ""}`}
        >
          <FaListUl className="icon" />
          {pendingCount > 0 && <span className="activityBadge">{pendingCount}</span>}
          <p className="link_text">Activity</p>
        </Link>
      </div>

      <button className="logoutBtn" onClick={handleLogout}>
        <FiLogOut className="logoutIcon" />
        Logout
      </button>
    </div>
  );
};

export default DeliveryAgentDashboardNavbar;
