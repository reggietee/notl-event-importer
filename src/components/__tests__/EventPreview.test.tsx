import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EventPreview from '@/components/EventPreview';

describe('EventPreview Component', () => {
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
  
  const mockOnSubmit = jest.fn();
  const mockOnBack = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the preview form with event data', () => {
    render(
      <EventPreview 
        eventData={mockEventData} 
        onSubmit={mockOnSubmit} 
        onBack={mockOnBack} 
      />
    );
    
    expect(screen.getByText('Preview Event Details')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Event')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2025-04-15')).toBeInTheDocument();
    expect(screen.getByDisplayValue('7:00 PM')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Location')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Host')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByLabelText('This is a free event')).toBeChecked();
  });
  
  it('allows editing event data', () => {
    render(
      <EventPreview 
        eventData={mockEventData} 
        onSubmit={mockOnSubmit} 
        onBack={mockOnBack} 
      />
    );
    
    // Edit event name
    const eventNameInput = screen.getByLabelText('Event Name*');
    fireEvent.change(eventNameInput, { target: { value: 'Updated Event Name' } });
    
    // Edit date
    const dateInput = screen.getByLabelText('Date*');
    fireEvent.change(dateInput, { target: { value: '2025-05-20' } });
    
    // Toggle free event checkbox
    const freeCheckbox = screen.getByLabelText('This is a free event');
    fireEvent.click(freeCheckbox);
    
    // Price field should appear
    const priceInput = screen.getByLabelText('Price');
    fireEvent.change(priceInput, { target: { value: '$25.00' } });
    
    // Submit the form
    const submitButton = screen.getByText('Create WordPress Post');
    fireEvent.click(submitButton);
    
    // Check if onSubmit was called with updated data
    expect(mockOnSubmit).toHaveBeenCalledWith({
      ...mockEventData,
      eventName: 'Updated Event Name',
      date: '2025-05-20',
      isFree: false,
      price: '$25.00'
    });
  });
  
  it('calls onBack when back button is clicked', () => {
    render(
      <EventPreview 
        eventData={mockEventData} 
        onSubmit={mockOnSubmit} 
        onBack={mockOnBack} 
      />
    );
    
    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);
    
    expect(mockOnBack).toHaveBeenCalled();
  });
});
