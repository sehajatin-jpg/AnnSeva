import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { MdLocationOn, MdPhone, MdEmail } from "react-icons/md";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* Left Section - NGO Details */}
        <div className="footer-section about">
          <img src="/logo.png" alt="AnnSeva Logo" className="footer-logo" />
          <p>
            AnnSeva is committed to fighting hunger and ensuring that surplus food reaches those in need. Join us in making a difference!
          </p>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* Centers */}


        {/* Get Involved */}
        <div className="footer-section">
          <h3>Get Involved</h3>
          <ul>
            <li>Volunteer</li>
            <li>Join NGO</li>
            <li>Corporate Partnership</li>
            <li>Individual Member</li>
            <li>Career</li>
            <li>Internship</li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="footer-section">
          <h3>Follow Us On</h3>
          <ul>
            <li><MdPhone /> +91 9876543210</li>
            <li><MdEmail /> contact@annseva.org</li>
            <li><MdLocationOn /> 123, NGO Street, Delhi - 110092</li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <p>©️ 2025 AnnSeva, All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
          <a href="#">Refund Policy</a>
          <a href="#">Sitemap</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;