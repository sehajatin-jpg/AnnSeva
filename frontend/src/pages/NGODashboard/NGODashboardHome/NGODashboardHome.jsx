import React from 'react';
import './NGODashboardHome.css';
import NGODashboardNavbar from '../NGODashboardNavbar/NGODashboardNavbar';
import NGODashboardHeroSection from '../NGODashboardHeroSection/NGODashboardHeroSection';
import Footer from '../../../components/Footer/Footer';
import LifeChangingStories from '../LifeChangingStories/LifeChangingStories';
import ThreeCardSection from '../ThreeCardSection/ThreeCardSection';
import WhyPartner from '../WhyPartner/WhyPartner';

const NGODashboardHome = () => {
  return (
    <>
        <NGODashboardNavbar/>
        
        <NGODashboardHeroSection/>
        <LifeChangingStories/>
        <WhyPartner/>
        <ThreeCardSection/>

        <Footer/>
    {/* <div className="ngo-home-container">
      <div className="hero-section">
        <h1>Welcome to Your NGO Dashboard</h1>
        <p>Manage donations, coordinate with volunteers, and track deliveries efficiently.</p>
      </div>

      <div className="dashboard-cards">
        <div className="card">
          <h2>Pending Donations</h2>
          <p>0</p>
        </div>

        <div className="card">
          <h2>Volunteers Joined</h2>
          <p>0</p>
        </div>

        <div className="card">
          <h2>Deliveries In Progress</h2>
          <p>0</p>
        </div>
      </div>
    </div> */}
    </>

  );
};

export default NGODashboardHome;
