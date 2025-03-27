'use client';

import { useState } from 'react';
import { EventData } from '@/lib/types';

interface EventPreviewProps {
  eventData: EventData;
  onSubmit: (data: EventData) => void;
  onBack: () => void;
}

export default function EventPreview({ eventData, onSubmit, onBack }: EventPreviewProps) {
  const [editedData, setEditedData] = useState<EventData>(eventData);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'isFree') {
      // Handle checkbox for isFree
      const checkbox = e.target as HTMLInputElement;
      setEditedData({
        ...editedData,
        isFree: checkbox.checked,
        price: checkbox.checked ? null : editedData.price
      });
    } else {
      setEditedData({
        ...editedData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Call the onSubmit callback with the edited data
    onSubmit(editedData);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Preview Event Details</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="col-span-2">
            <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
              Event Name*
            </label>
            <input
              type="text"
              id="eventName"
              name="eventName"
              value={editedData.eventName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date*
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={editedData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              Time*
            </label>
            <input
              type="text"
              id="time"
              name="time"
              value={editedData.time}
              onChange={handleChange}
              placeholder="7:00 PM"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="col-span-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location*
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={editedData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="col-span-2">
            <label htmlFor="host" className="block text-sm font-medium text-gray-700 mb-1">
              Host/Organizer
            </label>
            <input
              type="text"
              id="host"
              name="host"
              value={editedData.host}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="col-span-2">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="isFree"
                name="isFree"
                checked={editedData.isFree}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isFree" className="ml-2 block text-sm font-medium text-gray-700">
                This is a free event
              </label>
            </div>
            
            {!editedData.isFree && (
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={editedData.price || ''}
                  onChange={handleChange}
                  placeholder="$25.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
          
          <div className="col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={editedData.description}
              onChange={handleChange}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="col-span-2">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Event Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={editedData.imageUrl || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            {editedData.imageUrl && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
                <img 
                  src={editedData.imageUrl} 
                  alt="Event preview" 
                  className="max-h-40 object-contain border border-gray-200 rounded"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Back
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`py-2 px-4 rounded-md text-white font-medium ${
              isLoading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
            } transition-colors`}
          >
            {isLoading ? 'Creating Post...' : 'Create WordPress Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
