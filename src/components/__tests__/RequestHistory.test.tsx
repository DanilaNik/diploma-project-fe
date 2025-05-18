import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RequestHistory from '../RequestHistory';

describe('RequestHistory', () => {
  const mockOnDelete = jest.fn();
  const mockRequests = [
    {
      id: 1,
      filename: 'test1.mp4',
      summary: 'Test summary 1',
      created_at: '2023-01-01T12:00:00Z',
    },
    {
      id: 2,
      filename: 'test2.mp3',
      summary: 'Test summary 2',
      created_at: '2023-01-02T12:00:00Z',
    },
  ];

  const defaultProps = {
    requests: mockRequests,
    onDelete: mockOnDelete,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<RequestHistory {...defaultProps} />);
    expect(screen.getByText('Request History')).toBeInTheDocument();
    expect(screen.getByText('test1.mp4')).toBeInTheDocument();
    expect(screen.getByText('test2.mp3')).toBeInTheDocument();
  });

  it('handles search', () => {
    render(<RequestHistory {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText('Search requests...');
    fireEvent.change(searchInput, { target: { value: 'test1' } });
    expect(screen.getByText('test1.mp4')).toBeInTheDocument();
    expect(screen.queryByText('test2.mp3')).not.toBeInTheDocument();
  });

  it('handles date filtering', () => {
    render(<RequestHistory {...defaultProps} />);
    const filterButton = screen.getByLabelText('Show filters');
    fireEvent.click(filterButton);
    
    const dateChip = screen.getByText(new Date('2023-01-01').toLocaleDateString());
    fireEvent.click(dateChip);
    
    expect(screen.getByText('test1.mp4')).toBeInTheDocument();
    expect(screen.queryByText('test2.mp3')).not.toBeInTheDocument();
  });

  it('handles delete action', () => {
    render(<RequestHistory {...defaultProps} />);
    const deleteButtons = screen.getAllByLabelText('Delete request');
    fireEvent.click(deleteButtons[0]);
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  it('shows empty state when no requests match filters', () => {
    render(<RequestHistory {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText('Search requests...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    expect(screen.queryByText('test1.mp4')).not.toBeInTheDocument();
    expect(screen.queryByText('test2.mp3')).not.toBeInTheDocument();
  });
}); 