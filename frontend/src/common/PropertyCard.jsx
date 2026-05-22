import React from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedProperty } from '../redux/slices/propertySlice';

const PropertyCard = ({ property, onBook }) => {
  const dispatch = useDispatch();

  const handleBookNow = () => {
    dispatch(setSelectedProperty(property));
    onBook(property);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {property.images?.length > 0 ? (
          <img 
            src={property.images[0]} 
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-500">No Image</span>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
        <p className="text-gray-600 mb-2">{property.location}</p>
        <p className="text-sm text-gray-500 mb-3">{property.description}</p>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-green-600">
            ₹{property.rent}/month
          </span>
          <span className={`px-2 py-1 rounded text-sm ${
            property.status === 'available' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {property.status}
          </span>
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
          <span>{property.bedrooms} Bedrooms</span>
          <span>{property.bathrooms} Bathrooms</span>
          <span>{property.area} sqft</span>
        </div>
        
        {property.status === 'available' && (
          <button
            onClick={handleBookNow}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Book Now
          </button>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
