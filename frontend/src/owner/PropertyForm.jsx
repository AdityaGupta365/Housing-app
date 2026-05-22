






import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProperty, updateProperty } from '../redux/slices/propertySlice';

const PropertyForm = ({ property, onClose, onSuccess }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: property?.title || '',
    description: property?.description || '',
    location: property?.location || '',
    rent: property?.rent || '',
    bedrooms: property?.bedrooms || '',
    amenities: property?.amenities?.join(', ') || '',
  });

  const [images, setImages] = useState([]); // For new uploads

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'amenities') {
        value.split(',').forEach((a) => data.append('amenities[]', a.trim()));
      } else {
        data.append(key, value);
      }
    });

    images.forEach((file) => {
      data.append('imageUrl', file); // backend must handle `images` as `req.files`
    });

    try {
      if (property?._id) {
        await dispatch(updateProperty({ id: property._id, propertyData: data })).unwrap();
      } else {
        await dispatch(createProperty(data)).unwrap();
        
      }
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {property?._id ? 'Edit Property' : 'Add New Property'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full border rounded-lg px-3 py-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Rent</label>
                <input type="number" name="rent" value={formData.rent} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Bedrooms</label>
                <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Amenities (comma-separated)</label>
                <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} placeholder="Parking, Gym, Pool" className="w-full border rounded-lg px-3 py-2" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Upload Images</label>
              <input type="file" name="imageUrl" multiple accept="image/*" onChange={handleImageChange} className="w-full border rounded-lg px-3 py-2" />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {property?._id ? 'Update' : 'Create'} Property
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;

