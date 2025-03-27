import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execPromise = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { url } = body;

    // Validate URL
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Path to the Python script
    const scriptPath = path.join(process.cwd(), 'src', 'python', 'scraper.py');

    // Execute the Python script with the URL
    const { stdout, stderr } = await execPromise(`python3 ${scriptPath} "${url}"`);

    if (stderr) {
      console.error('Python script error:', stderr);
      return NextResponse.json(
        { error: 'Failed to scrape event details', details: stderr },
        { status: 500 }
      );
    }

    // Parse the JSON output from the Python script
    const eventData = JSON.parse(stdout);

    return NextResponse.json(eventData);
  } catch (error) {
    console.error('Error in scrape API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error.message },
      { status: 500 }
    );
  }
}
