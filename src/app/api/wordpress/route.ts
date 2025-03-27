import { NextRequest, NextResponse } from 'next/server';
import { EventData } from '@/lib/types';

// WordPress API configuration
const WP_API_URL = process.env.WP_API_URL || 'https://notl.events/wp-json/wp/v2';
const WP_USERNAME = process.env.WP_USERNAME;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const eventData: EventData = await request.json();
    
    // Validate required fields
    if (!eventData.eventName || !eventData.date || !eventData.location || !eventData.description) {
      return NextResponse.json(
        { success: false, error: 'Missing required event details' },
        { status: 400 }
      );
    }
    
    // Check if WordPress credentials are configured
    if (!WP_USERNAME || !WP_APP_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'WordPress credentials not configured' },
        { status: 500 }
      );
    }
    
    // Create authentication header
    const authHeader = 'Basic ' + Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString('base64');
    
    // Upload image first if available
    let featuredMediaId = null;
    if (eventData.imageUrl) {
      try {
        featuredMediaId = await uploadEventImage(eventData.imageUrl, authHeader);
      } catch (error) {
        console.error('Failed to upload image:', error);
        // Continue without image if upload fails
      }
    }
    
    // Format date and time for the post
    const formattedDate = formatEventDateTime(eventData.date, eventData.time);
    
    // Prepare post content
    const postContent = formatPostContent(eventData);
    
    // Create post data
    const postData = {
      title: eventData.eventName,
      content: postContent,
      status: 'publish',
      meta: {
        event_date: eventData.date,
        event_time: eventData.time,
        event_location: eventData.location,
        event_host: eventData.host || '',
        event_price: eventData.isFree ? 'Free' : (eventData.price || '')
      }
    };
    
    // Add featured media if available
    if (featuredMediaId) {
      postData.featured_media = featuredMediaId;
    }
    
    // Create the post
    const response = await fetch(`${WP_API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(postData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`WordPress API error: ${errorData.message || response.statusText}`);
    }
    
    const postResult = await response.json();
    
    return NextResponse.json({
      success: true,
      postId: postResult.id,
      postUrl: postResult.link
    });
    
  } catch (error) {
    console.error('Error creating WordPress post:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create WordPress post' },
      { status: 500 }
    );
  }
}

/**
 * Upload an image to WordPress media library
 */
async function uploadEventImage(imageUrl: string, authHeader: string): Promise<number> {
  try {
    // Fetch the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }
    
    const imageBuffer = await imageResponse.arrayBuffer();
    
    // Get file name from URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1] || 'event-image.jpg';
    
    // Upload to WordPress
    const uploadResponse = await fetch(`${WP_API_URL}/media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg', // Assuming JPEG, could be determined from file extension
        'Content-Disposition': `attachment; filename=${fileName}`,
        'Authorization': authHeader
      },
      body: Buffer.from(imageBuffer)
    });
    
    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      throw new Error(`Media upload error: ${errorData.message || uploadResponse.statusText}`);
    }
    
    const mediaData = await uploadResponse.json();
    return mediaData.id;
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
}

/**
 * Format event date and time for WordPress
 */
function formatEventDateTime(date: string, time: string): string {
  try {
    // Combine date and time
    return `${date} ${time}`;
  } catch (error) {
    console.error('Date formatting error:', error);
    return `${date} ${time}`;
  }
}

/**
 * Format post content with event details
 */
function formatPostContent(eventData: EventData): string {
  const priceInfo = eventData.isFree ? 'Free' : (eventData.price || 'Contact organizer for pricing');
  
  return `
    <div class="event-details">
      <p>${eventData.description}</p>
      
      <h3>Event Details</h3>
      <ul>
        <li><strong>Date:</strong> ${eventData.date}</li>
        <li><strong>Time:</strong> ${eventData.time}</li>
        <li><strong>Location:</strong> ${eventData.location}</li>
        ${eventData.host ? `<li><strong>Host:</strong> ${eventData.host}</li>` : ''}
        <li><strong>Price:</strong> ${priceInfo}</li>
      </ul>
      
      <p class="event-source">This event was imported from an external source.</p>
    </div>
  `;
}
