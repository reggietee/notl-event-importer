import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UrlForm from '@/components/UrlForm';

// Mock fetch
global.fetch = jest.fn();

describe('UrlForm Component', () => {
  const mockOnSuccess = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the form correctly', () => {
    render(<UrlForm onSuccess={mockOnSuccess} />);
    
    expect(screen.getByText('Import Event from URL')).toBeInTheDocument();
    expect(screen.getByLabelText('Event URL')).toBeInTheDocument();
    expect(screen.getByText('Extract Event Details')).toBeInTheDocument();
  });
  
  it('validates URL format', async () => {
    render(<UrlForm onSuccess={mockOnSuccess} />);
    
    const input = screen.getByLabelText('Event URL');
    const submitButton = screen.getByText('Extract Event Details');
    
    // Enter invalid URL
    fireEvent.change(input, { target: { value: 'not-a-url' } });
    fireEvent.click(submitButton);
    
    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid URL')).toBeInTheDocument();
    });
    
    // Should not call the API
    expect(fetch).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
  
  it('submits the form and calls onSuccess when API returns data', async () => {
    const mockEventData = {
      eventName: 'Test Event',
      date: '2025-04-15',
      time: '7:00 PM',
      location: 'Test Location',
      description: 'Test Description',
      host: 'Test Host',
      isFree: true,
      price: null,
      imageUrl: null
    };
    
    // Mock successful API response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockEventData
    });
    
    render(<UrlForm onSuccess={mockOnSuccess} />);
    
    const input = screen.getByLabelText('Event URL');
    const submitButton = screen.getByText('Extract Event Details');
    
    // Enter valid URL and submit
    fireEvent.change(input, { target: { value: 'https://example.com/event' } });
    fireEvent.click(submitButton);
    
    // Should show loading state
    expect(screen.getByText('Extracting Event Details...')).toBeInTheDocument();
    
    // Should call the API with correct data
    expect(fetch).toHaveBeenCalledWith('/api/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: 'https://example.com/event' }),
    });
    
    // Should call onSuccess with the event data
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith(mockEventData);
    });
  });
  
  it('handles API errors correctly', async () => {
    // Mock failed API response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Failed to scrape event' })
    });
    
    render(<UrlForm onSuccess={mockOnSuccess} />);
    
    const input = screen.getByLabelText('Event URL');
    const submitButton = screen.getByText('Extract Event Details');
    
    // Enter valid URL and submit
    fireEvent.change(input, { target: { value: 'https://example.com/event' } });
    fireEvent.click(submitButton);
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByText('Failed to scrape event')).toBeInTheDocument();
    });
    
    // Should not call onSuccess
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});
