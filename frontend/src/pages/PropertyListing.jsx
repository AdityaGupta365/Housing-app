// // src/pages/PropertyListing.jsx
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchAllProperties } from '../redux/slices/propertySlice';
// import PropertyCard from '../common/PropertyCard';
// import PropertySearch from './PropertySearch';
// import LoadingSpinner from '../common/LoadingSpinner';

// const PropertyListing = () => {
//   const dispatch = useDispatch();
//   const { properties, loading } = useSelector((state) => state.property);
//   const [filteredProperties, setFilteredProperties] = useState([]);
//   const [searchFilters, setSearchFilters] = useState(null);

//   useEffect(() => {
//     dispatch(fetchAllProperties());
//   }, [dispatch]);

//   useEffect(() => {
//     setFilteredProperties(properties);
//   }, [properties]);

//   const handleSearch = async (filters) => {
//     setSearchFilters(filters);
    
//     // Filter properties based on search criteria
//     let filtered = properties;

//     if (filters.location) {
//       filtered = filtered.filter(property =>
//         property.location.toLowerCase().includes(filters.location.toLowerCase())
//       );
//     }

//     if (filters.rentMin) {
//       filtered = filtered.filter(property => property.rent >= parseInt(filters.rentMin));
//     }

//     if (filters.rentMax) {
//       filtered = filtered.filter(property => property.rent <= parseInt(filters.rentMax));
//     }

//     if (filters.bedrooms) {
//       filtered = filtered.filter(property => property.bedrooms >= parseInt(filters.bedrooms));
//     }

//     if (filters.propertyType) {
//       filtered = filtered.filter(property => property.propertyType === filters.propertyType);
//     }

//     setFilteredProperties(filtered);
//   };

//   const handleReset = () => {
//     setSearchFilters(null);
//     setFilteredProperties(properties);
//   };

//   if (loading) {
//     return <LoadingSpinner message="Loading properties..." />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Available Properties</h1>
//           <p className="mt-2 text-gray-600">Find your perfect rental home</p>
//         </div>

//         <PropertySearch onSearch={handleSearch} onReset={handleReset} />

//         {/* Results Summary */}
//         <div className="mb-6">
//           <p className="text-gray-600">
//             {searchFilters ? 
//               `Found ${filteredProperties.length} properties matching your criteria` :
//               `Showing all ${filteredProperties.length} available properties`
//             }
//           </p>
//         </div>

//         {/* Property Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredProperties.map((property) => (
//             <PropertyCard key={property._id} property={property} />
//           ))}
//         </div>

//         {filteredProperties.length === 0 && (
//           <div className="text-center py-12">
//             <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//             </svg>
//             <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
//             <p className="mt-1 text-sm text-gray-500">
//               Try adjusting your search filters to see more results.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PropertyListing;













// import React, { useState, useEffect, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchAllProperties } from '../redux/slices/propertySlice.js';
// import { createBooking } from '../redux/slices/bookingSlice.js';
// import LoadingSpinner from '../common/LoadingSpinner.jsx';

// import { Link, Navigate } from 'react-router-dom';

// const PropertyListing = () => {
//   const dispatch = useDispatch();
//   const { properties, loading } = useSelector((state) => state.property);
  
//   // Search and filter states
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedProperty,setSelectedProperty]=useState('')
//   const [filters, setFilters] = useState({
//     location: '',
//     minRent: '',
//     maxRent: '',
//     propertyType: '',
//     bedrooms: '',
//     bathrooms: ''
//   });
//   const [sortBy, setSortBy] = useState('rent-asc');
//   const [showFilters, setShowFilters] = useState(false);
//   const [showBookingModel,setShowBookingModel]=useState(false);

//   useEffect(() => {
//     dispatch(fetchAllProperties());
//   }, [dispatch]);

//   // Filter and sort properties
//   const filteredAndSortedProperties = useMemo(() => {
//     let filtered = properties.filter(property => {
//       // Search term matching
//       const searchLower = searchTerm.toLowerCase();
//       const matchesSearch = !searchTerm || 
//         property.title?.toLowerCase().includes(searchLower) ||
//         property.location?.toLowerCase().includes(searchLower) ||
//         property.description?.toLowerCase().includes(searchLower);
      
//       // Location filter
//       const matchesLocation = !filters.location || 
//         property.location?.toLowerCase().includes(filters.location.toLowerCase());
      
//       // Rent filters
//       const rent = parseFloat(property.rent) || 0;
//       const minRent = parseFloat(filters.minRent) || 0;
//       const maxRent = parseFloat(filters.maxRent) || Infinity;
//       const matchesRent = rent >= minRent && rent <= maxRent;
      
//       // Property type filter
//       const matchesType = !filters.propertyType || 
//         property.type?.toLowerCase() === filters.propertyType.toLowerCase() ||
//         property.propertyType?.toLowerCase() === filters.propertyType.toLowerCase();
      
//       // Bedroom filter
//       const matchesBedrooms = !filters.bedrooms || 
//         (property.bedrooms && property.bedrooms >= parseInt(filters.bedrooms));
      
//       // Bathroom filter
//       const matchesBathrooms = !filters.bathrooms || 
//         (property.bathrooms && property.bathrooms >= parseInt(filters.bathrooms));

//       return matchesSearch && matchesLocation && matchesRent && 
//              matchesType && matchesBedrooms && matchesBathrooms;
//     });

//     // Sort properties
//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case 'rent-asc':
//           return (a.rent || 0) - (b.rent || 0);
//         case 'rent-desc':
//           return (b.rent || 0) - (a.rent || 0);
//         case 'newest':
//           return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
//         case 'oldest':
//           return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
//         case 'title':
//           return (a.title || '').localeCompare(b.title || '');
//         case 'bedrooms-desc':
//           return (b.bedrooms || 0) - (a.bedrooms || 0);
//         case 'bedrooms-asc':
//           return (a.bedrooms || 0) - (b.bedrooms || 0);
//         default:
//           return 0;
//       }
//     });

//     return filtered;
//   }, [properties, searchTerm, filters, sortBy]);

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [key]: value
//     }));
//   };

//   const handleBookingSubmit=(e)=>{
//     e.preventDefault();
//     dispatch(createBooking(e));
//     Navigate('/tenant/dashboard');
//   }

//   const clearFilters = () => {
//     setFilters({
//       location: '',
//       minRent: '',
//       maxRent: '',
//       propertyType: '',
//       bedrooms: '',
//       bathrooms: ''
//     });
//     setSearchTerm('');
//   };

//   const handleBookProperty = (propertyId) => {
//     console.log('Booking property:', propertyId);
//     // Add your booking logic here
//     try{
//       const Property =properties.find(p=>p.id===propertyId)
//       setShowBookingModel(true);
//       setSelectedProperty(Property);
//       // Navigate('/tenant/dashboard');
      
//     }
//     catch(err){
//       console.log(err);
//       alert('there is some error')
//     }
//   };

//   if (loading) {
//     return <LoadingSpinner message="Loading properties..." />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Available Properties</h1>
//               <p className="mt-2 text-gray-600">
//                 Showing {filteredAndSortedProperties.length} of {properties.length} properties
//               </p>
//             </div>
//             <Link to="/tenant/dashboard">
//               <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
//                 Back to Dashboard
//               </button>
//             </Link>
//           </div>
//         </div>

//         {/* Search Bar */}
//         <div className="bg-white p-6 rounded-lg shadow mb-6">
//           <div className="flex flex-col lg:flex-row gap-4">
//             <div className="flex-1">
//               <input
//                 type="text"
//                 placeholder="Search by title, location, or description..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//                 </svg>
//                 Filters
//               </button>
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="rent-asc">Price: Low to High</option>
//                 <option value="rent-desc">Price: High to Low</option>
//                 <option value="newest">Newest First</option>
//                 <option value="oldest">Oldest First</option>
//                 <option value="title">Title A-Z</option>
//                 <option value="bedrooms-desc">Most Bedrooms</option>
//                 <option value="bedrooms-asc">Least Bedrooms</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Filters Panel */}
//         {showFilters && (
//           <div className="bg-white p-6 rounded-lg shadow mb-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
//               <button
//                 onClick={clearFilters}
//                 className="text-blue-600 hover:text-blue-800 font-medium"
//               >
//                 Clear All
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
//                 <input
//                   type="text"
//                   placeholder="Enter location"
//                   value={filters.location}
//                   onChange={(e) => handleFilterChange('location', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Min Rent</label>
//                 <input
//                   type="number"
//                   placeholder="₹ 0"
//                   value={filters.minRent}
//                   onChange={(e) => handleFilterChange('minRent', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Max Rent</label>
//                 <input
//                   type="number"
//                   placeholder="₹ 100000"
//                   value={filters.maxRent}
//                   onChange={(e) => handleFilterChange('maxRent', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
//                 <select
//                   value={filters.propertyType}
//                   onChange={(e) => handleFilterChange('propertyType', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">All Types</option>
//                   <option value="apartment">Apartment</option>
//                   <option value="house">House</option>
//                   <option value="studio">Studio</option>
//                   <option value="villa">Villa</option>
//                   <option value="condo">Condo</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Min Bedrooms</label>
//                 <select
//                   value={filters.bedrooms}
//                   onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Any</option>
//                   <option value="1">1+</option>
//                   <option value="2">2+</option>
//                   <option value="3">3+</option>
//                   <option value="4">4+</option>
//                   <option value="5">5+</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Min Bathrooms</label>
//                 <select
//                   value={filters.bathrooms}
//                   onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Any</option>
//                   <option value="1">1+</option>
//                   <option value="2">2+</option>
//                   <option value="3">3+</option>
//                   <option value="4">4+</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Properties Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredAndSortedProperties.map((property) => (
//             <div key={property._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//               {/* Property Image */}
//               <div className="h-48 bg-gray-200 relative">
//                 {property.images && property.images.length > 0 ? (
//                   <img
//                     src={property.images[0]}
//                     alt={property.title}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center">
//                     <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                     </svg>
//                   </div>
//                 )}
//                 <div className="absolute top-2 left-2">
//                   <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
//                     {property.type || property.propertyType || 'Property'}
//                   </span>
//                 </div>
//                 <div className="absolute top-2 right-2">
//                   <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
//                     Available
//                   </span>
//                 </div>
//               </div>

//               {/* Property Details */}
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
//                 <p className="text-gray-600 mb-3 flex items-center">
//                   <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                   </svg>
//                   {property.location}
//                 </p>

//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center space-x-4 text-sm text-gray-600">
//                     {property.bedrooms && (
//                       <div className="flex items-center">
//                         <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
//                         </svg>
//                         {property.bedrooms} Bed
//                       </div>
//                     )}
//                     {property.bathrooms && (
//                       <div className="flex items-center">
//                         <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11" />
//                         </svg>
//                         {property.bathrooms} Bath
//                       </div>
//                     )}
//                   </div>
//                   <div className="text-right">
//                     <p className="text-2xl font-bold text-gray-900">₹{property.rent}</p>
//                     <p className="text-sm text-gray-600">/month</p>
//                   </div>
//                 </div>

//                 {/* Description */}
//                 {property.description && (
//                   <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//                     {property.description}
//                   </p>
//                 )}

//                 {/* Action Buttons */}
//                 <div className="flex gap-2">
//                   <Link
//                     to={`/property/${property._id}`}
//                     className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-center font-medium"
//                   >
//                     View Details
//                   </Link>
//                   <button
//                     onClick={() => handleBookProperty(property._id)}
//                     className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
//                   >
//                     Book Now
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* No Properties Found */}
//         {filteredAndSortedProperties.length === 0 && (
//           <div className="text-center py-12">
//             <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//             </svg>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
//             <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
//             <button
//               onClick={clearFilters}
//               className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//             >
//               Clear Filters
//             </button>
//           </div>
//         )}
//       </div>
//       {selectedProperty && showBookingModel}?{
//         <div>
//           <form onSubmit={handleBookingSubmit}>
//             <input type='text' value={selectedProperty}/>
            
//             <input type='date' placeholder='enter start date'/>
//             <input type='date' placeholder='enter ending date'/>
//           </form>
//         </div>
//       }
//     </div>
//   );
// };

// export default PropertyListing;





import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProperties } from '../redux/slices/propertySlice.js';
import { createBooking } from '../redux/slices/bookingSlice.js';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import { Link, useNavigate } from 'react-router-dom';

const PropertyListing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { properties, loading } = useSelector((state) => state.property);
  // const { user } = useSelector((state) => state.auth); // Get user from auth state
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    minRent: '',
    maxRent: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: ''
  });
  const [sortBy, setSortBy] = useState('rent-asc');
  const [showFilters, setShowFilters] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  // Booking form states
  const [bookingForm, setBookingForm] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    dispatch(fetchAllProperties());
  }, [dispatch]);

  // Filter and sort properties
  const filteredAndSortedProperties = useMemo(() => {
    let filtered = properties.filter(property => {
      // Search term matching
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        property.title?.toLowerCase().includes(searchLower) ||
        property.location?.toLowerCase().includes(searchLower) ||
        property.description?.toLowerCase().includes(searchLower);
      
      // Location filter
      const matchesLocation = !filters.location || 
        property.location?.toLowerCase().includes(filters.location.toLowerCase());
      
      // Rent filters
      const rent = parseFloat(property.rent) || 0;
      const minRent = parseFloat(filters.minRent) || 0;
      const maxRent = parseFloat(filters.maxRent) || Infinity;
      const matchesRent = rent >= minRent && rent <= maxRent;
      
      // Property type filter
      const matchesType = !filters.propertyType || 
        property.type?.toLowerCase() === filters.propertyType.toLowerCase() ||
        property.propertyType?.toLowerCase() === filters.propertyType.toLowerCase();
      
      // Bedroom filter
      const matchesBedrooms = !filters.bedrooms || 
        (property.bedrooms && property.bedrooms >= parseInt(filters.bedrooms));
      
      // Bathroom filter
      const matchesBathrooms = !filters.bathrooms || 
        (property.bathrooms && property.bathrooms >= parseInt(filters.bathrooms));

      return matchesSearch && matchesLocation && matchesRent && 
             matchesType && matchesBedrooms && matchesBathrooms;
    });

    // Sort properties
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rent-asc':
          return (a.rent || 0) - (b.rent || 0);
        case 'rent-desc':
          return (b.rent || 0) - (a.rent || 0);
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'oldest':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'bedrooms-desc':
          return (b.bedrooms || 0) - (a.bedrooms || 0);
        case 'bedrooms-asc':
          return (a.bedrooms || 0) - (b.bedrooms || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [properties, searchTerm, filters, sortBy]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!bookingForm.startDate || !bookingForm.endDate) {
      alert('Please select both start and end dates');
      return;
    }
    
    if (new Date(bookingForm.startDate) >= new Date(bookingForm.endDate)) {
      alert('End date must be after start date');
      return;
    }
    
    // Check if user is logged in
    // if (!user || !user.id) {
    //   alert('You must be logged in to make a booking');
    //   navigate('/');
    //   return;
    // }
    
    try {
      // Create booking object directly (no need for backend model import)
      const bookingData = {
        propertyId: selectedProperty._id,
        // tenantId: user.id,
        startDate: bookingForm.startDate,
        endDate: bookingForm.endDate,
        status: 'pending',
        // totalAmount: calculateTotalAmount(bookingForm.startDate, bookingForm.endDate, selectedProperty.rent)
      };
      
      // Dispatch the booking creation
      const result = await dispatch(createBooking(bookingData));
      
      if (result.type.endsWith('/fulfilled')) {
        // Close modal and reset form
        setShowBookingModal(false);
        setSelectedProperty(null);
        setBookingForm({ startDate: '', endDate: '' });
        
        // Show success message
        alert('Booking request submitted successfully!');
        
        // Navigate to dashboard
        navigate('/tenant/dashboard');
      } else {
        throw new Error('Booking failed');
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('There was an error creating the booking. Please try again.');
    }
  };

  // Helper function to calculate total amount
  const calculateTotalAmount = (startDate, endDate, monthlyRent) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.ceil(diffDays / 30); // Approximate months
    return diffMonths * monthlyRent;
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      minRent: '',
      maxRent: '',
      propertyType: '',
      bedrooms: '',
      bathrooms: ''
    });
    setSearchTerm('');
  };

  const handleBookProperty = (propertyId) => {
    console.log('Booking property:', propertyId);
    try {
      const property = properties.find(p => p._id === propertyId);
      if (property) {
        setSelectedProperty(property);
        setShowBookingModal(true);
        setBookingForm({ startDate: '', endDate: '' });
      } else {
        throw new Error('Property not found');
      }
    } catch (err) {
      console.error('Error selecting property:', err);
      alert('There was an error selecting the property');
    }
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedProperty(null);
    setBookingForm({ startDate: '', endDate: '' });
  };

  const handleBookingFormChange = (field, value) => {
    setBookingForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return <LoadingSpinner message="Loading properties..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Available Properties</h1>
              <p className="mt-2 text-gray-600">
                Showing {filteredAndSortedProperties.length} of {properties.length} properties
              </p>
            </div>
            <Link to="/tenant/dashboard">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by title, location, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="rent-asc">Price: Low to High</option>
                <option value="rent-desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
                <option value="bedrooms-desc">Most Bedrooms</option>
                <option value="bedrooms-asc">Least Bedrooms</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Enter location"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Rent</label>
                <input
                  type="number"
                  placeholder="₹ 0"
                  value={filters.minRent}
                  onChange={(e) => handleFilterChange('minRent', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Rent</label>
                <input
                  type="number"
                  placeholder="₹ 100000"
                  value={filters.maxRent}
                  onChange={(e) => handleFilterChange('maxRent', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="studio">Studio</option>
                  <option value="villa">Villa</option>
                  <option value="condo">Condo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Bedrooms</label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Bathrooms</label>
                <select
                  value={filters.bathrooms}
                  onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProperties.map((property) => (
            <div key={property._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Property Image */}
              <div className="h-48 bg-gray-200 relative">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                    {property.type || property.propertyType || 'Property'}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                    Available
                  </span>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
                <p className="text-gray-600 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {property.location}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    {property.bedrooms && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        </svg>
                        {property.bedrooms} Bed
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11" />
                        </svg>
                        {property.bathrooms} Bath
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">₹{property.rent}</p>
                    <p className="text-sm text-gray-600">/month</p>
                  </div>
                </div>

                {/* Description */}
                {property.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {property.description}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    to={`/property/${property._id}`}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-center font-medium"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleBookProperty(property._id)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Properties Found */}
        {filteredAndSortedProperties.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedProperty && showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Book Property</h2>
              <button
                onClick={closeBookingModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <h3 className="font-medium text-gray-900">{selectedProperty.title}</h3>
              <p className="text-gray-600 text-sm">{selectedProperty.location}</p>
              <p className="text-lg font-semibold text-blue-600">₹{selectedProperty.rent}/month</p>
            </div>

            <form onSubmit={handleBookingSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={bookingForm.startDate}
                    onChange={(e) => handleBookingFormChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={bookingForm.endDate}
                    onChange={(e) => handleBookingFormChange('endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    min={bookingForm.startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Show calculated total */}
                {bookingForm.startDate && bookingForm.endDate && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Total Amount: <span className="font-semibold text-gray-900">
                        ₹{calculateTotalAmount(bookingForm.startDate, bookingForm.endDate, selectedProperty.rent)}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Submit Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyListing;