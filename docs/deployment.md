# Deployment Guide

This guide provides instructions for deploying the NOTL Event Importer application to various environments.

## Prerequisites

Before deploying, ensure you have:

1. A complete build of the application
2. WordPress credentials (username and application password)
3. Access to your deployment platform of choice

## Environment Variables

The following environment variables must be set in your deployment environment:

```
WP_API_URL=https://notl.events/wp-json/wp/v2
WP_USERNAME=your_wordpress_username
WP_APP_PASSWORD=your_application_password
```

## Deployment Options

### Option 1: Vercel Deployment

Vercel is the recommended deployment platform for Next.js applications.

1. Push your code to a GitHub, GitLab, or Bitbucket repository
2. Sign up for a Vercel account at https://vercel.com
3. Import your repository in the Vercel dashboard
4. Configure environment variables in the Vercel project settings
5. Deploy the application

Vercel will automatically build and deploy your application. Each push to your repository will trigger a new deployment.

### Option 2: Docker Deployment

1. Create a Dockerfile in the root directory:

```dockerfile
FROM node:18-alpine AS base

# Install Python and pip
RUN apk add --no-cache python3 py3-pip

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Install Python dependencies
COPY src/python/requirements.txt .
RUN pip3 install -r requirements.txt

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects anonymous telemetry data about general usage
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/src/python ./src/python

# Make Python scripts executable
RUN chmod +x ./src/python/*.py

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

2. Create a `src/python/requirements.txt` file:

```
requests==2.32.3
beautifulsoup4==4.13.3
```

3. Build and run the Docker container:

```bash
docker build -t event-importer .
docker run -p 3000:3000 --env-file .env.local event-importer
```

### Option 3: Traditional Server Deployment

1. Build the application:

```bash
npm run build
```

2. Transfer the build files to your server using SCP, SFTP, or another file transfer method:

```bash
scp -r .next package.json next.config.js src/python your-server:/path/to/deployment
```

3. On your server, install dependencies:

```bash
cd /path/to/deployment
npm install --production
pip3 install requests beautifulsoup4
```

4. Set up environment variables on your server.

5. Start the application using a process manager like PM2:

```bash
npm install -g pm2
pm2 start npm --name "event-importer" -- start
```

6. Configure a reverse proxy (Nginx or Apache) to serve your application:

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Continuous Deployment

For continuous deployment, consider setting up a CI/CD pipeline using GitHub Actions, GitLab CI, or Jenkins.

Example GitHub Actions workflow (.github/workflows/deploy.yml):

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Monitoring and Maintenance

After deployment, set up monitoring to ensure your application remains healthy:

1. Use Vercel Analytics if deploying to Vercel
2. Set up application monitoring with services like New Relic, Datadog, or Sentry
3. Configure uptime monitoring with services like UptimeRobot or Pingdom
4. Regularly check logs for errors and issues

## Troubleshooting

If you encounter issues during deployment:

1. Verify all environment variables are correctly set
2. Check that Python and required libraries are installed
3. Ensure the application has permission to execute Python scripts
4. Check server logs for detailed error messages
5. Verify network connectivity to the WordPress site
