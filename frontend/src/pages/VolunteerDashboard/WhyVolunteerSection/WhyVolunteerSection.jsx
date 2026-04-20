import React, { useState } from "react";
import "./WhyVolunteerSection.css";

const media = {
  video: "https://www.youtube.com/embed/tYmvsrkN8po?autoplay=1", // autoplay added
  thumbnail:
    "https://plus.unsplash.com/premium_photo-1681140560580-28cdbc874e50?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

const WhyVolunteerSection = () => {
  const [playVideo, setPlayVideo] = useState(false);

  return (
    <div className="why-volunteer-section">
      <div className="text-content">
        <h2>Why Volunteer With Seva?</h2>
        <p>
          Volunteering is a simple yet powerful way to support a cause you care
          about. Here are our top 3 reasons why you should volunteer with Seva!
        </p>
        <ul>
          <li>
            🌟 Your efforts, on-field or behind the scenes, help create a better
            community for everyone.
          </li>
          <li>
            🌟 Volunteering helps you develop valuable professional and
            leadership skills.
          </li>
          <li>
            🌟 Whatever your background, we have a volunteering option that suits
            you!
          </li>
        </ul>
        <button className="watch-btn" onClick={() => setPlayVideo(true)}>
          Watch The Video
        </button>
      </div>

      <div className="video-wrapper">
        {!playVideo ? (
          <div
            className="thumbnail-container"
            onClick={() => setPlayVideo(true)}
          >
            <img
              src={media.thumbnail}
              alt="Watch why volunteer"
              className="thumbnail"
            />
            <div className="play-button">▶</div>
          </div>
        ) : (
          <iframe
            key={playVideo} // force reload on state change
            width="100%"
            height="100%"
            src={media.video}
            title="Why Volunteer Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default WhyVolunteerSection;
