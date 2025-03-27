# User Guide: NOTL Event Importer

This guide will walk you through using the NOTL Event Importer application to import events from various websites into your WordPress site.

## Getting Started

1. Open your web browser and navigate to the Event Importer application.
2. You'll see a simple interface with a form to enter an event URL.

## Importing an Event

### Step 1: Enter Event URL

1. Find an event on a website (Facebook, Eventbrite, or any Niagara-on-the-Lake event page).
2. Copy the URL of the event page.
3. Paste the URL into the "Event URL" field in the application.
4. Click the "Extract Event Details" button.

### Step 2: Review and Edit Event Details

After the application extracts the event details, you'll see a preview screen with the following information:

- **Event Name**: The title of the event
- **Date**: The event date
- **Time**: The event time
- **Location**: Where the event will take place
- **Host/Organizer**: Who is organizing the event
- **Price Information**: Whether the event is free or paid (with price if applicable)
- **Description**: Details about the event
- **Event Image**: A preview of the event flyer (if available)

Review all the information and make any necessary corrections or additions. All fields marked with an asterisk (*) are required.

### Step 3: Create WordPress Post

Once you're satisfied with the event details:

1. Click the "Create WordPress Post" button.
2. The application will create a new post on your WordPress site with all the event information.
3. If successful, you'll see a success message with a link to view the post on your WordPress site.

## Troubleshooting

### URL Extraction Issues

If the application fails to extract event details:

1. Make sure the URL is correct and accessible.
2. Try using a different browser or clearing your cache.
3. Some websites may block automated access - in this case, you may need to manually enter the event details.

### WordPress Integration Issues

If the application fails to create a WordPress post:

1. Verify that your WordPress credentials are correctly configured.
2. Check that your WordPress site has the REST API enabled.
3. Ensure that the Application Password has sufficient permissions to create posts and upload media.

## Supported Event Websites

The application is designed to work with various event websites, including:

- Facebook Events
- Eventbrite
- Official Niagara-on-the-Lake event pages
- Other event websites (with varying levels of accuracy)

## Best Practices

- Always review the extracted data before creating a WordPress post.
- Add any missing information that wasn't automatically extracted.
- Check that dates and times are correctly formatted.
- Verify that the event image is appropriate and relevant.

## Getting Help

If you encounter any issues or have questions about using the application, please contact the administrator or refer to the technical documentation for more detailed information.
