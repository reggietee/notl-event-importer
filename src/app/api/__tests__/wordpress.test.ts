import { NextRequest, NextResponse } from 'next/server';
import { jest } from '@jest/globals';

// Mock fetch
global.fetch = jest.fn();

// Mock environment variables
process.env.WP_API_URL = 'https://notl.events/wp-json/wp/v2';
process.env.WP_USERNAME = 'test_user';
process.env.WP_APP_PASSWORD = 'test_password';

import { POST } from '@/app/api/wordpress/route';
import { EventData } from '@/lib/types';

describe('WordPress API Route', () => {
  const mockEventData: EventData = {
    eventName: 'Test Event',
    date: '2025-04-15',
    time: '7:00 PM',
    location: 'Test Location',
    description: 'Test Description',
    host: 'Test Host',
    isFree: true,
    price: null,
    imageUrl: null
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('returns 400 if required fields are missing', async () => {
    const request = {
      json: jest.fn().mockResolvedValue({
        // Missing required fields
        date: '2025-04-15',
        location: 'Test Location'
      })
    } as unknown as NextRequest;
    
    const response = await POST(request);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe('Missing required event details');
  });
  
  it('creates a WordPress post with event data', async () => {
    // Mock successful WordPress API response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 123,
        link: 'https://notl.events/events/test-event'
      })
    });
    
    const request = {
      json: jest.fn().mockResolvedValue(mockEventData)
    } as unknown as NextRequest;
    
    const response = await POST(request);
    const data = await response.json();
    
    // Verify response
    expect(data.success).toBe(true);
    expect(data.postId).toBe(123);
    expect(data.postUrl).toBe('https://notl.events/events/test-event');
    
    // Verify API call
    expect(fetch).toHaveBeenCalledWith(
      'https://notl.events/wp-json/wp/v2/posts',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': expect.any(String)
        }),
        body: expect.any(String)
      })
    );
    
    // Verify post data
    const postData = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
    expect(postData.title).toBe('Test Event');
    expect(postData.status).toBe('publish');
    expect(postData.meta.event_date).toBe('2025-04-15');
    expect(postData.meta.event_time).toBe('7:00 PM');
    expect(postData.meta.event_location).toBe('Test Location');
  });
  
  it('handles WordPress API errors', async () => {
    // Mock failed WordPress API response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Unauthorized',
      json: async () => ({
        message: 'Invalid authentication credentials'
      })
    });
    
    const request = {
      json: jest.fn().mockResolvedValue(mockEventData)
    } as unknown as NextRequest;
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(data.success).toBe(false);
    expect(data.error).toContain('WordPress API error');
  });
  
  it('uploads image when imageUrl is provided', async () => {
    // Mock image fetch response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      arrayBuffer: async () => new ArrayBuffer(8)
    });
    
    // Mock media upload response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 456
      })
    });
    
    // Mock post creation response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 123,
        link: 'https://notl.events/events/test-event'
      })
    });
    
    const request = {
      json: jest.fn().mockResolvedValue({
        ...mockEventData,
        imageUrl: 'https://example.com/image.jpg'
      })
    } as unknown as NextRequest;
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(data.success).toBe(true);
    
    // Verify media upload call
    expect(fetch).toHaveBeenCalledWith(
      'https://notl.events/wp-json/wp/v2/media',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Disposition': expect.stringContaining('image.jpg'),
          'Authorization': expect.any(String)
        })
      })
    );
    
    // Verify post data includes featured media
    const postData = JSON.parse((fetch as jest.Mock).mock.calls[2][1].body);
    expect(postData.featured_media).toBe(456);
  });
});
