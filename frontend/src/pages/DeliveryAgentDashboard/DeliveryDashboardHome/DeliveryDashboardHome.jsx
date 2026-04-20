import React from 'react';
import './DeliveryDashboardHome.css';
import DeliveryAgentDashboardNavbar from '../DeliveryAgentDashboardNavbar/DeliveryAgentDashboardNavbar';

const DeliveryDashboardHome = () => {
  return (
    <>
    <DeliveryAgentDashboardNavbar/>
    <div className="deliveryHomeContainer">
      <div className="heroSection">
        <h1>Welcome, Delivery Hero! 🚚</h1>
        <p>Your efforts bring meals to those who need them most. Here,s your impact today.</p>
      </div>

      <div className="statsSection">
        <div className="statCard">
          <h2>5</h2>
          <p>Deliveries Completed</p>
        </div>
        <div className="statCard">
          <h2>3</h2>
          <p>Pending Deliveries</p>
        </div>
        <div className="statCard">
          <h2>12 km</h2>
          <p>Total Distance Today</p>
        </div>
        <div className="statCard">
          <h2>4.9 ⭐</h2>
          <p>Average Rating</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default DeliveryDashboardHome;
