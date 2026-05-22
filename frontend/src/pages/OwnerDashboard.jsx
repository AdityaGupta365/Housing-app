import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOwnerProperties, deleteProperty } from '../redux/slices/propertySlice';
import { fetchOwnerBookings, approveBooking, rejectBooking } from '../redux/slices/bookingSlice';
import PropertyForm from '../owner/PropertyForm.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

const OwnerDashboard = () => {
  const dispatch = useDispatch();
  
  // Safe destructuring with default values
  const { 
    ownerProperties = [], 
    loading: propertyLoading = false 
  } = useSelector((state) => state.property || {});
  
  const { 
    ownerBookings = [], 
    loading: bookingLoading = false 
  } = useSelector((state) => state.booking || {});
  
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [activeTab, setActiveTab] = useState('properties');

  useEffect(() => {
    dispatch(fetchOwnerProperties());
    dispatch(fetchOwnerBookings());
    
  }, [dispatch]);

  const handleEditProperty = (property) => {
    setSelectedProperty(property);
    setShowPropertyForm(true);
  };

  const handleDeleteProperty = (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      dispatch(deleteProperty(id));
    }
  };

  const handleBookingAction = (bookingId, action) => {
    if (action === 'approve') {
      dispatch(approveBooking(bookingId));
    } else {
      dispatch(rejectBooking(bookingId));
    }
  };

  const stats = {
    totalProperties: ownerProperties.length,
    availableProperties: ownerProperties.filter(p => p.status === 'available').length,
    rentedProperties: ownerProperties.filter(p => p.status === 'rented').length,
    pendingBookings: ownerBookings.filter(b => b.status === 'pending').length,
  };

  if (propertyLoading || bookingLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your properties and rental bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalProperties}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.availableProperties}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rented</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.rentedProperties}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingBookings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('properties')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'properties'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                My Properties
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Booking Requests
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'properties' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">My Properties</h3>
                  <button
                    onClick={() => {
                      setSelectedProperty(null);
                      setShowPropertyForm(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Add Property
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ownerProperties.map((property) => (
                    <div key={property._id} className="bg-gray-50 rounded-lg p-4">
                      <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                        {property.images?.length > 0 ? (
                          <img 
                            src={property.images[0]} 
                            alt={property.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-gray-500">No Image</span>
                        )}
                      </div>
                      
                      <h4 className="text-lg font-semibold mb-2">{property.title}</h4>
                      <p className="text-gray-600 mb-2">{property.location}</p>
                      <p className="text-xl font-bold text-green-600 mb-4">₹{property.rent}/month</p>
                      
                      <div className="flex justify-between items-center mb-4">
                        <span className={`px-2 py-1 rounded text-sm ${
                          property.status === 'available' 
                            ? 'bg-green-100 text-green-800' 
                            : property.status === 'rented'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {property.status}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditProperty(property)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProperty(property._id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {ownerProperties.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No properties found. Add your first property to get started!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Booking Requests</h3>
                <div className="space-y-4">
                  {ownerBookings.map((booking) => (
                    <div key={booking._id} className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold">{booking.property?.title}</h4>
                          <p className="text-gray-600 mb-2">Requested by: {booking.tenant?.name}</p>
                          <p className="text-gray-600 mb-2">Email: {booking.tenant?.email}</p>
                          <p className="text-gray-600 mb-2">
                            Duration: {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                          </p>
                          {booking.message && (
                            <p className="text-gray-600 mb-2">Message: {booking.message}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                            booking.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {booking.status}
                          </span>
                          {booking.status === 'pending' && (
                            <div className="space-x-2">
                              <button
                                onClick={() => handleBookingAction(booking._id, 'approve')}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleBookingAction(booking._id, 'reject')}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {ownerBookings.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No booking requests found.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Property Form Modal */}
      {showPropertyForm && (
        <PropertyForm
          property={selectedProperty}
          onClose={() => {
            setShowPropertyForm(false);
            setSelectedProperty(null);
          }}
          onSuccess={() => {
            dispatch(fetchOwnerProperties());
          }}
        />
      )}
    </div>
  );
};

export default OwnerDashboard;