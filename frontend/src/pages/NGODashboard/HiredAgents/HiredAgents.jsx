// src/components/NGO/HireDeliveryAgents/HiredAgents.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api";
import "./HiredAgents.css";
import NGODashboardNavbar from "../NGODashboardNavbar/NGODashboardNavbar";

const HiredAgents = () => {
  const navigate = useNavigate();
  const [hiredAgents, setHiredAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authMessage, setAuthMessage] = useState("");
  const [error, setError] = useState("");

  // Optional: use token if you store it
  const accessToken = useMemo(
    () => localStorage.getItem("ngoToken") || localStorage.getItem("accessToken") || null,
    []
  );

  useEffect(() => {
    const fetchHired = async () => {
      setLoading(true);
      setAuthMessage("");
      setError("");

      try {
        // Backend route protected by verifyJwt + authorizeRoles("NGO")
        const res = await API.get("/delivery-agents/hired-agents", {
          withCredentials: true,
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        });

        // Expecting { status:200, data: [agents...] }
        const data = res?.data?.data || [];
        setHiredAgents(Array.isArray(data) ? data : []);
      } catch (err) {
        const code = err?.response?.status;
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to load hired agents.";
        if (code === 401 || code === 403) setAuthMessage(msg);
        else setError(msg);
        setHiredAgents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHired();
  }, [accessToken]);

  const renderAgentCard = (agent) => {
    return (
      <div key={agent._id} className="ngo-card">
        {agent.avatar && (
          <img src={agent.avatar} alt={agent.name || agent.username} className="ngo-photo" />
        )}

        <div className="ngo-info">
          <h2>{agent.name || agent.username}</h2>

          {agent.address && <p className="ngo-address">{agent.address}</p>}
          {agent.bio && <p className="ngo-description">{agent.bio}</p>}

          <div style={{ fontSize: "0.92rem", color: "#444", marginTop: "0.5rem" }}>
            {agent.email && <p><strong>Email:</strong> {agent.email}</p>}
            {agent.phone && <p><strong>Phone:</strong> {agent.phone}</p>}
            {agent.drivingId && (
              <>
                <p style={{ marginBottom: "0.4rem" }}><strong>Driving ID:</strong></p>
                <img
                  src={agent.drivingId}
                  alt="Driving ID"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <NGODashboardNavbar />

      <section className="ngo-list-section">
        <h1 className="section-heading">Hired Delivery Agents</h1>

        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <button className="donate-btn" onClick={() => navigate(-1)}>
            ⬅ Back to Hire Agents
          </button>
        </div>

        {authMessage && (
          <p style={{ textAlign: "center", color: "#b3261e", marginBottom: "1rem" }}>
            {authMessage}
          </p>
        )}
        {error && (
          <p style={{ textAlign: "center", color: "#b3261e", marginBottom: "1rem" }}>
            {error}
          </p>
        )}

        {loading ? (
          <p style={{ textAlign: "center", color: "#666" }}>Loading…</p>
        ) : hiredAgents.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>No agents hired yet.</p>
        ) : (
          <div className="ngo-cards">
            {hiredAgents.map(renderAgentCard)}
          </div>
        )}
      </section>
    </>
  );
};

export default HiredAgents;
