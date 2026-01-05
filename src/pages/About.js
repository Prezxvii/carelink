import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <section className="about-hero">
        <h1>Our Mission at Care<span>Link</span></h1>
        <p>Connecting New Yorkers to the essential resources they need, when they need them most.</p>
      </section>

      <section className="about-content">
        <div className="about-card">
          <h2>Verified Help, Near You</h2>
          <p>
            CareLink was built to solve the difficulty of finding up-to-date assistance. 
            From food pantries to housing support, we centralize NYC's aid network 
            into one clean, easy-to-use platform.
          </p>
        </div>

        <div className="about-grid">
          <div className="grid-item">
            <h3>Reliable Data</h3>
            <p>We verify our resource lists to ensure you don't waste time on expired information.</p>
          </div>
          <div className="grid-item">
            <h3>Community First</h3>
            <p>Designed specifically for the diverse needs of NYC's five boroughs.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;