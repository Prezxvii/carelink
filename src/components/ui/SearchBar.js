import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  MapPin } from 'lucide-react';
import './SearchBar.css';

const SearchBar = () => {
  const navigate = useNavigate();
  
  // State for the two inputs
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('All');

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Construct the URL with query parameters
    // Example: /resources?location=10550&category=Food
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (category !== 'All') params.append('category', category);

    navigate({
      pathname: '/resources',
      search: `?${params.toString()}`,
    });
  };

  return (
    <form className="search-container glass-panel" onSubmit={handleSearch}>
      <div className="input-wrapper">
        <MapPin size={18} className="search-icon-inline" />
        <input 
          type="text" 
          placeholder="Zip Code or City..." 
          className="search-input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="select-wrapper">
        <select 
          className="search-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All Resources</option>
          <option value="Food">Food</option>
          <option value="Housing">Housing</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Legal">Legal Aid</option>
          <option value="Education">Education</option>
        </select>
      </div>

      <button type="submit" className="search-button btn-pop">
        Find Help
      </button>
    </form>
  );
};

export default SearchBar;