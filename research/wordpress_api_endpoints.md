# WordPress API Endpoints Research

## Post Endpoints

### List Posts
- **Endpoint**: `GET /wp/v2/posts`
- **Description**: Retrieves a collection of posts
- **Example**: `$ curl https://example.com/wp-json/wp/v2/posts`
- **Key Query Parameters**:
  - `context`: Scope under which the request is made (view, edit, embed)
  - `page`: Current page of the collection
  - `per_page`: Maximum number of items to be returned (default: 10)
  - `search`: Limit results to those matching a string
  - `after`/`before`: Limit to posts published after/before a date
  - `author`/`author_exclude`: Limit to posts by specific authors
  - `status`: Limit to posts with specific status (default: publish)
  - `categories`/`tags`: Limit to posts with specific categories/tags
  - `orderby`: Sort collection by attribute (date, id, include, title, etc.)
  - `order`: Order sort attribute (asc, desc)

### Create a Post
- **Endpoint**: `POST /wp/v2/posts`
- **Description**: Creates a new post
- **Authentication**: Required (Application Passwords recommended)
- **Key Parameters**:
  - `date`: The date the post was published
  - `date_gmt`: The date the post was published, as GMT
  - `slug`: An alphanumeric identifier for the post
  - `status`: A named status for the post (publish, future, draft, pending, private)
  - `password`: A password to protect access to the content
  - `title`: The title for the post
  - `content`: The content for the post
  - `author`: The ID for the author of the post
  - `excerpt`: The excerpt for the post
  - `featured_media`: The ID of the featured media for the post
  - `comment_status`: Whether comments are open (open, closed)
  - `ping_status`: Whether the post can be pinged (open, closed)
  - `format`: The format for the post (standard, aside, chat, gallery, etc.)
  - `meta`: Meta fields
  - `sticky`: Whether the post should be treated as sticky
  - `categories`: The terms assigned to the post in the category taxonomy
  - `tags`: The terms assigned to the post in the post_tag taxonomy

## Media Endpoints

### Upload Media
- **Endpoint**: `POST /wp/v2/media`
- **Description**: Creates a new media item (for event flyers)
- **Authentication**: Required
- **Content-Type**: `multipart/form-data`
- **Key Parameters**:
  - `file`: The raw file data
  - `title`: The title for the media item
  - `caption`: The caption for the media item
  - `alt_text`: Alternative text for the media item

## Categories Endpoints

### List Categories
- **Endpoint**: `GET /wp/v2/categories`
- **Description**: Retrieves a collection of categories
- **Example**: `$ curl https://example.com/wp-json/wp/v2/categories`

### Create Category
- **Endpoint**: `POST /wp/v2/categories`
- **Description**: Creates a new category
- **Authentication**: Required
- **Key Parameters**:
  - `name`: The name for the category
  - `slug`: An alphanumeric identifier for the category
  - `description`: The description for the category
  - `parent`: The parent category ID

## Authentication Requirements

For creating posts and uploading media, authentication is required. The recommended approach is:

1. **Application Passwords** (built into WordPress Core since v5.6)
   - Generated from user profile in WordPress admin (Users -> Edit User)
   - Used with Basic Authentication for REST API requests
   - Secure and specifically designed for API access

2. **Implementation Example**:
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
```
