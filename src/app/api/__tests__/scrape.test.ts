import { NextRequest, NextResponse } from 'next/server';
import { jest } from '@jest/globals';

// Mock child_process and util
jest.mock('child_process', () => ({
  exec: jest.fn()
}));

jest.mock('util', () => ({
  promisify: jest.fn().mockImplementation((fn) => {
    return jest.fn().mockResolvedValue({
      stdout: JSON.stringify({
        eventName: 'Test Event',
        date: '2025-04-15',
        time: '7:00 PM',
        location: 'Test Location',
        description: 'Test Description',
        host: 'Test Host',
        isFree: true,
        price: null,
        imageUrl: null
      }),
      stderr: ''
    });
  })
}));

import { POST } from '@/app/api/scrape/route';

describe('Scrape API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('returns 400 if URL is missing', async () => {
    const request = {
      json: jest.fn().mockResolvedValue({})
    } as unknown as NextRequest;
    
    const response = await POST(request);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.error).toBe('URL is required');
  });
  
  it('returns 400 if URL is invalid', async () => {
    const request = {
      json: jest.fn().mockResolvedValue({ url: 'not-a-url' })
    } as unknown as NextRequest;
    
    const response = await POST(request);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.error).toBe('Invalid URL format');
  });
  
  it('calls Python script with URL and returns scraped data', async () => {
    const request = {
      json: jest.fn().mockResolvedValue({ url: 'https://example.com/event' })
    } as unknown as NextRequest;
    
    const response = await POST(request);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toEqual({
      eventName: 'Test Event',
      date: '2025-04-15',
      time: '7:00 PM',
      location: 'Test Location',
      description: 'Test Description',
      host: 'Test Host',
      isFree: true,
      price: null,
      imageUrl: null
    });
  });
});
