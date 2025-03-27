'use client';

import { useState } from 'react';
import { EventData, ScrapeResponse } from '@/lib/types';

interface UrlFormProps {
  onSuccess: (data: EventData) => void;
}

export default function UrlForm({ onSuccess }: UrlFormProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setIsLoading(true);
    
    try {
      // Validate URL format
      try {
        new URL(url);
      } catch (err) {
        throw new Error('Please enter a valid URL');
      }
      
      // Call the scrape API
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to scrape event details');
      }
      
      // Call the success callback with the event data
      onSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Import Event from URL</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            Event URL
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/event"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Enter the URL of an event in Niagara-on-the-Lake
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors`}
        >
          {isLoading ? 'Extracting Event Details...' : 'Extract Event Details'}
        </button>
      </form>
    </div>
  );
}
