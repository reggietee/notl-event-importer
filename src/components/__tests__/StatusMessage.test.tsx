import { render, screen } from '@testing-library/react';
import StatusMessage from '@/components/StatusMessage';

describe('StatusMessage Component', () => {
  const mockOnReset = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders success message correctly', () => {
    render(
      <StatusMessage 
        success={true}
        postUrl="https://notl.events/event/test-event"
        onReset={mockOnReset}
      />
    );
    
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('The event has been successfully imported to WordPress.')).toBeInTheDocument();
    expect(screen.getByText('View Post on WordPress →')).toBeInTheDocument();
    expect(screen.getByText('Import Another Event')).toBeInTheDocument();
  });
  
  it('renders error message correctly', () => {
    render(
      <StatusMessage 
        success={false}
        error="Failed to create WordPress post"
        onReset={mockOnReset}
      />
    );
    
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Failed to create WordPress post')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });
  
  it('uses default error message when no specific error is provided', () => {
    render(
      <StatusMessage 
        success={false}
        onReset={mockOnReset}
      />
    );
    
    expect(screen.getByText('An unexpected error occurred while importing the event.')).toBeInTheDocument();
  });
  
  it('calls onReset when button is clicked', () => {
    render(
      <StatusMessage 
        success={true}
        onReset={mockOnReset}
      />
    );
    
    const resetButton = screen.getByText('Import Another Event');
    resetButton.click();
    
    expect(mockOnReset).toHaveBeenCalled();
  });
});
