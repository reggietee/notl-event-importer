# Web Application Architecture

## Overview

The Event Importer application will be a Next.js web application that allows users to input a URL to an event in Niagara-on-the-Lake, extract the event details, and import them as a post into the WordPress site (notl.events). The application will use a combination of client-side and server-side components to handle the different aspects of the workflow.

## Component Structure

### 1. Frontend Components

#### 1.1 URL Input Form
- **Purpose**: Allow users to submit event URLs
- **Technology**: React components with React Hook Form for validation
- **Features**:
  - URL validation
  - Submit button
  - Loading state indicator

#### 1.2 Event Preview Component
- **Purpose**: Display extracted event data for review before submission
- **Technology**: React components
- **Features**:
  - Display all extracted event fields
  - Allow editing of extracted data
  - Confirmation button for WordPress submission

#### 1.3 Result/Status Component
- **Purpose**: Show success/failure messages and links to created posts
- **Technology**: React components with toast notifications
- **Features**:
  - Success/error messages
  - Link to created WordPress post
  - Option to start a new import

### 2. Backend Components

#### 2.1 Web Scraping API
- **Purpose**: Extract event details from provided URL
- **Technology**: Next.js API routes with Python integration
- **Features**:
  - Accept URL as input
  - Use BeautifulSoup/Requests to scrape event details
  - Return structured event data
  - Handle different website structures

#### 2.2 WordPress Integration API
- **Purpose**: Create posts in WordPress from extracted event data
- **Technology**: Next.js API routes
- **Features**:
  - Authenticate with WordPress API
  - Upload event flyer image if available
  - Create post with all event details
  - Return post ID and URL

#### 2.3 Authentication Handler
- **Purpose**: Securely manage WordPress credentials
- **Technology**: Environment variables and secure storage
- **Features**:
  - Store WordPress credentials securely
  - Provide authentication headers for API requests

## Data Flow

1. **URL Submission**:
   - User enters event URL in the input form
   - Client validates URL format
   - URL is sent to the Web Scraping API

2. **Event Data Extraction**:
   - Web Scraping API fetches the webpage content
   - Extracts event details (name, date, location, etc.)
   - Returns structured data to the client

3. **Data Preview and Editing**:
   - Client displays extracted data in the preview component
   - User can review and edit any incorrect information
   - User confirms submission to WordPress

4. **WordPress Post Creation**:
   - Client sends finalized event data to WordPress Integration API
   - If event has an image, it's uploaded first to get media ID
   - Post is created with all event details
   - API returns success/failure status and post URL

5. **Result Display**:
   - Client shows success message with link to created post
   - Or displays error message with details if something went wrong
   - User can start a new import

## Technical Architecture

### Next.js App Structure

```
event-importer/
├── public/
│   └── images/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Main page with URL input form
│   │   ├── preview/
│   │   │   └── page.tsx             # Preview page for event data
│   │   └── layout.tsx               # Main layout component
│   ├── components/
│   │   ├── UrlForm.tsx              # URL input form component
│   │   ├── EventPreview.tsx         # Event preview component
│   │   ├── StatusMessage.tsx        # Success/error message component
│   │   └── LoadingIndicator.tsx     # Loading state component
│   ├── lib/
│   │   ├── types.ts                 # TypeScript interfaces
│   │   ├── wordpress.ts             # WordPress API utilities
│   │   └── validation.ts            # Form validation utilities
│   ├── api/
│   │   ├── scrape/
│   │   │   └── route.ts             # API route for web scraping
│   │   └── wordpress/
│   │       └── route.ts             # API route for WordPress integration
│   └── python/
│       └── scraper.py               # Python script for web scraping
└── package.json
```

### API Routes

#### 1. `/api/scrape`
- **Method**: POST
- **Input**: `{ url: string }`
- **Output**: 
  ```json
  {
    "eventName": "string",
    "date": "string",
    "time": "string",
    "location": "string",
    "description": "string",
    "host": "string",
    "isFree": "boolean",
    "price": "string | null",
    "imageUrl": "string | null"
  }
  ```

#### 2. `/api/wordpress`
- **Method**: POST
- **Input**: Event data object
- **Output**: 
  ```json
  {
    "success": "boolean",
    "postId": "number | null",
    "postUrl": "string | null",
    "error": "string | null"
  }
  ```

## Security Considerations

1. **WordPress Credentials**:
   - Store credentials in environment variables
   - Never expose credentials in client-side code
   - Use Application Passwords for limited access

2. **URL Validation**:
   - Validate URLs before processing
   - Implement rate limiting to prevent abuse
   - Consider whitelisting allowed domains

3. **Error Handling**:
   - Implement proper error handling and logging
   - Don't expose sensitive information in error messages
   - Gracefully handle failures at each step

## Scalability Considerations

1. **Caching**:
   - Cache extracted event data to reduce scraping requests
   - Consider caching WordPress API responses

2. **Rate Limiting**:
   - Implement rate limiting for both scraping and WordPress APIs
   - Respect robots.txt and website terms of service

3. **Async Processing**:
   - Consider using background jobs for long-running tasks
   - Implement webhooks for notification of completed tasks
