import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import PageWrapper from '../components/layout/PageWrapper'; 
import SearchBar from '../components/ui/SearchBar';
import ResourceCard from '../components/ui/ResourceCard';
import { ChevronDown, Scale, HeartPulse, GraduationCap, ArrowRight } from 'lucide-react'; 

// Import Background Image
import HeroBg from '../assets/images/hero-bg.jpg'; 

// Import Icons
import SearchGif from '../assets/icons/search.gif';
import FilterGif from '../assets/icons/filter.gif';
import VerifiedGif from '../assets/icons/verified.gif';
import CommunityGif from '../assets/icons/community.gif';
import ShieldGif from '../assets/icons/shield.gif';
import MapGif from '../assets/icons/map.gif';
import UsersGif from '../assets/icons/users.gif';

const Home = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Mock data for featured section
  const data = [
    { id: '1', title: "Central Pantry", category: "Food", address: "123 Atlantic Ave", city: "Brooklyn", description: "Providing fresh produce and shelf-stable goods to the community." },
    { id: '2', title: "Legal Aid Society", category: "Legal", address: "199 Water St", city: "Manhattan", description: "Free legal services for low-income New Yorkers facing housing issues." }
  ];

  const faqs = [
    { question: "How does CareLink verify resources?", answer: "Our team manually verifies every listing every 30 days to ensure hours and locations are accurate." },
    { question: "Is my location data private?", answer: "Yes. We only use your zip code to filter local results; we never track or sell your personal movement data." },
    { question: "Can I add a resource I found?", answer: "Absolutely. Registered users can submit new resources, which go live after a quick verification check." }
  ];

  return (
    <PageWrapper>
      <div className="home-container">
        
        {/* 1. HERO SECTION WITH BACKGROUND */}
        <motion.section 
          className="hero-section"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          style={{ 
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5)), url(${HeroBg})` 
          }}
        >
          <motion.h1 className="hero-title" variants={fadeInUp}>
            Verified Help, <span className="blue-text">Near You.</span>
          </motion.h1>
          <motion.p className="hero-subtitle" variants={fadeInUp}>
            Care<span>Link</span> centralizes up-to-date assistance for food, housing, legal aid, and mental health in one clean platform.
          </motion.p>
          <motion.div className="hero-search-wrapper" variants={fadeInUp}>
            <SearchBar />
          </motion.div>
        </motion.section>

        {/* 2. HOW IT WORKS SECTION */}
        <section className="how-it-works">
          <motion.h2 className="section-label">How Care<span>Link</span> Works</motion.h2>
          <motion.div className="how-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {[
              { img: SearchGif, title: "Search Location", text: "Enter your zip code to see resources in your neighborhood.", num: "01" },
              { img: FilterGif, title: "Filter by Need", text: "Select from Food, Housing, Legal Aid, or Mental Health services.", num: "02" },
              { img: VerifiedGif, title: "Verified Access", text: "Review contact details verified by our community experts.", num: "03" },
              { img: CommunityGif, title: "Connect", text: "Join local groups to share updates or ask neighbors for advice.", num: "04" }
            ].map((step, idx) => (
              <motion.div key={idx} className="how-step glass-panel" variants={fadeInUp} whileHover={{ y: -5 }}>
                <div className="step-number">{step.num}</div>
                <div className="icon-box"><img src={step.img} alt={step.title} className="gif-icon" /></div>
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* 3. CATEGORY PREVIEW */}
        <section className="expanded-services">
          <motion.h2 className="section-label">Browse by <span>Category</span></motion.h2>
          <div className="services-mini-grid">
            <div className="service-mini-card" onClick={() => navigate('/resources?category=Legal')}>
              <Scale size={32} color="#0077B6" />
              <span>Legal Aid</span>
            </div>
            <div className="service-mini-card" onClick={() => navigate('/resources?category=Healthcare')}>
              <HeartPulse size={32} color="#0077B6" />
              <span>Mental Health</span>
            </div>
            <div className="service-mini-card" onClick={() => navigate('/resources?category=Education')}>
              <GraduationCap size={32} color="#0077B6" />
              <span>Education</span>
            </div>
          </div>
        </section>

        {/* 4. FEATURED RESOURCES */}
        <section className="resources-grid-section">
          <div className="section-header-flex">
            <h2 className="section-label">Resources in Your Area</h2>
            <button className="view-all-link" onClick={() => navigate('/resources')}>
              View All <ArrowRight size={16} />
            </button>
          </div>
          <motion.div className="resources-container" initial="hidden" whileInView="visible" variants={staggerContainer}>
            {data.map(item => (
              <motion.div key={item.id} variants={fadeInUp}>
                <ResourceCard {...item} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* 5. MISSION SECTION */}
        <section className="mission-section">
          <div className="mission-wrapper">
            <motion.div className="mission-text-container" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}>
              <h2 className="section-label">Why Care<span>Link</span>?</h2>
              <p className="mission-description">Finding help shouldn't be a second job. Care<span>Link</span> was born from the observation that information is often fragmented.</p>
              <button className="secondary-btn btn-pop" onClick={() => navigate('/about')}>
                Our Full Story
              </button>
            </motion.div>
            <div className="mission-features">
              <div className="feature-card glass-panel">
                 <img src={ShieldGif} alt="Verified" className="gif-icon-small" />
                 <div><h5>Verified Data</h5><p>Checked every 30 days.</p></div>
              </div>
              <div className="feature-card glass-panel">
                 <img src={MapGif} alt="Location" className="gif-icon-small" />
                 <div><h5>Location Aware</h5><p>Zip code specific support.</p></div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FAQ SECTION */}
        <section className="home-faq-section">
          <h2 className="section-label">F<span>AQ</span></h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <motion.div layout key={index} className={`faq-item glass-panel ${activeFaq === index ? 'active' : ''}`} onClick={() => toggleFaq(index)}>
                <div className="faq-question">
                  <h3>{faq.question}</h3>
                  <motion.div animate={{ rotate: activeFaq === index ? 180 : 0 }}><ChevronDown size={24} color="#0077B6" /></motion.div>
                </div>
                {activeFaq === index && <motion.div className="faq-answer"><p>{faq.answer}</p></motion.div>}
              </motion.div>
            ))}
          </div>
        </section>

        {/* 7. COMMUNITY CTA */}
        <motion.section 
          className="community-cta"
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
        >
          <div className="cta-icon-box">
            <img src={UsersGif} alt="Community" className="gif-icon-large" />
          </div>
          <h2>Join the Conversation</h2>
          <p>Connect with neighbors on Care<span>Link</span> to share resources and community advice.</p>
          <motion.button 
            className="btn-signup btn-pop"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/community')}
          >
            Explore Groups
          </motion.button>
        </motion.section>
      </div>
    </PageWrapper>
  );
};

export default Home;