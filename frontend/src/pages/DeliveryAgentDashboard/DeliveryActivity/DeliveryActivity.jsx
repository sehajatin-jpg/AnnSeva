import React, { useEffect, useMemo, useState } from "react";
import "./DeliveryActivity.css";
import DeliveryAgentDashboardNavbar from "../DeliveryAgentDashboardNavbar/DeliveryAgentDashboardNavbar";
import API from "../../../api"; // must send Authorization Bearer or cookie as per your setup

/**
 * DeliveryAgent Activity
 * - Section 1: Assigned (awaiting accept/reject)
 * - Section 2: Ongoing (Accepted or In-Transit) -> Start / Complete
 * - Section 3: Completed (Delivered)
 *
 * Backend endpoints used (as per your routes/controllers):
 * GET    /api/deliveries/my?status=<optional>       -> (optional filter)
 * POST   /api/deliveries/:id/respond                -> { decision: "accept"|"reject", reason? }
 * POST   /api/deliveries/:id/start                  -> { estimatedTime? }
 * POST   /api/deliveries/:id/deliver
 */

const DeliveryActivity = () => {
  const [assigned, setAssigned] = useState([]);
  const [ongoing, setOngoing] = useState([]);
  const [completed, setCompleted] = useState([]);

  const [loading, setLoading] = useState(true);
  const [rejectReasonById, setRejectReasonById] = useState({});
  const [error, setError] = useState("");

  // Helpers to map server model to UI card
  const toCard = (d) => ({
    id: d._id,
    phase: d.phase, // "Collection"|"Distribution"
    status: d.status, // "Assigned"|"Accepted"|"In-Transit"|"Delivered"|"Rejected"|"Cancelled"
    pickup: d.pickup,
    destination: d.destination,
    // Try to surface food details when populated
    foodDetails:
      d.foodDonation?.foodType && d.foodDonation?.quantity
        ? `${d.foodDonation.foodType} • ${d.foodDonation.quantity}`
        : d.foodDonation?.foodType || d.foodDonation?.details || "Food items",
    // Prefer pickup->destination chain text
    address:
      d.pickup && d.destination
        ? `${d.pickup} → ${d.destination}`
        : d.destination || d.pickup || "—",
  });

  const hydrate = async () => {
    setLoading(true);
    setError("");
    try {
      // You already have getMyDeliveries in DeliveryAgent controller
      // It returns all deliveries for this agent, ideally populated.
      const { data } = await API.get("/delivery-agents/me/deliveries");
      const list = Array.isArray(data?.data) ? data.data : [];

      const cards = list.map(toCard);

      setAssigned(cards.filter((c) => c.status === "Assigned"));
      setOngoing(
        cards.filter(
          (c) => c.status === "Accepted" || c.status === "In-Transit",
        ),
      );
      setCompleted(cards.filter((c) => c.status === "Delivered"));
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || "Failed to load deliveries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    hydrate();
    // Optionally add an interval or websocket later for realtime
  }, []);

  // ---- Actions wired to controllers ----

  const accept = async (deliveryId) => {
    try {
      await API.post(`/deliveries/${deliveryId}/respond`, {
        decision: "accept",
      });
      // Move from assigned -> ongoing (Accepted)
      setAssigned((prev) => prev.filter((d) => d.id !== deliveryId));
      setOngoing((prev) => [
        {
          ...prev.find((x) => x.id === deliveryId),
          id: deliveryId,
          status: "Accepted",
        },
        ...prev,
      ]);
      // safer: just re-hydrate to guarantee consistency
      await hydrate();
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || "Failed to accept assignment");
    }
  };

  const reject = async (deliveryId) => {
    try {
      const reason = rejectReasonById[deliveryId]?.trim();
      await API.post(`/deliveries/${deliveryId}/respond`, {
        decision: "reject",
        reason: reason || "Not available",
      });
      // Remove from assigned list
      setAssigned((prev) => prev.filter((d) => d.id !== deliveryId));
      // Optionally re-hydrate
      await hydrate();
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || "Failed to reject assignment");
    }
  };

  const start = async (deliveryId) => {
    try {
      await API.post(`/deliveries/${deliveryId}/start`);
      // Update status to In-Transit
      setOngoing((prev) =>
        prev.map((d) =>
          d.id === deliveryId ? { ...d, status: "In-Transit" } : d,
        ),
      );
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || "Failed to start delivery");
    }
  };

  const complete = async (deliveryId) => {
    try {
      await API.post(`/deliveries/${deliveryId}/deliver`);
      // Move from ongoing -> completed
      const card = ongoing.find((d) => d.id === deliveryId);
      setOngoing((prev) => prev.filter((d) => d.id !== deliveryId));
      setCompleted((prev) => [
        { ...(card || { id: deliveryId }), status: "Delivered" },
        ...prev,
      ]);
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || "Failed to complete delivery");
    }
  };

  // navbar badges
  const pendingCount = useMemo(() => assigned.length, [assigned]);
  const ongoingCount = useMemo(() => ongoing.length, [ongoing]);

  return (
    <>
      <DeliveryAgentDashboardNavbar
        pendingCount={pendingCount}
        ongoingCount={ongoingCount}
      />

      <div className="activityContainer">
        {error ? <div className="errorBanner">{error}</div> : null}
        {loading ? (
          <div className="loadingSpinner">Loading deliveries…</div>
        ) : null}

        {/* Section 1: Assigned (Accept / Reject) */}
        <h2>Assigned To You</h2>
        <div className="deliveryCardsContainer">
          {assigned.length === 0 ? (
            <p className="noActivity">No newly assigned deliveries.</p>
          ) : (
            assigned.map((delivery) => (
              <div key={delivery.id} className="deliveryCard">
                <div className="cardHeader">
                  <span className="pill">
                    {delivery.phase === "Waste" ? "♻️ Waste" : delivery.phase}
                  </span>
                  <span className="statusBadge assigned">Assigned</span>
                </div>
                <p>
                  <strong>Route:</strong> {delivery.address}
                </p>
                <p>
                  <strong>Food:</strong> {delivery.foodDetails}
                </p>

                <div className="actionsRow">
                  <button
                    className="actionBtn"
                    onClick={() => accept(delivery.id)}
                  >
                    Accept
                  </button>

                  <div className="rejectGroup">
                    <input
                      type="text"
                      placeholder="Reason (optional)"
                      className="rejectInput"
                      value={rejectReasonById[delivery.id] || ""}
                      onChange={(e) =>
                        setRejectReasonById((m) => ({
                          ...m,
                          [delivery.id]: e.target.value,
                        }))
                      }
                    />
                    <button
                      className="dismissBtn"
                      onClick={() => reject(delivery.id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Section 2: Ongoing */}
        <h2>Ongoing Deliveries</h2>
        <div className="deliveryCardsContainer">
          {ongoing.length === 0 ? (
            <p className="noActivity">No ongoing deliveries right now.</p>
          ) : (
            ongoing.map((delivery) => (
              <div key={delivery.id} className={`deliveryCard ongoing`}>
                <div className="cardHeader">
                  <span className="pill">
                    {delivery.phase === "Waste" ? "♻️ Waste" : delivery.phase}
                  </span>
                  <span
                    className={`statusBadge ${
                      delivery.status === "Accepted" ? "accepted" : "intransit"
                    }`}
                  >
                    {delivery.status}
                  </span>
                </div>
                <p>
                  <strong>Route:</strong> {delivery.address}
                </p>
                <p>
                  <strong>Food:</strong> {delivery.foodDetails}
                </p>

                <div className="actionsRow">
                  {delivery.status === "Accepted" ? (
                    <button
                      className="actionBtn"
                      onClick={() => start(delivery.id)}
                    >
                      Start Delivery
                    </button>
                  ) : null}
                  {delivery.status === "In-Transit" ? (
                    <button
                      className="completeBtn"
                      onClick={() => complete(delivery.id)}
                    >
                      Mark as Delivered
                    </button>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Section 3: Completed */}
        <h2>Completed Deliveries</h2>
        <div className="deliveryCardsContainer">
          {completed.length === 0 ? (
            <p className="noActivity">No deliveries completed yet.</p>
          ) : (
            completed.map((delivery) => (
              <div key={delivery.id} className="deliveryCard completed">
                <div className="cardHeader">
                  <span className="pill">
                    {delivery.phase === "Waste" ? "♻️ Waste" : delivery.phase}
                  </span>
                  <span className="statusBadge delivered">Delivered</span>
                </div>
                <p>
                  <strong>Route:</strong> {delivery.address}
                </p>
                <p>
                  <strong>Food:</strong> {delivery.foodDetails}
                </p>
                <p className="statusTag">Delivered ✅</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default DeliveryActivity;
