import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; 
import './ResourceCard.css';

const ResourceCard = ({ id, title, category, address, city, description }) => {
  const navigate = useNavigate();
  const { user, toggleFavorite } = useAuth();
  
  // Ensure we compare strings to avoid mismatches with backend ID types
  const isSaved = user?.savedItems?.some(itemId => String(itemId) === String(id));

  const handleDetailsClick = (e) => {
    // Prevent navigation if the user clicked the heart button or its SVG path
    if (e.target.closest('.favorite-btn')) return;
    
    if (id && id !== 'N/A') {
      navigate(`/resources/${id}`);
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Stop click from bubbling up to the card's onClick
    toggleFavorite(id);
  };

  const displayDescription = description || "";

  return (
    <div className="resource-card glass-panel btn-pop" onClick={handleDetailsClick}>
      <div className="card-header">
        <div className="category-tag">{category}</div>
        
        {user && (
          <button 
            type="button" 
            className={`favorite-btn ${isSaved ? 'active' : ''}`}
            onClick={handleFavoriteClick}
            aria-label={isSaved ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              size={18} 
              fill={isSaved ? "#ef4444" : "none"} 
              strokeWidth={isSaved ? 0 : 2.5}
              style={{ color: isSaved ? "#ef4444" : "inherit" }}
            />
          </button>
        )}
      </div>
      
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        
        <p className="card-description">
          {displayDescription.length > 85 
            ? `${displayDescription.substring(0, 85)}...` 
            : displayDescription}
        </p>
        
        <div className="card-location">
          <MapPin size={14} className="location-icon" />
          <span>{address || 'Location varies'}, {city || 'NYC'}</span>
        </div>
      </div>

      <div className="card-footer">
        <span className="card-meta-info">New York, NY</span> 
        
        <button 
          type="button"
          className="details-btn" 
          aria-label={`View details for ${title}`}
        >
          View Details <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default ResourceCard;