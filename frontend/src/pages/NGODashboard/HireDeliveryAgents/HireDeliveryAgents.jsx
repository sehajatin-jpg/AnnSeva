// src/components/NGO/HireDeliveryAgents/HireDeliveryAgents.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api";
import "./HireDeliveryAgents.css";
import NGODashboardNavbar from "../NGODashboardNavbar/NGODashboardNavbar";

const HireDeliveryAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authMessage, setAuthMessage] = useState("");
  const [error, setError] = useState("");

  // UI state
  const [openFormFor, setOpenFormFor] = useState(null); // agentId
  const [formById, setFormById] = useState({});         // { [agentId]: { salary, message } }
  const [sendingById, setSendingById] = useState({});   // { [agentId]: boolean }
  const [successById, setSuccessById] = useState({});   // { [agentId]: string }

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnassigned = async () => {
      setLoading(true);
      setAuthMessage("");
      setError("");
      try {
        const res = await API.get("/delivery-agents/unassigned", { withCredentials: true });
        const data = res?.data?.data || [];
        setAgents(Array.isArray(data) ? data : []);
      } catch (err) {
        const code = err?.response?.status;
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to load agents.";
        if (code === 401 || code === 403) setAuthMessage(msg);
        else setError(msg);
        setAgents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUnassigned();
  }, []);

  const navigateToHiredAgents = () => {
    navigate("/NGODashboard/hireDeliveryAgents/hired-agents");
  };

  const openForm = (agentId) => {
    setSuccessById((p) => ({ ...p, [agentId]: "" }));
    setOpenFormFor(agentId);
    setFormById((p) => ({ ...p, [agentId]: p[agentId] || { salary: "", message: "" } }));
  };

  const closeForm = () => setOpenFormFor(null);

  const onFieldChange = (agentId, field, value) => {
    setFormById((prev) => ({
      ...prev,
      [agentId]: { ...(prev[agentId] || {}), [field]: value },
    }));
  };

  const sendHireRequest = async (agentId) => {
    setSendingById((p) => ({ ...p, [agentId]: true }));
    setError("");
    setSuccessById((p) => ({ ...p, [agentId]: "" }));

    const { salary = "", message = "" } = formById[agentId] || {};

    try {
      await API.post(
        "/hire-requests",
        { deliveryAgent: agentId, salary, message },
        { withCredentials: true }
      );

      setSuccessById((p) => ({ ...p, [agentId]: "Hire request sent successfully." }));
      // Optional: collapse after success
      setTimeout(() => {
        setOpenFormFor(null);
      }, 900);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to send hire request.";
      setError(msg);
    } finally {
      setSendingById((p) => ({ ...p, [agentId]: false }));
    }
  };

  const renderAgentCard = (agent) => {
    const isOpen = openFormFor === agent._id;
    const f = formById[agent._id] || { salary: "", message: "" };
    const sending = !!sendingById[agent._id];
    const okMsg = successById[agent._id];

    return (
      <div className="agentCard" key={agent._id}>
        <div className="agentHeader">
          <h3>{agent.name || agent.username || "Delivery Agent"}</h3>
          {agent.email && <span className="agentMeta">{agent.email}</span>}
        </div>

        {agent.bio && <p className="agentBio">{agent.bio}</p>}
        {agent.address && <p className="agentMeta">📍 {agent.address}</p>}
        {agent.phone && <p className="agentMeta">📞 {agent.phone}</p>}

        {!isOpen ? (
          <button className="hireBtn" onClick={() => openForm(agent._id)}>
            Send Hire Request
          </button>
        ) : (
          <div className="hireFormPanel">
            <div className="hireFormRow">
              <label>Proposed Salary (optional)</label>
              <input
                type="number"
                min="0"
                placeholder="e.g., 15000"
                value={f.salary}
                onChange={(e) => onFieldChange(agent._id, "salary", e.target.value)}
              />
            </div>

            <div className="hireFormRow">
              <label>Message (optional)</label>
              <input
                type="text"
                placeholder="Write a short note…"
                value={f.message}
                onChange={(e) => onFieldChange(agent._id, "message", e.target.value)}
              />
            </div>

            <div className="hireFormActions">
              <button
                className="hireBtn"
                onClick={() => sendHireRequest(agent._id)}
                disabled={sending}
              >
                {sending ? "Sending…" : "Send Request"}
              </button>
              <button className="cancelBtn" onClick={closeForm} disabled={sending}>
                Cancel
              </button>
            </div>

            {okMsg && <p className="success-text" style={{ marginTop: 8 }}>{okMsg}</p>}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <NGODashboardNavbar />
      <div className="hireDeliveryAgentContainer">
        <div className="toolbar">
          <button onClick={navigateToHiredAgents} className="viewHiredBtn">
            View Hired Agents
          </button>
        </div>

        <div className="sectionWrapper">
          <h2>Available Delivery Agents</h2>

          {authMessage && <p className="error-text">{authMessage}</p>}
          {error && <p className="error-text">{error}</p>}

          {loading ? (
            <p className="loading-text">Loading agents…</p>
          ) : agents.length === 0 ? (
            <p>No unassigned delivery agents found.</p>
          ) : (
            <div className="agentList">{agents.map(renderAgentCard)}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default HireDeliveryAgents;
