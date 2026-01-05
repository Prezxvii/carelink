import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react'; // You can replace this with a GIF if preferred
import './HomeFAQ.css';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq-item glass-panel ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
      <div className="faq-question">
        <h3>{question}</h3>
        <div className={`faq-icon ${isOpen ? 'rotate' : ''}`}>
          <ChevronDown size={24} color="#0077B6" />
        </div>
      </div>
      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </div>
  );
};

const HomeFAQ = () => {
  const faqs = [
    { question: "How does CareLink verify resources?", answer: "Our team manually verifies every listing every 30 days to ensure hours and locations are accurate." },
    { question: "Is my location data private?", answer: "Yes. We only use your zip code to filter local results; we never track or sell your personal movement data." },
    { question: "Can I add a resource I found?", answer: "Absolutely. Registered users can submit new resources, which go live after a quick verification check." }
  ];

  return (
    <section className="home-faq-section">
      <h2 className="section-label">Common <span>Questions</span></h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <FAQItem key={index} {...faq} />
        ))}
      </div>
    </section>
  );
};

export default HomeFAQ;