import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import './Onboarding.css';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    zipCode: '',
    interests: [],
    email: '',
    password: ''
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="onboarding-container glass-panel">
      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2>Welcome to Care<span>Link</span></h2>
            <p>Let's start with the basics.</p>
            <div className="input-stack">
              <input type="text" placeholder="First Name" onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
              <input type="text" placeholder="Last Name" onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
              <input type="text" placeholder="Zip Code" onChange={(e) => setFormData({...formData, zipCode: e.target.value})} />
            </div>
            <button className="onboarding-btn" onClick={nextStep}>Continue <ChevronRight size={18} /></button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2>What brings you here?</h2>
            <p>Select all that apply to personalize your results.</p>
            <div className="interests-grid">
              {['Food', 'Housing', 'Legal Aid', 'Healthcare', 'Education'].map(item => (
                <div 
                  key={item} 
                  className={`interest-item ${formData.interests.includes(item) ? 'selected' : ''}`}
                  onClick={() => toggleInterest(item)}
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="btn-group">
              <button className="back-btn" onClick={prevStep}><ChevronLeft size={18} /> Back</button>
              <button className="onboarding-btn" onClick={nextStep}>Next</button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2>Secure your account</h2>
            <p>Almost there! Create your login details.</p>
            <div className="input-stack">
              <input type="email" placeholder="Email Address" />
              <input type="password" placeholder="Create Password" />
            </div>
            <button className="onboarding-btn finish">Complete Sign Up <CheckCircle size={18} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Onboarding;