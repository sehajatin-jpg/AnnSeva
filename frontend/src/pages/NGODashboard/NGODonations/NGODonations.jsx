// src/components/NGO/NGODonations/NGODonations.jsx
import React, { useEffect, useState } from "react";
import NGODashboardNavbar from "../NGODashboardNavbar/NGODashboardNavbar";
import "./NGODonations.css";
import API from "../../../api";

const NGODonations = () => {
  const [rejectedDonations, setRejectedDonations] = useState([]);
  const [qualityLoading, setQualityLoading] = useState(false);
  const [wasteDestinationByDonation, setWasteDestinationByDonation] = useState(
    {},
  );

  const [completedWaste, setCompletedWaste] = useState([]);

  const [pendingDonations, setPendingDonations] = useState([]);
  const [collectedDonations, setCollectedDonations] = useState([]);
  const [distributedDonations, setDistributedDonations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [authMessage, setAuthMessage] = useState("");

  // Agent picker state
  const [pickerOpenFor, setPickerOpenFor] = useState(null); // donationId
  const [pickerMode, setPickerMode] = useState(null); // "collection" | "distribution"
  const [hiredAgents, setHiredAgents] = useState([]);
  const [agentsLoading, setAgentsLoading] = useState(false);

  // Assign/Reassign state
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState("");
  const [assignSuccess, setAssignSuccess] = useState("");

  // Destination for distribution assignment
  const [destinationByDonation, setDestinationByDonation] = useState({}); // { [donationId]: "address" }

  const loadAll = async () => {
    setLoading(true);
    setAuthMessage("");
    try {
      const [p, c, d] = await Promise.all([
        API.get("/ngos/pending-donations", { withCredentials: true }),
        API.get("/ngos/collected-donations", { withCredentials: true }),
        API.get("/ngos/distributed-donations", { withCredentials: true }),
      ]);

      const r = await API.get("/ngos/rejected-donations", {
        withCredentials: true,
      });

      const rejected = Array.isArray(r?.data?.data) ? r.data.data : [];

      setRejectedDonations(
        rejected.filter((d) => d.status !== "Sent to Biodegradable System"),
      );

      setCompletedWaste(
        rejected.filter((d) => d.status === "Sent to Biodegradable System"),
      );

      // 🔥 FILTER COMPLETED WASTE
      // setRejectedDonations(
      //   rejected.filter((d) => d.status !== "Sent to Biodegradable System"),
      // );

      setPendingDonations(Array.isArray(p?.data?.data) ? p.data.data : []);
      const collected = Array.isArray(c?.data?.data) ? c.data.data : [];

      setCollectedDonations(
        collected.filter(
          (d) =>
            d.status !== "Rejected - Waste" &&
            d.status !== "Sent to Biodegradable System",
        ),
      );
      setDistributedDonations(Array.isArray(d?.data?.data) ? d.data.data : []);
    } catch (err) {
      const code = err?.response?.status;
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Could not load donations.";
      if (code === 401 || code === 403) setAuthMessage(msg);
      else setAuthMessage(msg);
      setPendingDonations([]);
      setCollectedDonations([]);
      setDistributedDonations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Open picker & fetch hired agents
  const openAssignPicker = async (donationId, mode) => {
    setPickerOpenFor(donationId);
    setPickerMode(mode);
    setAssignError("");
    setAssignSuccess("");
    setAgentsLoading(true);
    try {
      const res = await API.get("/delivery-agents/hired-agents", {
        withCredentials: true,
      });
      const list = Array.isArray(res?.data?.data) ? res.data.data : [];
      setHiredAgents(list);
    } catch (err) {
      setAssignError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to load agents.",
      );
      setHiredAgents([]);
    } finally {
      setAgentsLoading(false);
    }
  };

  // Assign (or Reassign if deliveryId provided)

  //   const handleAssignWaste = async (donationId) => {
  //     try {
  //       const destination = wasteDestinationByDonation[donationId];

  //        // you can replace with dropdown later

  //       await API.post(
  //         "/deliveries/assign-waste-agent",
  //         {
  //           donationId,
  //           agentId,
  //           wasteDestination: destination,
  //         },
  //         { withCredentials: true },
  //       );

  //       setAssignSuccess("Waste delivery assigned!");
  //       await loadAll();
  //     } catch (err) {
  //       setAssignError(
  //   err?.response?.data?.message || "Failed to assign waste delivery"
  // );
  //     }
  //   };

  const handleAssignAgent = async ({
    donationId,
    agentId,
    mode,
    currentDeliveryId,
  }) => {
    if (!agentId) return;
    setAssigning(true);
    setAssignError("");
    setAssignSuccess("");

    try {
      if (mode === "collection") {
        if (currentDeliveryId) {
          await API.post(
            `/deliveries/${currentDeliveryId}/reassign`,
            { deliveryAgent: agentId },
            { withCredentials: true },
          );
          setAssignSuccess("Collection delivery reassigned!");
        } else {
          await API.post(
            "/deliveries/assign/collection",
            { donationId, agentId },
            { withCredentials: true },
          );
          setAssignSuccess("Collection agent assigned!");
        }

        setPendingDonations((prev) =>
          prev.map((d) =>
            d._id === donationId
              ? { ...d, collectionAgent: agentId, _collectionAssigned: true }
              : d,
          ),
        );
      }

      if (mode === "distribution") {
        const destination = (destinationByDonation[donationId] || "").trim();
        if (!destination) throw new Error("Please enter destination address.");

        if (currentDeliveryId) {
          await API.post(
            `/deliveries/${currentDeliveryId}/reassign`,
            { deliveryAgent: agentId },
            { withCredentials: true },
          );
          setAssignSuccess("Distribution delivery reassigned!");
        } else {
          await API.post(
            "/deliveries/assign/distribution",
            { donationId, agentId, destinationAddress: destination },
            { withCredentials: true },
          );
          setAssignSuccess("Distribution agent assigned!");
        }

        setCollectedDonations((prev) =>
          prev.map((d) =>
            d._id === donationId
              ? {
                  ...d,
                  distributionAgent: agentId,
                  destinationAddress: destination,
                  _distributionAssigned: true,
                }
              : d,
          ),
        );
      }
      if (mode === "waste") {
        const destination = (
          wasteDestinationByDonation[donationId] || ""
        ).trim();
        if (!destination) throw new Error("Please enter waste destination.");

        await API.post(
          "/deliveries/assign-waste-agent",
          {
            donationId,
            agentId,
            wasteDestination: destination,
          },
          { withCredentials: true },
        );

        setAssignSuccess("Waste delivery assigned!");

        setRejectedDonations((prev) =>
          prev.map((d) =>
            d._id === donationId
              ? {
                  ...d,
                  wasteAgent: agentId,
                  wasteDestination: destination,
                  _wasteAssigned: true,
                }
              : d,
          ),
        );
      }

      setTimeout(() => {
        setPickerOpenFor(null);
        setPickerMode(null);
        setAssignSuccess("");
      }, 800);
    } catch (err) {
      setAssignError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to assign agent.",
      );
    } finally {
      setAssigning(false);
    }
  };

  const handleQualityCheck = async (donationId, decision) => {
    try {
      setQualityLoading(true);

      const wasteDestination = null;

      await API.patch(
        "/food-donations/quality-check",
        { donationId, decision, wasteDestination },
        { withCredentials: true },
      );

      await loadAll();
    } catch (err) {
      alert(err?.response?.data?.message || "Quality check failed");
    } finally {
      setQualityLoading(false);
    }
  };

  // Cancel a delivery (either collection or distribution) by its deliveryId
  const cancelDelivery = async (deliveryId) => {
    if (!deliveryId) return alert("No delivery to cancel.");
    try {
      await API.post(
        `/deliveries/${deliveryId}/cancel`,
        {},
        { withCredentials: true },
      );
      await loadAll();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to cancel delivery",
      );
    }
  };

  // Agent selection UI

  const renderRejectedCard = (donation) => {
    return (
      <div className="donation-card" key={donation._id}>
        <h3>{donation.foodType}</h3>

        <div
          className="badge"
          style={{ background: "#ffe6e6", color: "#c0392b" }}
        >
          Rejected - Waste
        </div>

        <p>
          <strong>Quantity:</strong> {donation.quantity}
        </p>
        {donation.wasteDestination && (
          <p>
            <strong>Waste Destination:</strong> {donation.wasteDestination}
          </p>
        )}

        {!(donation.wasteAgent || donation._wasteAssigned) && (
          <input
            type="text"
            placeholder="Enter waste destination..."
            className="assign-input"
            value={wasteDestinationByDonation[donation._id] || ""}
            onChange={(e) =>
              setWasteDestinationByDonation((prev) => ({
                ...prev,
                [donation._id]: e.target.value,
              }))
            }
          />
        )}

        {donation.wasteAgent || donation._wasteAssigned ? (
          <div className="badge assigned">Waste agent assigned</div>
        ) : (
          <button
            className="action-btn blue-btn"
            onClick={() => openAssignPicker(donation._id, "waste")}
          >
            Assign Waste Delivery
          </button>
        )}
        {pickerOpenFor === donation._id &&
          pickerMode === "waste" &&
          renderAssignPicker(donation)}
      </div>
    );
  };

  const renderAssignPicker = (donation) => {
    const donationId = donation._id;
    const isDistribution = pickerMode === "distribution";
    const currentDeliveryId = isDistribution
      ? donation.distributionDeliveryId
      : donation.collectionDeliveryId;

    return (
      <div className="assign-picker">
        <div className="assign-header">
          <span>
            {pickerMode === "distribution"
              ? "Assign distribution agent"
              : pickerMode === "waste"
                ? "Assign waste agent"
                : "Assign collection agent"}
          </span>
          <button
            type="button"
            className="assign-close"
            onClick={() => {
              setPickerOpenFor(null);
              setPickerMode(null);
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {(isDistribution || pickerMode === "waste") && (
          <div className="assign-destination">
            <label htmlFor={`dest-${donationId}`}>Destination address</label>
            <input
              id={`dest-${donationId}`}
              type="text"
              placeholder="Enter final destination…"
              className="assign-input"
              value={
                isDistribution
                  ? destinationByDonation[donationId] || ""
                  : wasteDestinationByDonation[donationId] || ""
              }
              onChange={(e) => {
                const value = e.target.value;

                if (isDistribution) {
                  setDestinationByDonation((m) => ({
                    ...m,
                    [donationId]: value,
                  }));
                } else {
                  setWasteDestinationByDonation((m) => ({
                    ...m,
                    [donationId]: value,
                  }));
                }
              }}
              disabled={assigning}
            />
          </div>
        )}

        {agentsLoading ? (
          <p className="empty-text">Loading agents…</p>
        ) : hiredAgents.length === 0 ? (
          <p className="empty-text">
            No hired agents found. Add some in “Hired Agents”.
          </p>
        ) : (
          <div className="assign-list">
            <select
              className="assign-select"
              onChange={(e) =>
                handleAssignAgent({
                  donationId,
                  agentId: e.target.value,
                  mode: pickerMode,
                  currentDeliveryId,
                })
              }
              defaultValue=""
              disabled={assigning}
            >
              <option value="" disabled>
                Select agent…
              </option>
              {hiredAgents.map((a) => (
                <option value={a._id} key={a._id}>
                  {a.name || a.username} {a.phone ? `• ${a.phone}` : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        {assignError && (
          <p className="error-text" style={{ marginTop: 8 }}>
            {assignError}
          </p>
        )}
        {assignSuccess && (
          <p className="success-text" style={{ marginTop: 8 }}>
            {assignSuccess}
          </p>
        )}
      </div>
    );
  };

  const renderPendingCard = (donation) => {
    const isPickerOpen =
      pickerOpenFor === donation._id && pickerMode === "collection";
    const collectionDeliveryId = donation.collectionDeliveryId; // expect backend to include this if exists

    return (
      <div className="donation-card" key={donation._id}>
        <h3>{donation.foodType || "Food Donation"}</h3>

        {(donation.collectionAgent || donation._collectionAssigned) && (
          <div className="badge assigned">Collection agent assigned</div>
        )}

        <p>
          <strong>Quantity:</strong> {donation.quantity ?? "-"}
        </p>
        {donation.pickupAddress && (
          <p>
            <strong>Pickup Address:</strong> {donation.pickupAddress}
          </p>
        )}
        {donation.destinationAddress && (
          <p>
            <strong>Destination:</strong> {donation.destinationAddress}
          </p>
        )}
        {donation.description && (
          <p>
            <strong>Note:</strong> {donation.description}
          </p>
        )}

        <p>
          <strong>Status:</strong>{" "}
          {donation.collectionAgent || donation._collectionAssigned
            ? "Agent Assigned"
            : donation.status || "pending"}
        </p>

        <div className="donation-actions">
          <button
            type="button"
            className="assign-btn"
            onClick={() =>
              isPickerOpen
                ? (setPickerOpenFor(null), setPickerMode(null))
                : openAssignPicker(donation._id, "collection")
            }
          >
            {donation.collectionAgent || donation._collectionAssigned
              ? isPickerOpen
                ? "Close"
                : "Reassign Collection Agent"
              : isPickerOpen
                ? "Close"
                : "Assign Collection Agent"}
          </button>

          {/* Cancel collection delivery if one exists */}
          {collectionDeliveryId && (
            <button
              type="button"
              className="assign-btn"
              onClick={() => cancelDelivery(collectionDeliveryId)}
              title="Cancel current collection delivery"
            >
              Cancel Collection Delivery
            </button>
          )}
        </div>

        {isPickerOpen && renderAssignPicker(donation)}
      </div>
    );
  };

  const renderCollectedCard = (donation) => {
    const isPickerOpen =
      pickerOpenFor === donation._id && pickerMode === "distribution";
    const distributionDeliveryId = donation.distributionDeliveryId;

    return (
      <div className="donation-card" key={donation._id}>
        <h3>{donation.foodType || "Food Donation"}</h3>

        {(donation.distributionAgent || donation._distributionAssigned) && (
          <div className="badge assigned">Distribution agent assigned</div>
        )}

        <p>
          <strong>Quantity:</strong> {donation.quantity ?? "-"}
        </p>
        {donation.pickupAddress && (
          <p>
            <strong>NGO Address (Pickup):</strong> {donation.pickupAddress}
          </p>
        )}
        {donation.destinationAddress && (
          <p>
            <strong>Destination:</strong> {donation.destinationAddress}
          </p>
        )}
        {donation.description && (
          <p>
            <strong>Note:</strong> {donation.description}
          </p>
        )}

        <p>
          <strong>Status:</strong>{" "}
          {donation.status === "Quality Check Pending" && (
            <div className="action-buttons">
              <button
                className="action-btn green-btn"
                onClick={() => handleQualityCheck(donation._id, "approve")}
              >
                Approve Food
              </button>

              <button
                className="action-btn"
                style={{ backgroundColor: "#e74c3c", color: "#fff" }}
                onClick={() => handleQualityCheck(donation._id, "reject")}
              >
                Reject Food
              </button>
            </div>
          )}
          {donation.distributionAgent || donation._distributionAssigned
            ? "Agent Assigned"
            : donation.status || "collected"}
        </p>

        <div className="donation-actions">
          <button
            type="button"
            className="assign-btn"
            onClick={() =>
              isPickerOpen
                ? (setPickerOpenFor(null), setPickerMode(null))
                : openAssignPicker(donation._id, "distribution")
            }
          >
            {donation.distributionAgent || donation._distributionAssigned
              ? isPickerOpen
                ? "Close"
                : "Reassign Distribution Agent"
              : isPickerOpen
                ? "Close"
                : "Assign Distribution Agent"}
          </button>

          {/* Cancel distribution delivery if one exists */}
          {distributionDeliveryId && (
            <button
              type="button"
              className="assign-btn"
              onClick={() => cancelDelivery(distributionDeliveryId)}
              title="Cancel current distribution delivery"
            >
              Cancel Distribution Delivery
            </button>
          )}
        </div>

        {isPickerOpen && renderAssignPicker(donation)}
      </div>
    );
  };

  const renderDistributedCard = (donation) => {
    return (
      <div className="donation-card" key={donation._id}>
        <h3>{donation.foodType || "Food Donation"}</h3>
        <div className="badge done">Distributed ✅</div>
        <p>
          <strong>Quantity:</strong> {donation.quantity ?? "-"}
        </p>
        {donation.pickupAddress && (
          <p>
            <strong>Pickup:</strong> {donation.pickupAddress}
          </p>
        )}
        {donation.destinationAddress && (
          <p>
            <strong>Destination:</strong> {donation.destinationAddress}
          </p>
        )}
        {donation.description && (
          <p>
            <strong>Note:</strong> {donation.description}
          </p>
        )}
        <p>
          <strong>Status:</strong> {donation.status || "Distributed to Needy"}
        </p>
      </div>
    );
  };

  return (
    <>
      <NGODashboardNavbar />
      <div className="ngo-donation-section">
        <h1 className="section-heading">DONATIONS</h1>

        {authMessage && (
          <p style={{ color: "#d33", margin: "0 0 1rem 0" }}>{authMessage}</p>
        )}

        {/* Pending */}
        <div className="donation-container">
          <h2 className="donation-subheading">Pending Donations</h2>
          {loading ? (
            <p className="empty-text">Loading…</p>
          ) : pendingDonations.length === 0 ? (
            <p className="empty-text">No pending donations.</p>
          ) : (
            <div className="donation-list">
              {pendingDonations.map(renderPendingCard)}
            </div>
          )}
        </div>

        {/* Collected */}
        <div className="donation-container">
          <h2 className="donation-subheading">Collected Donations</h2>
          {loading ? (
            <p className="empty-text">Loading…</p>
          ) : collectedDonations.length === 0 ? (
            <p className="empty-text">No collected donations.</p>
          ) : (
            <div className="donation-list">
              {collectedDonations.map(renderCollectedCard)}
            </div>
          )}
        </div>

        {/* Rejected (Waste) */}
        <div className="donation-container">
          <h2 className="donation-subheading">Rejected (Waste) Donations</h2>

          {loading ? (
            <p className="empty-text">Loading…</p>
          ) : rejectedDonations.length === 0 ? (
            <p className="empty-text">No rejected donations.</p>
          ) : (
            <div className="donation-list">
              {rejectedDonations.map(renderRejectedCard)}
            </div>
          )}
        </div>

        {/* Completed Waste */}
        <div className="donation-container">
          <h2 className="donation-subheading">Completed Waste Deliveries</h2>

          {loading ? (
            <p className="empty-text">Loading…</p>
          ) : completedWaste.length === 0 ? (
            <p className="empty-text">No completed waste deliveries.</p>
          ) : (
            <div className="donation-list">
              {completedWaste.map((donation) => (
                <div className="donation-card" key={donation._id}>
                  <h3>{donation.foodType}</h3>
                  <div className="badge done">
                    ♻️ Sent to Biodegradable System
                  </div>

                  <p>
                    <strong>Quantity:</strong> {donation.quantity}
                  </p>

                  {donation.wasteDestination && (
                    <p>
                      <strong>Waste Destination:</strong>{" "}
                      {donation.wasteDestination}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Distributed */}
        <div className="donation-container">
          <h2 className="donation-subheading">Distributed Donations</h2>
          {loading ? (
            <p className="empty-text">Loading…</p>
          ) : distributedDonations.length === 0 ? (
            <p className="empty-text">No distributed donations yet.</p>
          ) : (
            <div className="donation-list">
              {distributedDonations.map(renderDistributedCard)}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NGODonations;
