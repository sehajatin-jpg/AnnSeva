// src/components/DeliveryAgent/DeliveryGetHired/DeliveryGetHired.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./DeliveryGetHired.css";
import DeliveryAgentDashboardNavbar from "../DeliveryAgentDashboardNavbar/DeliveryAgentDashboardNavbar";
import API from "../../../api";

const DeliveryGetHired = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authMessage, setAuthMessage] = useState("");
  const [error, setError] = useState("");
  const [actingId, setActingId] = useState(null); // requestId being accepted/rejected

  // Optional bearer header if you store tokens; cookies sent via withCredentials
  const accessToken = useMemo(
    () => localStorage.getItem("agentToken") || localStorage.getItem("accessToken") || null,
    []
  );

  const loadRequests = async () => {
    setLoading(true);
    setAuthMessage("");
    setError("");
    try {
      const res = await API.get("/hire-requests/agent", {
        withCredentials: true,
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      });
      const data = res?.data?.data || [];
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      const code = err?.response?.status;
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to load hire requests.";
      if (code === 401 || code === 403) setAuthMessage(msg);
      else setError(msg);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const respond = async (requestId, status) => {
    setActingId(requestId);
    setError("");
    try {
      await API.patch(
        `/hire-requests/${requestId}/respond`,
        { status },
        {
          withCredentials: true,
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        }
      );
      // Optimistic update
      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status } : r))
      );
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to update request.";
      setError(msg);
    } finally {
      setActingId(null);
    }
  };

  const renderCard = (r) => {
    const ngo = r?.ngo || {};
    const pending = r.status === "Pending";
    const accepting = actingId === r._id && r._acting === "Accepted";
    const rejecting = actingId === r._id && r._acting === "Rejected";

    return (
      <div key={r._id} className="ngo-card">
        {/* NGO brand / banner (optional image could go here) */}
        <div className="ngo-info">
          <h2>{ngo.ngoName || ngo.name || "NGO"}</h2>

          {ngo.address && <p className="ngo-address">{ngo.address}</p>}

          <div style={{ margin: "0.4rem 0 0.6rem", color: "#444", fontSize: "0.95rem" }}>
            {ngo.email && (
              <p style={{ margin: 0 }}>
                <strong>Email:</strong> {ngo.email}
              </p>
            )}
          </div>

          <div className="ngo-description">
            {r.salary ? (
              <p style={{ margin: 0 }}>
                <strong>Proposed Salary:</strong> {r.salary}
              </p>
            ) : null}
            {r.message ? (
              <p style={{ margin: "0.4rem 0 0 0" }}>
                <strong>Message:</strong> {r.message}
              </p>
            ) : null}
          </div>

          <p style={{ marginTop: "0.4rem", fontWeight: 700 }}>
            Status:{" "}
            <span
              style={{
                color:
                  r.status === "Accepted"
                    ? "#2f7d32"
                    : r.status === "Rejected"
                    ? "#b3261e"
                    : "#6b7a68",
              }}
            >
              {r.status}
            </span>
          </p>

          {pending ? (
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button
                className="donate-btn"
                disabled={actingId === r._id}
                onClick={() => respond(r._id, "Accepted")}
              >
                {actingId === r._id ? "Accepting…" : "Accept"}
              </button>
              <button
                className="reject-btn"
                disabled={actingId === r._id}
                onClick={() => respond(r._id, "Rejected")}
              >
                {actingId === r._id ? "Rejecting…" : "Reject"}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <>
      <DeliveryAgentDashboardNavbar />

      <section className="ngo-list-section">
        <h1 className="section-heading">My Hire Requests</h1>

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
          <p className="loading-text" style={{ textAlign: "center", color: "#666" }}>
            Loading…
          </p>
        ) : requests.length === 0 ? (
          <p className="no-requests">No hire requests yet.</p>
        ) : (
          <div className="ngo-cards">{requests.map(renderCard)}</div>
        )}
      </section>
    </>
  );
};

export default DeliveryGetHired;
