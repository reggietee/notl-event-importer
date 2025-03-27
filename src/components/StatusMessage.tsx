'use client';

import { useState } from 'react';
import { EventData, WordPressPostResponse } from '@/lib/types';

interface StatusMessageProps {
  success: boolean;
  postUrl?: string;
  error?: string;
  onReset: () => void;
}

export default function StatusMessage({ success, postUrl, error, onReset }: StatusMessageProps) {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {success ? (
        <div className="text-center">
          <div className="mb-4 mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Success!</h2>
          <p className="text-gray-600 mb-4">
            The event has been successfully imported to WordPress.
          </p>
          {postUrl && (
            <a 
              href={postUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mb-4 text-blue-600 hover:text-blue-800 hover:underline"
            >
              View Post on WordPress →
            </a>
          )}
          <button
            onClick={onReset}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Import Another Event
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-4 mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Error</h2>
          <p className="text-red-600 mb-4">
            {error || 'An unexpected error occurred while importing the event.'}
          </p>
          <button
            onClick={onReset}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
