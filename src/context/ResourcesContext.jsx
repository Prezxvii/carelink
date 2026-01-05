import React, { createContext, useContext, useState, useEffect } from 'react';

const ResourcesContext = createContext();

// 1. MOVE categoryKeywords OUTSIDE the component
// This ensures the reference never changes, preventing infinite loops.
const CATEGORY_KEYWORDS = {
  'Food': ['food', 'snap', 'nutrition', 'meal', 'pantry', 'wic', 'hunger', 'ebt'],
  'Housing': ['housing', 'rent', 'shelter', 'home', 'tenant', 'eviction', 'apartment', 'nycha', 'section 8', 'voucher'],
  'Healthcare': ['health', 'medical', 'medicaid', 'clinic', 'mental', 'insurance', 'doctor'],
  'Legal': ['legal', 'law', 'immigration', 'rights', 'court', 'counsel', 'attorney'],
  'Education': ['education', 'school', 'training', 'literacy', 'ged', 'college', 'head start', 'toddler', 'child care', 'infant']
};

export const useResources = () => {
  const context = useContext(ResourcesContext);
  if (!context) throw new Error('useResources must be used within ResourcesProvider');
  return context;
};

export const ResourcesProvider = ({ children }) => {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      const cachedData = sessionStorage.getItem('carelink_resources');
      const cacheTime = sessionStorage.getItem('carelink_resources_time');
      const now = Date.now();
      
      if (cachedData && cacheTime && (now - parseInt(cacheTime)) < 3600000) {
        setResources(JSON.parse(cachedData));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      const APP_TOKEN = 's3uth6GGknsBpPg4cWEJTxnt8'; 
      const API_URL = `https://data.cityofnewyork.us/resource/yjpx-srhp.json?$$app_token=${APP_TOKEN}&language=English&$limit=500`;
      
      const proxies = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(API_URL)}`,
        `https://corsproxy.io/?${encodeURIComponent(API_URL)}`,
        `https://proxy.cors.sh/${API_URL}`
      ];

      let data = null;
      let success = false;

      for (const url of proxies) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            data = await response.json();
            success = true;
            break; 
          }
        } catch (err) {
          console.warn("Proxy attempt failed...");
        }
      }

      if (success && data) {
        const transformedData = data
          .filter(item => item.language === "English")
          .map((item, index) => {
            const uniqueId = item.program_code && item.program_code !== "NULL" 
              ? item.program_code 
              : `nyc-res-${index}-${Math.random().toString(36).substr(2, 9)}`;

            let category = 'Other';
            const programText = `${item.program_name || ''} ${item.description_brief || ''}`.toLowerCase();
            
            // Use the constant from outside
            for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
              if (keywords.some(keyword => programText.includes(keyword))) {
                category = cat;
                break;
              }
            }

            return {
              id: uniqueId,
              title: item.program_name || 'NYC Program',
              category: category,
              description: item.short_description || 'NYC social service program',
              longDescription: item.description_brief || item.program_description || "Detailed info available via NYC Access.",
              eligibility: item.eligibility_description || "General NYC residency requirements apply.",
              address: item.address_1 || 'Citywide Service',
              city: item.borough || 'New York',
              state: 'NY',
              zip: item.zip_code || '',
              phone: item.contact_phone || '311',
              website: item.program_url || 'https://access.nyc.gov',
              languages: item.language || 'English',
              hours: item.hours_of_operation || 'Mon-Fri: 9:00 AM - 5:00 PM'
            };
          });

        setResources(transformedData);
        sessionStorage.setItem('carelink_resources', JSON.stringify(transformedData));
        sessionStorage.setItem('carelink_resources_time', now.toString());
        setIsLoading(false);
      } else {
        setError('Failed to load NYC Data');
        setIsLoading(false);
      }
    };

    fetchResources();
    // 2. We don't need categoryKeywords in the dependency array anymore 
    // because it is a static constant outside the component.
  }, []); 

  const getResourceById = (id) => resources.find(r => r.id === id);

  return (
    <ResourcesContext.Provider value={{ resources, isLoading, error, getResourceById }}>
      {children}
    </ResourcesContext.Provider>
  );
};

export default ResourcesContext;