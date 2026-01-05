import React, { useState } from 'react';
import { ArrowLeft, LogIn, Eye, EyeOff, UserPlus, ChevronRight, CheckCircle, Heart, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Auth = ({ type = 'login' }) => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    location: '', 
    zipCode: '',
    interests: [],
    email: '',
    password: ''
  });

  const isLogin = type === 'login';

  const handleNext = () => setStep(s => s + 1);

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setAuthError('');

    try {
      if (isLogin) {
        // Backend handles email/password validation
        const result = await login(formData.email, formData.password);
        if (!result.success) throw new Error(result.message);
      } else {
        // Prepare data to match our Mongoose Model (name instead of firstName/lastName)
        const signupData = {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          password: formData.password,
          location: formData.location,
          zipCode: formData.zipCode,
          interests: formData.interests
        };
        
        const result = await signup(signupData);
        if (!result.success) throw new Error(result.message);
      }
      
      // If successful, redirect to resources
      navigate('/resources');
    } catch (err) {
      // The error message from your AuthContext/Backend is now caught here
      setAuthError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        
        <div className="auth-nav-top">
          <button 
            className="back-btn-pill" 
            onClick={() => isLogin ? navigate('/') : (step > 1 ? setStep(step - 1) : navigate('/'))}
          >
            <ArrowLeft size={18} /> 
            <span>{isLogin ? 'Back to Home' : step === 1 ? 'Back to Home' : 'Previous Step'}</span>
          </button>
        </div>

        {/* Dynamic Error Banner */}
        <AnimatePresence>
          {authError && (
            <motion.div 
              className="auth-error-banner"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <p>{authError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="auth-header">
                <div className="auth-icon-circle"><LogIn size={24} /></div>
                <h1>Welcome Back</h1>
                <p>Sign in to continue to Care<span>Link</span></p>
              </div>

              <button className="google-btn-auth" type="button">
                <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="G" />
                <span>Login with Google</span>
              </button>

              <div className="auth-divider"><span>OR LOGIN WITH EMAIL</span></div>

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-input-group">
                  <input 
                    type="email" 
                    placeholder="Email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="auth-input-group password-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    required 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <button type="button" className="forgot-link">Forgot Password?</button>
                <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="spinner" size={20} /> : 'Login'}
                </button>
              </form>
            </motion.div>
          ) : (
            <div className="onboarding-flow">
              <div className="step-dots">
                <div className={`dot ${step >= 1 ? 'active' : ''}`} />
                <div className={`dot ${step >= 2 ? 'active' : ''}`} />
                <div className={`dot ${step >= 3 ? 'active' : ''}`} />
              </div>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                    <div className="auth-header">
                      <div className="auth-icon-circle"><UserPlus size={24} /></div>
                      <h1>Create Account</h1>
                      <p>First, tell us who you are.</p>
                    </div>

                    <div className="auth-input-row">
                      <div className="auth-input-group">
                        <input 
                          type="text" 
                          placeholder="First Name" 
                          value={formData.firstName} 
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                        />
                      </div>
                      <div className="auth-input-group">
                        <input 
                          type="text" 
                          placeholder="Last Name" 
                          value={formData.lastName} 
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                        />
                      </div>
                    </div>

                    <div className="auth-input-group">
                      <select 
                        className="auth-select"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      >
                        <option value="" disabled>Select Neighborhood</option>
                        <option value="Bronx">The Bronx</option>
                        <option value="Brooklyn">Brooklyn</option>
                        <option value="Manhattan">Manhattan</option>
                        <option value="Queens">Queens</option>
                        <option value="Staten Island">Staten Island</option>
                        <option value="Harlem">Harlem</option>
                        <option value="Westchester">Westchester</option>
                      </select>
                    </div>

                    <div className="auth-input-group">
                      <input 
                        type="text" 
                        placeholder="NYC Zip Code" 
                        value={formData.zipCode} 
                        onChange={(e) => setFormData({...formData, zipCode: e.target.value})} 
                      />
                    </div>

                    <button className="auth-submit-btn" onClick={handleNext}>
                      Continue <ChevronRight size={18} />
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                    <div className="auth-header">
                      <div className="auth-icon-circle"><Heart size={24} /></div>
                      <h1>Your Interests</h1>
                      <p>What can Care<span>Link</span> help you find?</p>
                    </div>
                    <div className="interests-grid">
                      {['Food', 'Housing', 'Legal', 'Healthcare', 'Education'].map(item => (
                        <button 
                          key={item} 
                          className={`interest-pill ${formData.interests.includes(item) ? 'active' : ''}`}
                          onClick={() => toggleInterest(item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                    <button className="auth-submit-btn" onClick={handleNext}>
                      Next <ChevronRight size={18} />
                    </button>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                    <div className="auth-header">
                      <div className="auth-icon-circle"><CheckCircle size={24} /></div>
                      <h1>Final Step</h1>
                      <p>Set your login credentials.</p>
                    </div>
                    <div className="auth-input-group">
                      <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div className="auth-input-group password-wrapper">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Create Password" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                      <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <button 
                      className="auth-submit-btn success" 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <Loader2 className="spinner" size={20} /> : 'Finish & Explore'} 
                      {!isSubmitting && <CheckCircle size={18} />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </AnimatePresence>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button className="footer-link" onClick={() => {
                setStep(1);
                navigate(isLogin ? "/signup" : "/login");
              }}>
              {isLogin ? 'Sign Up' : 'Login'} →
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;