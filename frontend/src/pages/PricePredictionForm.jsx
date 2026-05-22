import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { predictRentPrice, getMarketAnalysis, clearPrediction } from '../../redux/slices/predictionSlice';
import { predictRentPrice } from '../redux/slices/predictionSlice';
import { getMarketAnalysis } from '../redux/slices/predictionSlice';
import { clearPrediction } from '../redux/slices/predictionSlice';
import PredictionResults from './PredictionResults';
// import MarketAnalysis from './MarketAnalysis';

const PricePredictionForm = () => {
  const dispatch = useDispatch();
  const { prediction, marketAnalysis, loading, error } = useSelector(state => state.prediction);
  
  const [formData, setFormData] = useState({
    area_sqft: '',
    bedrooms: '',
    bathrooms: '',
    location: '',
    property_type: '',
    age_years: '',
    parking_spots: '',
    furnished: false,
    amenities_count: '',
    distance_to_center_km: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert string inputs to numbers
    const processedData = {
      ...formData,
      area_sqft: parseFloat(formData.area_sqft),
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      age_years: parseInt(formData.age_years),
      parking_spots: parseInt(formData.parking_spots),
      amenities_count: parseInt(formData.amenities_count),
      distance_to_center_km: parseFloat(formData.distance_to_center_km)
    };

    await dispatch(predictRentPrice(processedData));
    
    // Also get market analysis
    dispatch(getMarketAnalysis({
      location: formData.location,
      property_type: formData.property_type
    }));
  };

  const handleReset = () => {
    setFormData({
      area_sqft: '', bedrooms: '', bathrooms: '', location: '',
      property_type: '', age_years: '', parking_spots: '',
      furnished: false, amenities_count: '', distance_to_center_km: ''
    });
    dispatch(clearPrediction());
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🏡 AI-Powered Rent Price Prediction
        </h2>
        <p className="text-gray-600">
          Get accurate rent predictions using machine learning based on property features and market data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Property Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Basic Property Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area (sq ft) *
                  </label>
                  <input
                    type="number"
                    name="area_sqft"
                    value={formData.area_sqft}
                    onChange={handleInputChange}
                    required
                    min="300"
                    max="5000"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 1200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age (years) *
                  </label>
                  <input
                    type="number"
                    name="age_years"
                    value={formData.age_years}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max="50"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms *
                  </label>
                  <select
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5">5+ BHK</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bathrooms *
                  </label>
                  <select
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location & Type */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Location & Type</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Location</option>
                    <option value="Downtown">Downtown</option>
                    <option value="City Center">City Center</option>
                    <option value="Suburb">Suburb</option>
                    <option value="Outskirts">Outskirts</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type *
                  </label>
                  <select
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Type</option>
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Condo">Condo</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distance to City Center (km) *
                </label>
                <input
                  type="number"
                  name="distance_to_center_km"
                  value={formData.distance_to_center_km}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="50"
                  step="0.1"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 2.5"
                />
              </div>
            </div>

            {/* Additional Features */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">Additional Features</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parking Spots *
                  </label>
                  <select
                    name="parking_spots"
                    value={formData.parking_spots}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select</option>
                    <option value="0">No Parking</option>
                    <option value="1">1 Spot</option>
                    <option value="2">2 Spots</option>
                    <option value="3">3+ Spots</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amenities Count *
                  </label>
                  <input
                    type="number"
                    name="amenities_count"
                    value={formData.amenities_count}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max="15"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., 5"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  name="furnished"
                  checked={formData.furnished}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Fully Furnished
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-md hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 font-medium transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Predicting...
                  </div>
                ) : (
                  '🎯 Predict Rent Price'
                )}
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
              >
                Reset
              </button>
            </div>
          </form>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {prediction && <PredictionResults prediction={prediction} />}
          {/* {marketAnalysis && <MarketAnalysis analysis={marketAnalysis} />} */}
        </div>
      </div>
    </div>
  );
};

export default PricePredictionForm;