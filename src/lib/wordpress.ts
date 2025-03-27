import { EventData } from '@/lib/types';

/**
 * Utility functions for WordPress API integration
 */

/**
 * Validates WordPress credentials
 */
export async function validateCredentials(
  apiUrl: string,
  username: string,
  password: string
): Promise<boolean> {
  try {
    const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
    
    // Try to fetch users/me endpoint which requires authentication
    const response = await fetch(`${apiUrl}/users/me`, {
      headers: {
        'Authorization': authHeader
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Credential validation error:', error);
    return false;
  }
}

/**
 * Formats event data for WordPress post
 */
export function formatEventData(eventData: EventData) {
  const priceInfo = eventData.isFree ? 'Free' : (eventData.price || 'Contact organizer for pricing');
  
  // Format date for display if needed
  let displayDate = eventData.date;
  try {
    const dateObj = new Date(eventData.date);
    displayDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    // Use original date if formatting fails
  }
  
  return {
    title: eventData.eventName,
    content: `
      <div class="event-details">
        <p>${eventData.description}</p>
        
        <h3>Event Details</h3>
        <ul>
          <li><strong>Date:</strong> ${displayDate}</li>
          <li><strong>Time:</strong> ${eventData.time}</li>
          <li><strong>Location:</strong> ${eventData.location}</li>
          ${eventData.host ? `<li><strong>Host:</strong> ${eventData.host}</li>` : ''}
          <li><strong>Price:</strong> ${priceInfo}</li>
        </ul>
        
        <p class="event-source">This event was imported from an external source.</p>
      </div>
    `,
    meta: {
      event_date: eventData.date,
      event_time: eventData.time,
      event_location: eventData.location,
      event_host: eventData.host || '',
      event_price: priceInfo
    }
  };
}

/**
 * Extracts file extension from URL
 */
export function getFileExtensionFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const lastDotIndex = pathname.lastIndexOf('.');
    
    if (lastDotIndex !== -1) {
      return pathname.substring(lastDotIndex + 1).toLowerCase();
    }
  } catch (e) {
    // URL parsing failed
  }
  
  // Default to jpg if extension can't be determined
  return 'jpg';
}

/**
 * Gets content type based on file extension
 */
export function getContentTypeFromExtension(extension: string): string {
  const contentTypes = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp'
  };
  
  return contentTypes[extension] || 'image/jpeg';
}
