# WordPress Post Creation API

This module handles the integration with WordPress REST API to create posts from event data.

## Environment Variables

The WordPress API integration requires the following environment variables:

```
WP_API_URL=https://notl.events/wp-json/wp/v2
WP_USERNAME=your_wordpress_username
WP_APP_PASSWORD=your_application_password
```

## Authentication

The API uses WordPress Application Passwords for authentication. This is a secure method introduced in WordPress 5.6 that allows creating specific passwords for API access without sharing the main account password.

To generate an Application Password:
1. Log in to the WordPress admin dashboard
2. Go to Users → Profile
3. Scroll down to the "Application Passwords" section
4. Enter a name for the application (e.g., "Event Importer")
5. Click "Add New Application Password"
6. Copy the generated password (it will only be shown once)

## API Endpoints

### POST /api/wordpress

Creates a new WordPress post from event data.

**Request Body:**
```json
{
  "eventName": "Sample Event",
  "date": "2025-04-15",
  "time": "7:00 PM",
  "location": "Niagara-on-the-Lake Community Centre",
  "description": "Description of the event...",
  "host": "Event Organizer",
  "isFree": false,
  "price": "$25.00",
  "imageUrl": "https://example.com/event-image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "postId": 123,
  "postUrl": "https://notl.events/events/sample-event"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Implementation Details

1. **Authentication**: Uses Basic Authentication with Application Passwords
2. **Image Handling**: If an image URL is provided, the API will:
   - Download the image from the source URL
   - Upload it to the WordPress media library
   - Set it as the featured image for the post
3. **Post Content**: Formats the event details into a structured HTML layout
4. **Meta Fields**: Stores event-specific data in post meta fields for potential future use

## Error Handling

The API implements comprehensive error handling for:
- Missing required fields
- Authentication failures
- Image download/upload issues
- WordPress API errors

All errors are logged and returned with appropriate HTTP status codes and descriptive messages.
