import React, { useEffect, useState } from "react";
import "./VolunteerActivity.css";
import VolunteerDashboardNavbar from "../VolunteerDashboardNavbar/VolunteerDashboardNavbar";
import API from "../../../api";

const VolunteerActivity = () => {
  const [pendingDonations, setPendingDonations] = useState([]);
  const [completedDonations, setCompletedDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem("volunteerToken");

        const [pendingRes, completedRes] = await Promise.all([
          API.get("/volunteers/me/pending-donations", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          API.get("/volunteers/me/completed-donations", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setPendingDonations(pendingRes.data.data || []);
        setCompletedDonations(completedRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch donations:", err);
        setPendingDonations([]);
        setCompletedDonations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  return (
    <>
      <VolunteerDashboardNavbar />

      <div className="activity-container">
        <h2>📊 Your Donation Activity</h2>

        {loading ? (
          <p className="loading">Loading donations...</p>
        ) : (
          <>
            <section className="donation-section">
              <h3 className="section-title">⏳ Pending Donations</h3>
              {pendingDonations.length === 0 ? (
                <p className="empty-state">No pending donations found.</p>
              ) : (
                <ul className="activity-list">
                  {pendingDonations.map((donation) => (
                    <li key={donation._id} className="activity-card pending">
                      <p>
                        <strong>🍲 Food:</strong> {donation.foodType}
                      </p>
                      <p>
                        <strong>📦 Quantity:</strong> {donation.quantity}
                      </p>
                      <p>
                        <strong>🏢 NGO:</strong> {donation.ngo?.name}
                      </p>
                      <p>
                        <strong>🚚 Status:</strong> {donation.status}
                      </p>
                      {donation.status === "Rejected - Waste" && (
                        <p style={{ color: "red" }}>⚠️ Food marked as waste</p>
                      )}
                      <p>
                        <strong>📅 Date:</strong>{" "}
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="donation-section">
              <h3 className="section-title">✅ Completed Donations</h3>
              {completedDonations.length === 0 ? (
                <p className="empty-state">No completed donations found.</p>
              ) : (
                <ul className="activity-list">
                  {completedDonations.map((donation) => (
                    <li key={donation._id} className="activity-card completed">
                      <p>
                        <strong>🍲 Food:</strong> {donation.foodType}
                      </p>
                      <p>
                        <strong>📦 Quantity:</strong> {donation.quantity}
                      </p>
                      <p>
                        <strong>🏢 NGO:</strong> {donation.ngo?.name}
                      </p>
                      <p>
                        <strong>🚚 Status:</strong> {donation.status}
                      </p>
                      {donation.status === "Rejected - Waste" && (
                        <p style={{ color: "red" }}>⚠️ Food marked as waste</p>
                      )}
                      <p>
                        <strong>📅 Date:</strong>{" "}
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default VolunteerActivity;
