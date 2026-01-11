// src/data/mockLiveFeed.js

const MOCK_LIVE_FEED = [
  // --- Benefits & Cash Support ---
  {
    id: 'live-1',
    type: 'nyc',
    user: 'NYC Human Resources Administration',
    isExpert: true,
    title: 'SNAP Benefits Assistance',
    text: 'Apply for SNAP (Food Stamps) online, manage your case, and learn eligibility basics.',
    url: 'https://www.nyc.gov/site/hra/help/snap-benefits-food-program.page',
    time: 'Verified',
    likes: 4,
    isLiked: false,
    comments: []
  },
  {
    id: 'live-2',
    type: 'nyc',
    user: 'ACCESS HRA',
    isExpert: true,
    title: 'ACCESS HRA (Benefits Portal)',
    text: 'Apply for benefits, upload documents, check case status, and manage your account.',
    url: 'https://a069-access.nyc.gov/',
    time: 'Verified',
    likes: 7,
    isLiked: false,
    comments: []
  },
  {
    id: 'live-3',
    type: 'nyc',
    user: 'NYC HRA',
    isExpert: true,
    title: 'Cash Assistance',
    text: 'Learn about eligibility and how to apply for cash assistance through NYC HRA.',
    url: 'https://www.nyc.gov/site/hra/help/cash-assistance.page',
    time: 'Verified',
    likes: 5,
    isLiked: false,
    comments: []
  },
  {
    id: 'live-4',
    type: 'nyc',
    user: 'ACCESS NYC',
    isExpert: true,
    title: 'One Shot Deal (Emergency Cash Help)',
    text: 'One-time emergency financial help for rent arrears, utilities, and other crises.',
    url: 'https://access.nyc.gov/programs/one-shot-deal/',
    time: 'Verified',
    likes: 9,
    isLiked: false,
    comments: []
  },

  // --- Housing & Eviction Prevention ---
  {
    id: 'live-5',
    type: 'nyc',
    user: 'NYC Housing Connect',
    isExpert: true,
    title: 'Affordable Housing Lottery',
    text: 'Find and apply for affordable apartments and homeownership opportunities across NYC.',
    url: 'https://housingconnect.nyc.gov/PublicWeb/',
    time: 'Verified',
    likes: 10,
    isLiked: false,
    comments: []
  },
  {
    id: 'live-6',
    type: 'nyc',
    user: 'NYC HRA',
    isExpert: true,
    title: 'CityFHEPS Rental Assistance',
    text: 'Rental assistance program to help eligible individuals and families find and keep housing.',
    url: 'https://www.nyc.gov/site/hra/help/cityfheps.page',
    time: 'Verified',
    likes: 8,
    isLiked: false,
    comments: []
  },
  {
    id: 'live-7',
    type: 'nyc',
    user: 'NYC HRA',
    isExpert: true,
    title: 'Homebase (Homelessness Prevention)',
    text: 'Housing stability support, eviction prevention help, and aftercare services citywide.',
    url: 'https://www.nyc.gov/site/hra/help/homebase.page',
    time: 'Verified',
    likes: 6,
    isLiked: false,
    comments: []
  },
  {
    id: 'live-8',
    type: 'nyc',
    user: 'NYC HRA',
    isExpert: true,
    title: 'Free Legal Services for Tenants',
    text: 'Free legal help and tenant protections available across NYC zip codes.',
    url: 'https://www.nyc.gov/site/hra/help/legal-services-for-tenants.page',
    time: 'Verified',
    likes: 11,
    isLiked: false,
    comments: []
  },

  // --- Transportation ---
  {
    id: 'live-9',
    type: 'nyc',
    user: 'Fair Fares NYC',
    isExpert: true,
    title: '50% Off Subway & Bus Fares',
    text: 'Eligible New Yorkers with low incomes can receive a 50% discount on transit fares.',
    url: 'https://www.nyc.gov/site/fairfares/index.page',
    time: 'Verified',
    likes: 12,
    isLiked: false,
    comments: []
  },

  // --- Healthcare & Mental Health ---
  {
    id: 'live-10',
    type: 'nyc',
    user: 'NYC Health + Hospitals',
    isExpert: true,
    title: 'Public Hospitals & Community Clinics',
    text: 'Citywide hospitals and clinics providing care regardless of insurance status.',
    url: 'https://www.nychealthandhospitals.org/',
    time: 'Verified',
    likes: 7,
    isLiked: false,
    comments: []
  },
  {
    id: 'live-11',
    type: 'nyc',
    user: 'NYC 988',
    isExpert: true,
    title: 'NYC 988 Mental Health Support',
    text: 'Free, confidential mental health support by phone, text, or chat — 24/7.',
    url: 'https://nyc988.cityofnewyork.us/en/',
    time: 'Verified',
    likes: 13,
    isLiked: false,
    comments: []
  },
  {
    id: 'live-12',
    type: 'nyc',
    user: 'NYC Mental Health',
    isExpert: true,
    title: 'How to Access Mental Health Services',
    text: 'Guidance for crisis services, walk-ins, and finding support in NYC.',
    url: 'https://mentalhealth.cityofnewyork.us/how-to-access',
    time: 'Verified',
    likes: 6,
    isLiked: false,
    comments: []
  },

  // --- Child & Family Support ---
  {
    id: 'live-13',
    type: 'nyc',
    user: 'NYC ACS',
    isExpert: true,
    title: 'Apply for Child Care Assistance',
    text: 'Apply for subsidized childcare and learn required documents and steps.',
    url: 'https://www.nyc.gov/site/acs/early-care/apply-child-care.page',
    time: 'Verified',
    likes: 8,
    isLiked: false,
    comments: []
  },

  // --- Jobs & Training ---
  {
    id: 'live-14',
    type: 'nyc',
    user: 'NYC Workforce1',
    isExpert: true,
    title: 'Job Training & Employment Help',
    text: 'Free career counseling, resume help, interview prep, and job referrals.',
    url: 'https://www.nyc.gov/site/sbs/careers/wf1-career-centers.page',
    time: 'Verified',
    likes: 9,
    isLiked: false,
    comments: []
  },

  // --- Digital Access ---
  {
    id: 'live-15',
    type: 'nyc',
    user: 'Big Apple Connect',
    isExpert: true,
    title: 'Big Apple Connect (Free Internet for NYCHA)',
    text: 'Free internet + basic TV for eligible NYCHA residents (provider depends on location).',
    url: 'https://www.nyc.gov/assets/bigappleconnect/',
    time: 'Verified',
    likes: 10,
    isLiked: false,
    comments: []
  },

  // --- IDs / City Access ---
  {
    id: 'live-16',
    type: 'nyc',
    user: 'IDNYC',
    isExpert: true,
    title: 'IDNYC Municipal ID',
    text: 'Free government-issued photo ID for NYC residents (appointments + application info).',
    url: 'https://www.nyc.gov/site/idnyc/index.page',
    time: 'Verified',
    likes: 7,
    isLiked: false,
    comments: []
  },

  // --- Immigration Legal Help ---
  {
    id: 'live-17',
    type: 'nyc',
    user: 'NYC HRA + MOIA',
    isExpert: true,
    title: 'Legal Services for Immigrant New Yorkers',
    text: 'Free, confidential immigration legal services and hotline support.',
    url: 'https://www.nyc.gov/site/hra/help/legal-services-for-immigrant-new-yorkers.page',
    time: 'Verified',
    likes: 11,
    isLiked: false,
    comments: []
  },

  // --- Senior Services ---
  {
    id: 'live-18',
    type: 'nyc',
    user: 'NYC Department for the Aging',
    isExpert: true,
    title: 'NYC Aging (Senior Support & Meals)',
    text: 'Support services, benefits navigation, and help via Aging Connect.',
    url: 'https://www.nyc.gov/site/dfta/index.page',
    time: 'Verified',
    likes: 5,
    isLiked: false,
    comments: []
  },

  // --- Tax Help (seasonal but useful) ---
  {
    id: 'live-19',
    type: 'nyc',
    user: 'ACCESS NYC',
    isExpert: true,
    title: 'NYC Free Tax Prep',
    text: 'Free tax filing help for eligible New Yorkers through VITA/TCE sites.',
    url: 'https://access.nyc.gov/programs/nyc-free-tax-prep/',
    time: 'Verified',
    likes: 6,
    isLiked: false,
    comments: []
  },

  // --- Community-style (still legit org links) ---
  {
    id: 'live-20',
    type: 'user',
    user: 'Community Volunteer',
    isExpert: false,
    title: 'Food Help Finder',
    text: 'If you’re looking for pantry locations and grocery support, Food Bank can help you find nearby options.',
    url: 'https://www.foodbanknyc.org/find-food/',
    time: '2h ago',
    likes: 4,
    isLiked: false,
    comments: []
  },
  {
    id: 'live-21',
    type: 'user',
    user: 'Bronx Resident',
    isExpert: false,
    title: 'Bronx Legal Services',
    text: 'If you’re dealing with housing issues, try contacting Bronx Legal Services for support.',
    url: 'https://www.bronxlegalservices.org/',
    time: '3h ago',
    likes: 3,
    isLiked: false,
    comments: []
  },
  {
    id: 'live-22',
    type: 'user',
    user: 'Queens Parent',
    isExpert: false,
    title: 'After-School Programs',
    text: 'Sunnyside Community Services offers strong after-school and family programs.',
    url: 'https://www.scsny.org/',
    time: '5h ago',
    likes: 4,
    isLiked: false,
    comments: []
  },
  {
    id: 'live-23',
    type: 'user',
    user: 'Brooklyn Organizer',
    isExpert: false,
    title: 'Mutual Aid Support',
    text: 'Mutual aid groups can help with essentials and local support networks.',
    url: 'https://bushwickayudamutua.com/',
    time: '6h ago',
    likes: 6,
    isLiked: false,
    comments: []
  }
];

export default MOCK_LIVE_FEED;

