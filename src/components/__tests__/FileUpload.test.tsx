import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FileUpload from '../FileUpload';

describe('FileUpload', () => {
  const mockOnFileSelect = jest.fn();
  const defaultProps = {
    onFileSelect: mockOnFileSelect,
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<FileUpload {...defaultProps} />);
    expect(screen.getByText('Select File')).toBeInTheDocument();
    expect(screen.getByText('or drag and drop your file here')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<FileUpload {...defaultProps} isLoading={true} />);
    expect(screen.getByText('Uploading...')).toBeInTheDocument();
  });

  it('shows upload progress', () => {
    render(<FileUpload {...defaultProps} uploadProgress={50} />);
    expect(screen.getByText('50% uploaded')).toBeInTheDocument();
  });

  it('handles file selection via button', () => {
    render(<FileUpload {...defaultProps} />);
    const file = new File(['test'], 'test.mp4', { type: 'video/mp4' });
    const input = screen.getByTestId('file-input');
    fireEvent.change(input, { target: { files: [file] } });
    expect(mockOnFileSelect).toHaveBeenCalledWith(file);
  });

  it('handles drag and drop', () => {
    render(<FileUpload {...defaultProps} />);
    const dropzone = screen.getByText('or drag and drop your file here').parentElement;
    const file = new File(['test'], 'test.mp4', { type: 'video/mp4' });
    
    fireEvent.dragEnter(dropzone!);
    expect(dropzone).toHaveStyle({ borderColor: 'primary.main' });
    
    fireEvent.drop(dropzone!, { dataTransfer: { files: [file] } });
    expect(mockOnFileSelect).toHaveBeenCalledWith(file);
    expect(dropzone).not.toHaveStyle({ borderColor: 'primary.main' });
  });
}); 