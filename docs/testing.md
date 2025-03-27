# Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```
WP_API_URL=https://notl.events/wp-json/wp/v2
WP_USERNAME=your_wordpress_username
WP_APP_PASSWORD=your_application_password
```

# Testing Instructions

To test the application:

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open your browser to http://localhost:3000

4. Enter a URL to an event in Niagara-on-the-Lake

5. Review the extracted event details and make any necessary corrections

6. Submit to create a WordPress post

# Test Cases

## Event URL Parsing
- Test with Facebook event URLs
- Test with Eventbrite event URLs
- Test with official Niagara-on-the-Lake event URLs
- Test with other event websites

## Data Extraction
- Verify event name extraction
- Verify date and time extraction
- Verify location extraction
- Verify description extraction
- Verify host/organizer extraction
- Verify price information extraction
- Verify image extraction

## WordPress Integration
- Verify authentication with WordPress
- Verify post creation with all event details
- Verify image upload and featured image setting
- Verify error handling for invalid credentials
- Verify error handling for network issues

## User Interface
- Verify form validation
- Verify loading states
- Verify error messages
- Verify preview and editing functionality
- Verify success message and post link
