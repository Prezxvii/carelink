import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Bell, Shield, Save, Loader2, Lock, EyeOff, Trash2 } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const { user, updateProfileData } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // profile, notifications, privacy
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: user?.location || '',
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const success = await updateProfileData(formData);
    if (success) alert("Settings saved successfully!");
    setIsSaving(false);
  };

  return (
    <div className="settings-container">
      <aside className="settings-nav">
        <h3>Settings</h3>
        <button 
          className={`s-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={18}/> Profile Info
        </button>
        <button 
          className={`s-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <Bell size={18}/> Notifications
        </button>
        <button 
          className={`s-nav-item ${activeTab === 'privacy' ? 'active' : ''}`}
          onClick={() => setActiveTab('privacy')}
        >
          <Shield size={18}/> Privacy & Security
        </button>
      </aside>

      <main className="settings-content">
        {activeTab === 'profile' && (
          <section className="settings-section">
            <h2>Profile Information</h2>
            <p>Update your public profile details.</p>
            <form className="settings-form" onSubmit={handleSave}>
              <div className="input-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label>Location (Borough/City)</label>
                <div className="input-with-icon">
                  <MapPin size={18} className="input-icon"/>
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>
              <button type="submit" className="btn-save-settings" disabled={isSaving}>
                {isSaving ? <Loader2 className="spinner" size={18}/> : <Save size={18} />}
                {isSaving ? ' Saving...' : ' Save Changes'}
              </button>
            </form>
            <div className="danger-zone">
               <button className="btn-delete-account"><Trash2 size={16}/> Delete Account</button>
            </div>
          </section>
        )}

        {activeTab === 'notifications' && (
          <section className="settings-section">
            <h2>Notifications</h2>
            <p>Manage how you receive alerts about new resources.</p>
            <div className="setting-toggle-group">
              <div className="toggle-item">
                <div>
                  <h4>Email Notifications</h4>
                  <p>Receive weekly digests of new programs in {user.location}.</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="toggle-item">
                <div>
                  <h4>Resource Alerts</h4>
                  <p>Get notified when a saved resource updates its contact info.</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
            </div>
          </section>
        )}

        {activeTab === 'privacy' && (
          <section className="settings-section">
            <h2>Privacy & Security</h2>
            <p>Adjust your account security and data visibility.</p>
            <div className="privacy-options">
              <div className="option-card">
                <Lock size={20} />
                <div>
                  <h4>Change Password</h4>
                  <button className="btn-outline-sm">Update Password</button>
                </div>
              </div>
              <div className="option-card">
                <EyeOff size={20} />
                <div>
                  <h4>Profile Visibility</h4>
                  <p>Only verified organizations can see your interest list.</p>
                  <button className="btn-outline-sm">Manage Visibility</button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Settings;