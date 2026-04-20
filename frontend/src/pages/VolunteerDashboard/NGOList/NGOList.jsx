import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NGOList.css";
import VolunteerDashboardNavbar from "../VolunteerDashboardNavbar/VolunteerDashboardNavbar";
import API from "../../../api";

const NGOList = () => {
  const navigate = useNavigate();
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const response = await API.get("/ngos/all");
        setNgos(response.data.data);
      } catch (error) {
        console.error("Error fetching NGO list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNGOs();
  }, []);

  const handleDonateClick = (ngoId) => {
    localStorage.setItem("selectedNGOId", ngoId);
    navigate("/volunteerDashboard/NGOlist/donate");
  };

  const toggleExpand = (id) => {
    setActiveCard(activeCard === id ? null : id);
  };

  return (
    <>
      <VolunteerDashboardNavbar />
      <div className="ngo-list-container">
        {loading ? (
          <div className="loading-message">Loading NGOs...</div>
        ) : (
          ngos.map((ngo) => (
            <div
              className={`ngo-card ${activeCard === ngo._id ? "expanded" : ""}`}
              key={ngo._id}
              onClick={() => toggleExpand(ngo._id)}
            >
              <img
                src={
                  ngo.avatar ||
                  `https://source.unsplash.com/random/300x200/?charity,ngo,${ngo.name}`
                }
                alt={ngo.name}
                className="ngo-photo"
              />
              <div className="ngo-info">
                <h3>{ngo.name}</h3>
                {activeCard === ngo._id && (
                  <>
                    <p className="ngo-address">{ngo.address}</p>
                    <p className="ngo-description">{ngo.ngoId}</p>
                    <button
                      className="donate-button"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent closing card
                        handleDonateClick(ngo._id);
                      }}
                    >
                      Donate
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default NGOList;
