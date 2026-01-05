import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Navigation added
import { useAuth } from '../context/AuthContext';
import { useResources } from '../context/ResourcesContext';
import { MapPin, Mail, Heart, Calendar, Edit3, ShieldCheck, Settings, Bell, BookOpen, X, Loader2 } from 'lucide-react';
import ResourceCard from '../components/ui/ResourceCard';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfileData } = useAuth();
  const { resources } = useResources();
  const [savedResources, setSavedResources] = useState([]);
  const [activeTab, setActiveTab] = useState('saved');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', interests: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        location: user.location || '',
        interests: user.interests ? user.interests.join(', ') : ''
      });
    }
  }, [user, isModalOpen]);

  useEffect(() => {
    if (user?.savedItems && resources.length > 0) {
      const filtered = resources.filter(res => user.savedItems.includes(res.id || res._id));
      setSavedResources(filtered);
    }
  }, [user, resources]);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const interestsArray = formData.interests.split(',').map(i => i.trim()).filter(i => i !== "");
    const success = await updateProfileData({ ...formData, interests: interestsArray });
    if (success) setIsModalOpen(false);
    setIsSubmitting(false);
  };

  if (!user) return <div className="loading-screen"><Loader2 className="spinner" /><p>Loading...</p></div>;

  return (
    <div className="profile-page-container">
      <div className="profile-header-card">
        <div className="profile-banner-new">
          <div className="avatar-wrapper">
            <div className="profile-avatar-large">{user.name?.charAt(0).toUpperCase()}</div>
            <div className="status-badge"><ShieldCheck size={14} /> Verified</div>
          </div>
        </div>
        
        <div className="profile-intro">
          <div className="intro-text">
            <h1>{user.name}</h1>
            <p className="location-subtitle"><MapPin size={16} /> {user.location || 'Add Location'}</p>
          </div>
          <div className="header-actions">
            <button className="btn-edit-outline" onClick={() => setIsModalOpen(true)}>
              <Edit3 size={16} /> Edit Profile
            </button>
            <button className="icon-btn-ghost" onClick={() => navigate('/settings')}>
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="profile-main-grid">
        <aside className="profile-sidebar">
          <div className="info-group">
            <h3>Account Summary</h3>
            <div className="sidebar-item"><Mail size={16} /><div><label>Email</label><p>{user.email}</p></div></div>
            <div className="sidebar-item"><Calendar size={16} /><div><label>Member Since</label><p>January 2026</p></div></div>
          </div>

          <div className="info-group">
            <h3>My Interests</h3>
            <div className="interests-pill-container">
              {user.interests?.map(interest => <span key={interest} className="interest-pill">{interest}</span>)}
            </div>
          </div>

          <div className="info-group progress-group">
            <h3>Profile Completion</h3>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: user.location ? '100%' : '75%' }}></div>
            </div>
          </div>
        </aside>

        <main className="profile-activity">
          <div className="tabs-header">
            <button className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>
              <Heart size={18} /> Saved ({savedResources.length})
            </button>
            <button className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
              <Bell size={18} /> Alerts
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'saved' ? (
              <div className="saved-grid">
                {savedResources.length > 0 ? (
                  savedResources.map(item => <ResourceCard key={item.id} {...item} />)
                ) : (
                  <div className="empty-state-card">📂 <h4>No saved resources</h4></div>
                )}
              </div>
            ) : (
              <div className="notification-item unread">
                <div className="notif-icon"><BookOpen size={18} /></div>
                <div className="notif-text"><p>New resources matching your interests were added.</p></div>
              </div>
            )}
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="edit-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>Edit Profile</h2><button onClick={() => setIsModalOpen(false)}><X /></button></div>
            <form onSubmit={handleUpdateSubmit}>
              <div className="form-group"><label>Full Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></div>
              <div className="form-group"><label>Location</label><input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} /></div>
              <div className="form-group"><label>Interests (comma separated)</label><input type="text" value={formData.interests} onChange={(e) => setFormData({...formData, interests: e.target.value})} /></div>
              <div className="modal-actions"><button type="submit" className="btn-save" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;