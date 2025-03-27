import { NextRequest, NextResponse } from 'next/server';

/**
 * Simple health check endpoint to verify the API is running
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'Event Importer API is running',
    timestamp: new Date().toISOString()
  });
}
