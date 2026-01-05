// src/pages/Favorites.jsx
import React, { useMemo } from 'react';
import { useResources } from '../context/ResourcesContext';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import ResourceCard from '../components/ui/ResourceCard';
import './Favorites.css';

// Ensure this matches the MOCK_DATA used in Resources.jsx
const MOCK_DATA = [
  {
    id: 'm1',
    title: "City Harvest Food Pantry",
    category: "Food",
    zip: "10001",
    borough: "Manhattan",
    city: "New York",
    state: "NY",
    address: "6 East 32nd Street",
    phone: "(646) 412-0600",
    website: "https://www.cityharvest.org",
    hours: "Mon–Fri: 9am–5pm",
    description: "Emergency food distribution and hunger relief services.",
    longDescription:
      "City Harvest rescues surplus food and delivers it to food pantries, soup kitchens, and community programs across New York City.",
    eligibility: "Open to NYC residents in need."
  },
  {
    id: 'm2',
    title: "Bronx Legal Services",
    category: "Housing",
    zip: "10451",
    borough: "Bronx",
    city: "Bronx",
    state: "NY",
    address: "349 East 149th Street",
    phone: "(718) 928-3700",
    website: "https://www.bronxlegalservices.org",
    hours: "Mon–Fri: 9am–5pm",
    description: "Legal support for housing, eviction, and tenant rights.",
    longDescription:
      "Bronx Legal Services provides free legal representation to low-income residents facing eviction, housing discrimination, and unsafe living conditions.",
    eligibility: "Income-eligible Bronx residents."
  },
  {
    id: 'm3',
    title: "Brooklyn Community Mental Health Center",
    category: "Healthcare",
    zip: "11201",
    borough: "Brooklyn",
    city: "Brooklyn",
    state: "NY",
    address: "25 Chapel Street",
    phone: "(718) 875-6565",
    website: "https://www.nychealthandhospitals.org",
    description: "Outpatient mental health counseling and psychiatric services."
  },
  {
    id: 'm4',
    title: "LaGuardia Community College Adult Literacy Program",
    category: "Education",
    zip: "11101",
    borough: "Queens",
    city: "Long Island City",
    state: "NY",
    address: "31-10 Thomson Avenue",
    phone: "(718) 482-7200",
    website: "https://www.laguardia.edu",
    description: "Adult literacy, GED prep, and ESL programs."
  },
  {
    id: 'm5',
    title: "Legal Aid Society – Staten Island",
    category: "Legal",
    zip: "10301",
    borough: "Staten Island",
    city: "Staten Island",
    state: "NY",
    address: "60 Bay Street",
    phone: "(347) 422-5333",
    website: "https://legalaidnyc.org",
    description: "Free civil legal services for low-income residents."
  },
  {
    id: 'm6',
    title: "West Harlem Group Assistance",
    category: "Food",
    zip: "10027",
    borough: "Manhattan",
    city: "New York",
    state: "NY",
    address: "175 West 137th Street",
    phone: "(212) 862-0500",
    website: "https://www.westharlemgroupassistance.org",
    description: "Food pantry and emergency grocery assistance."
  },
  {
    id: 'm7',
    title: "Astoria Health Pavilion",
    category: "Healthcare",
    zip: "11102",
    borough: "Queens",
    city: "Astoria",
    state: "NY",
    address: "25-20 30th Avenue",
    phone: "(718) 728-5000",
    website: "https://www.mountsinai.org",
    description: "Primary care, vaccinations, and specialty services."
  },
  {
    id: 'm8',
    title: "RiseBoro Senior Housing Services",
    category: "Housing",
    zip: "11211",
    borough: "Brooklyn",
    city: "Brooklyn",
    state: "NY",
    address: "83 Moore Street",
    phone: "(718) 366-3900",
    website: "https://www.riseboro.org",
    description: "Affordable and supportive housing for seniors."
  },
  {
    id: 'm9',
    title: "Fordham Bedford Early Childhood Center",
    category: "Education",
    zip: "10458",
    borough: "Bronx",
    city: "Bronx",
    state: "NY",
    address: "2558 Bainbridge Avenue",
    phone: "(718) 933-1100",
    website: "https://www.nyc.gov/site/dycd",
    description: "Pre-K education and family support services."
  },
  {
    id: 'm10',
    title: "Center for Independence of the Disabled, NY",
    category: "Legal",
    zip: "10011",
    borough: "Manhattan",
    city: "New York",
    state: "NY",
    address: "841 Broadway",
    phone: "(212) 674-2300",
    website: "https://www.cidny.org",
    description: "Advocacy and benefits assistance for people with disabilities."
  },
  {
    id: 'm11',
    title: "Bushwick Mutual Aid Pantry",
    category: "Food",
    zip: "11237",
    borough: "Brooklyn",
    city: "Brooklyn",
    state: "NY",
    address: "386 Cornelia Street",
    phone: "(718) 366-4599",
    website: "https://bushwickayudamutua.com",
    description: "Community-run food pantry and meal support."
  },
  {
    id: 'm12',
    title: "Jamaica Hospital Behavioral Health",
    category: "Healthcare",
    zip: "11432",
    borough: "Queens",
    city: "Jamaica",
    state: "NY",
    address: "89-00 Van Wyck Expressway",
    phone: "(718) 206-6000",
    website: "https://jamaicahospital.org",
    description: "Mental health crisis intervention and outpatient care."
  },
  {
    id: 'm13',
    title: "Bronx Family Shelter (DHS)",
    category: "Housing",
    zip: "10452",
    borough: "Bronx",
    city: "Bronx",
    state: "NY",
    address: "151 East 151st Street",
    phone: "(718) 503-6400",
    website: "https://www.nyc.gov/site/dhs",
    description: "Emergency shelter and housing placement for families."
  },
  {
    id: 'm14',
    title: "Queens Tech Incubator",
    category: "Education",
    zip: "11354",
    borough: "Queens",
    city: "Flushing",
    state: "NY",
    address: "133-29 41st Avenue",
    phone: "(718) 886-9000",
    website: "https://queenslibrary.org",
    description: "Free technology training and digital literacy programs."
  },
  {
    id: 'm15',
    title: "Lower East Side Legal Services",
    category: "Legal",
    zip: "10002",
    borough: "Manhattan",
    city: "New York",
    state: "NY",
    address: "89 Delancey Street",
    phone: "(646) 442-3600",
    website: "https://www.legalservicesnyc.org",
    description: "Criminal defense, housing, and social services support."
  },
  {
    id: 'm16',
    title: "Bedford-Stuyvesant Restoration Urban Farm",
    category: "Food",
    zip: "11216",
    borough: "Brooklyn",
    city: "Brooklyn",
    state: "NY",
    address: "1258 Fulton Street",
    phone: "(718) 636-6540",
    website: "https://restorationplaza.org",
    description: "Urban agriculture and fresh food access programs."
  },
  {
    id: 'm17',
    title: "Upper West Side Recovery Center",
    category: "Healthcare",
    zip: "10024",
    borough: "Manhattan",
    city: "New York",
    state: "NY",
    address: "250 West 96th Street",
    phone: "(212) 580-7300",
    website: "https://www.mountsinai.org",
    description: "Substance abuse recovery and support groups."
  },
  {
    id: 'm18',
    title: "Belmont Housing Resources for WNY",
    category: "Housing",
    zip: "10457",
    borough: "Bronx",
    city: "Bronx",
    state: "NY",
    address: "104 East 183rd Street",
    phone: "(718) 716-8000",
    website: "https://www.belmonthousingwny.org",
    description: "Housing counseling and Section 8 assistance."
  },
  {
    id: 'm19',
    title: "Sunnyside Community Services",
    category: "Education",
    zip: "11104",
    borough: "Queens",
    city: "Sunnyside",
    state: "NY",
    address: "43-31 39th Street",
    phone: "(718) 784-6173",
    website: "https://www.scsny.org",
    description: "After-school tutoring and youth development programs."
  },
  {
    id: 'm20',
    title: "NYC Small Business Pro Bono Network",
    category: "Legal",
    zip: "10013",
    borough: "Manhattan",
    city: "New York",
    state: "NY",
    address: "123 William Street",
    phone: "(212) 618-0500",
    website: "https://www.nycbar.org",
    description: "Free legal help for small businesses and entrepreneurs."
  }
];

const Favorites = () => {
  const { resources } = useResources();
  const { user } = useAuth();

  const savedResources = useMemo(() => {
    // 1. Get saved IDs from user profile (backend)
    const saved = user?.savedItems || [];
    if (!saved.length) return [];

    const savedSet = new Set(saved.map(String));

    // 2. Combine API resources and Mock resources
    const allAvailableResources = [...MOCK_DATA, ...(resources || [])];

    // 3. Filter the combined list
    return allAvailableResources.filter((res) => {
      const rid = String(res?.id || res?._id || '');
      return savedSet.has(rid);
    });
  }, [resources, user]);

  if (!user) {
    return (
      <div className="favorites-container">
        <div className="empty-favorites glass-panel">
          <div className="empty-icon-circle"><Bookmark size={40} /></div>
          <h2>Please log in to view saved resources</h2>
          <Link to="/login" className="btn-explore-blue">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <div>
          <h1>Saved Resources</h1>
          <p>Manage the <strong>{savedResources.length}</strong> items you've bookmarked.</p>
        </div>
        <Link to="/resources" className="btn-add-more">
          Browse More <ArrowRight size={18} />
        </Link>
      </div>

      {savedResources.length > 0 ? (
        <div className="favorites-grid">
          {savedResources.map((resource) => (
            <ResourceCard 
              key={resource.id || resource._id} 
              {...resource} 
              isFavorite={true} // Pass a prop to show the filled heart icon
            />
          ))}
        </div>
      ) : (
        <div className="empty-favorites glass-panel">
          <div className="empty-icon-circle"><Bookmark size={40} /></div>
          <h2>Your list is empty</h2>
          <p>You haven't bookmarked any resources yet.</p>
          <Link to="/resources" className="btn-explore-blue" style={{ marginTop: '20px' }}>
            Explore Resources
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;
