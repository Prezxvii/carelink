import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How does CareLink verify resources?",
      answer: "Our team and community admins manually verify every resource listed. We check for active service hours, correct contact information, and eligibility requirements every 30 days."
    },
    {
      question: "Why do I need to provide my zip code?",
      answer: "CareLink uses your zip code to prioritize resources within your immediate neighborhood. This ensures you find help that is reachable and relevant to your specific borough."
    },
    {
      question: "Is there a cost to use CareLink?",
      answer: "No. CareLink is a free community platform designed to connect people with essential services. The organizations listed may have their own eligibility rules, but our platform is free for all."
    },
    {
      question: "How can I suggest a new resource?",
      answer: "Authenticated users can submit resources through the 'Add Resource' button. Once submitted, an admin will verify the details before it goes live to the community."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <PageWrapper>
      <div className="faq-container">
        <div className="faq-header">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="blue-text"
          >
            Frequently Asked Questions
          </motion.h1>
          <p>Everything you need to know about the CareLink platform.</p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <motion.div 
              layout // This makes the surrounding items slide smoothly
              key={index} 
              className={`faq-item glass-panel ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <h3>{faq.question}</h3>
                <motion.div 
                  className="faq-icon-wrapper"
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={22} color={activeIndex === index ? "#0077B6" : "#64748B"} />
                </motion.div>
              </div>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="faq-answer"
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default FAQ;