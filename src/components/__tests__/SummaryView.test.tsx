import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SummaryView from '../SummaryView';

describe('SummaryView', () => {
  const mockOnSummaryChange = jest.fn();
  const mockOnSave = jest.fn();
  const mockOnDownload = jest.fn();
  const defaultProps = {
    summary: 'Test summary',
    onSummaryChange: mockOnSummaryChange,
    onSave: mockOnSave,
    onDownload: mockOnDownload,
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<SummaryView {...defaultProps} />);
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test summary')).toBeInTheDocument();
    expect(screen.getByText('Save Summary')).toBeInTheDocument();
    expect(screen.getByText('Download Summary')).toBeInTheDocument();
  });

  it('handles summary editing', () => {
    render(<SummaryView {...defaultProps} />);
    const editButton = screen.getByLabelText('Edit summary');
    fireEvent.click(editButton);
    
    const textarea = screen.getByDisplayValue('Test summary');
    fireEvent.change(textarea, { target: { value: 'New summary' } });
    expect(mockOnSummaryChange).toHaveBeenCalledWith('New summary');
  });

  it('handles save action', () => {
    render(<SummaryView {...defaultProps} />);
    const editButton = screen.getByLabelText('Edit summary');
    fireEvent.click(editButton);
    
    const saveButton = screen.getByText('Save Summary');
    fireEvent.click(saveButton);
    expect(mockOnSave).toHaveBeenCalled();
  });

  it('handles download action', () => {
    render(<SummaryView {...defaultProps} />);
    const downloadButton = screen.getByText('Download Summary');
    fireEvent.click(downloadButton);
    expect(mockOnDownload).toHaveBeenCalled();
  });

  it('disables buttons when loading', () => {
    render(<SummaryView {...defaultProps} isLoading={true} />);
    expect(screen.getByText('Save Summary')).toBeDisabled();
    expect(screen.getByText('Download Summary')).toBeDisabled();
  });
}); 