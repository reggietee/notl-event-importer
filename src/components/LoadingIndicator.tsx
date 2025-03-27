'use client';

import { useState } from 'react';

export default function LoadingIndicator() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-700">Processing...</p>
      </div>
    </div>
  );
}
