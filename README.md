# NOTL Event Importer

A web application that allows you to take a link to an event in Niagara-on-the-Lake and import it as a post into the WordPress site (notl.events).

## Features

- Extract event details from various websites including Facebook, Eventbrite, and official Niagara-on-the-Lake event pages
- Preview and edit extracted event data before submission
- Upload event flyer images to WordPress media library
- Create formatted WordPress posts with all event details
- Simple and intuitive user interface

## Technologies Used

- **Frontend**: Next.js with React and TypeScript
- **Styling**: Tailwind CSS
- **Web Scraping**: Python with BeautifulSoup and Requests
- **API Integration**: WordPress REST API with Application Passwords authentication
- **Testing**: Jest and React Testing Library

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- Python 3.8 or higher
- WordPress site with REST API enabled

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/event-importer.git
cd event-importer
```

2. Install JavaScript dependencies:
```bash
npm install
```

3. Install Python dependencies:
```bash
pip install requests beautifulsoup4
```

4. Create a `.env.local` file with your WordPress credentials:
```
WP_API_URL=https://notl.events/wp-json/wp/v2
WP_USERNAME=your_wordpress_username
WP_APP_PASSWORD=your_application_password
```

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Usage

1. Enter the URL of an event in Niagara-on-the-Lake in the input field
2. Click "Extract Event Details" to scrape the event information
3. Review and edit the extracted data in the preview screen
4. Click "Create WordPress Post" to import the event to WordPress
5. View the success message with a link to the created post

## WordPress Setup

### Generating an Application Password

1. Log in to your WordPress admin dashboard
2. Go to Users → Profile
3. Scroll down to the "Application Passwords" section
4. Enter a name for the application (e.g., "Event Importer")
5. Click "Add New Application Password"
6. Copy the generated password (it will only be shown once)
7. Use this password in your `.env.local` file

## Deployment

### Deploying to Vercel

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy the application

### Deploying to a Custom Server

1. Build the application:
```bash
npm run build
```

2. Transfer the build files to your server
3. Install dependencies on the server
4. Configure environment variables
5. Start the application using a process manager like PM2:
```bash
pm2 start npm --name "event-importer" -- start
```

## Testing

Run the test suite:
```bash
npm test
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
