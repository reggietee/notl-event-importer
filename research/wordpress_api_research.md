# WordPress REST API Research

## Authentication Methods

### Application Passwords
- Built into WordPress Core since version 5.6
- Allows secure API access without sharing main account password
- Generated from user profile in WordPress admin (Users -> Edit User)
- Used with Basic Authentication for REST API requests
- Ideal for programmatic access to WordPress sites

### Implementation Example
```python
import requests
from base64 import b64encode

# Authentication credentials
username = 'your_username'
app_password = 'xxxx xxxx xxxx xxxx xxxx xxxx' # Space-separated format from WP

# Create authentication header
auth_string = f'{username}:{app_password}'
auth_header = {'Authorization': f'Basic {b64encode(auth_string.encode()).decode()}'}

# Example POST request to create a post
response = requests.post(
    'https://example.com/wp-json/wp/v2/posts',
    headers=auth_header,
    json={
        'title': 'Event Title',
        'content': 'Event description goes here',
        'status': 'publish'
    }
)

# Check response
if response.status_code == 201:  # 201 Created
    print("Post created successfully!")
    print(response.json())
else:
    print(f"Error: {response.status_code}")
    print(response.json())
```

## WordPress Post Creation Parameters

| Parameter | Description |
|-----------|-------------|
| `title` | The post title |
| `content` | The post content/description |
| `status` | Post status (draft, publish, pending) |
| `date` | Publication date (format: YYYY-MM-DD HH:MM:SS) |
| `categories` | Array of category IDs |
| `tags` | Array of tag IDs |
| `featured_media` | ID of featured image (requires separate upload) |
| `meta` | Custom fields as associative array |

## Media Upload Process
1. First upload the media file to WordPress
2. Get the media ID from the response
3. Use the media ID in the featured_media field when creating the post

## Considerations for Event Import
- Will need to create appropriate categories for events
- May need to set up custom fields for event-specific data (date, time, location, etc.)
- Need to handle image uploads for event flyers
- Should implement error handling for API responses
