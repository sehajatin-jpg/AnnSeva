import React from "react";
import styled from "styled-components";

const Card = ({ title, message, image }) => {
  return (
    <StyledCard>
      <div className="card">
        <div className="first-content">
          <div>
            <span>{title}</span>
            <img src={image} alt={title} className="card-image" />
          </div>
        </div>
        <div className="second-content">
          <div className="second-text">{message}</div>
        </div>
      </div>
    </StyledCard>
  );
};


const CardSection = () => {
  return (
    <StyledWrapper>
<Card
  title="OUR COMMITMENT"
  image="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  message="At AnnSeva, we believe food is more than just something to eat — it's love, comfort, and dignity. It's the warmth of a home-cooked meal, the joy of sharing, and the hope that someone cares.
Every single day, so much good food is tossed away while others go to sleep hungry — not because there isn't enough food, but because it isn't reaching the right hands. That's where we step in.
We collect extra food from restaurants, events, and homes 🏠🍱, and ensure it reaches the ones who truly need it — people who may have gone unnoticed, unheard, and unfed. But for us, it's not just about feeding people — it's about restoring dignity, spreading kindness, and creating a community where no one feels alone in their struggle.
We believe that every meal rescued is more than just nourishment — it's a message of care. It tells someone, “You are seen. You are valued.”
With every food box delivered, we're not just filling empty plates — we're filling hearts with hope and lives with a sense of belonging. Because at AnnSeva, no meal is wasted and no heart is left empty. 💛🌍"
/>
<Card
  title="OUR VISION"
  image="https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
  message="Imagine a world where no one has to ask, “Will I eat today?” 💭
Our vision is to make that world a reality — a world where hunger is not a burden, but a problem we solved together.
We dream of a future where every surplus meal fills an empty plate, where abundance is shared, not wasted. By connecting food donors with hungry hearts, we aim to build a chain of care and compassion 🤝 — one that bridges kitchens with communities, and kindness with action.
With every act of giving, we move closer to a future where food waste is zero and empathy is infinite. We see a tomorrow where food isn't thrown away, but passed along — with love, purpose, and humanity.
Because change doesn't always need a revolution — sometimes, it begins with a single meal, a shared smile, and the belief that we all deserve to be fed.
Small steps. Big change. One meal at a time. 💪🍽️"
/>
<Card
  title="OUR MISSION"
  image="https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
  message="Food belongs in stomachs — not landfills. 🗑️🚫
Our mission is simple yet profound: rescue delicious, unused food and deliver it to those who need it most. Every untouched plate has the power to comfort a struggling family, nourish a child, or restore hope to someone without a home — because no one should ever have to go hungry. 🙏
We partner with restaurants, communities, and compassionate volunteers to create a seamless path from surplus to salvation. Together, we intercept meals before they go to waste and reroute them where they matter most.
It's not just about calories — it's about care, dignity, and restoring faith in humanity.🫱🏽‍🫲🏼
Every meal we save is a message that someone matters. Every delivery is a reminder that compassion still drives our world.
Because when we serve food, we're not just feeding bodies — we're feeding souls. ❤️"
/>

    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 50px;
  padding: 60px 40px;
  box-sizing: border-box;
  width: 100%;
`;

const StyledCard = styled.div`
  .card {
    width: 300px;
    height: 400px;
    background: #527e69;
    transition: all 0.4s;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.2);
    font-size: 24px;
    font-weight: 700;
    overflow: hidden;
    position: relative;
  }
  .card-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  margin-top: 20px;
  border-radius: 8px;
}


  .card:hover {
    border-radius: 15px;
    cursor: pointer;
    transform: scale(1.1);
    background: #9bc3ae;
  }

  .first-content,
  .second-content {
    width: 100%;
    height: 100%;
    transition: all 0.4s;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    text-align: center;
    box-sizing: border-box;
  }

  .card:hover .first-content {
    height: 0;
    opacity: 0;
  }

.second-content {
  height: 0;
  opacity: 0;
  font-size: 0;
  transform: rotate(90deg) scale(-1);
  flex-direction: column;
  padding: 20px;
  overflow-y: auto;  /* this ensures scrolling */
  overflow-x: hidden;
}



.card:hover .second-content {
  opacity: 1;
  height: 100%;
  transform: rotate(0deg);
  font-size: 20px;
}


  .second-text {
    font-size: 15px;
    line-height: 1.5;
    color: white;
    overflow-y: auto;
    max-height: 100%;
    width: 100%;
    padding-right: 8px;
  }

.second-text::-webkit-scrollbar {
  width: 6px;
}

.second-text::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 3px;
}


  @media (max-width: 900px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

export default CardSection;