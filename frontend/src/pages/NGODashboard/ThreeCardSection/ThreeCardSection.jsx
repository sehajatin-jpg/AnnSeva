import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
         <h2>WHY PARTNER WITH ANNSEVA</h2>
      <div className="container">
        <div style={{"--r": -15}} className="glass">
          <div className="content">
                <h3>Empowering Delivery Agents</h3>
                <p>We generate employment opportunities for delivery agents, providing them with a sustainable source of income while making a meaningful impact in the community.</p>
          </div>
        </div>
        <div style={{"--r": 5}} className="glass">
          <div className="content">
            <h3>Make a Difference, Donate</h3>
            <p>Volunteers can make their hearts special by donating, offering a chance to help those in need and make a lasting difference in the lives of others.</p>
          </div>
        </div>
        <div style={{"--r": 25}} className="glass">
          <div className="content">
          <h3>Building Bridges Through NGOs</h3>
          <p>With the help of NGOs, we build connections between volunteers and delivery agents, ensuring food reaches those who are most in need, bridging communities together.</p>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  background: #f9fbef;
  h2 {
    margin-top: 50px;
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 50px;
    font-weight: 700;
    color: #333;
  }
  .container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .container .glass {
    position: relative;
    width: 370px;
    height: 450px;
    background: linear-gradient(135deg, #76b852 , #5f7058); /* Green gradient */
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 25px 25px rgba(0, 0, 0, 0.25);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.5s;
    border-radius: 10px;
    margin: 0 -45px;
    backdrop-filter: blur(10px);
    transform: rotate(calc(var(--r) * 1deg));
    margin-bottom: 90px;
  }

  .container:hover .glass {
    transform: rotate(0deg);
    margin: 0 10px;
    margin-bottom: 90px;
  }

  .container .content {
    color: #fff;
    text-align: center;
    padding: 20px;
  }

  .container .content h3 {
    margin-bottom: 90px;
    font-size: 1.5em;
    font-weight: bold;
  }

  .container .content p {
    font-size: 1em;
    line-height: 1.5;
  }
`;

export default Card;
