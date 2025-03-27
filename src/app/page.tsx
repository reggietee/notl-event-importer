'use client';

import { useState } from 'react';
import UrlForm from '@/components/UrlForm';
import EventPreview from '@/components/EventPreview';
import StatusMessage from '@/components/StatusMessage';
import { EventData, WordPressPostResponse } from '@/lib/types';
import LoadingIndicator from '@/components/LoadingIndicator';

export default function Home() {
  const [step, setStep] = useState<'url' | 'preview' | 'result'>('url');
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [result, setResult] = useState<WordPressPostResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScrapeSuccess = (data: EventData) => {
    setEventData(data);
    setStep('preview');
  };

  const handleSubmitToWordPress = async (data: EventData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/wordpress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      setResult(result);
      setStep('result');
    } catch (error) {
      setResult({
        success: false,
        error: error.message || 'Failed to create WordPress post',
      });
      setStep('result');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setEventData(null);
    setResult(null);
    setStep('url');
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          NOTL Event Importer
        </h1>
        
        {step === 'url' && (
          <UrlForm onSuccess={handleScrapeSuccess} />
        )}
        
        {step === 'preview' && eventData && (
          <EventPreview 
            eventData={eventData} 
            onSubmit={handleSubmitToWordPress} 
            onBack={handleReset} 
          />
        )}
        
        {step === 'result' && result && (
          <StatusMessage 
            success={result.success} 
            postUrl={result.postUrl} 
            error={result.error} 
            onReset={handleReset} 
          />
        )}
      </div>
    </main>
  );
}
