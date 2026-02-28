import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportPdf } from './exportPdf';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Mock html2canvas
vi.mock('html2canvas');

// Mock jsPDF with proper constructor
vi.mock('jspdf', () => {
  return {
    default: vi.fn()
  };
});

describe('exportPdf', () => {
  let mockElement;
  let mockCanvas;
  let mockPdf;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Create mock element
    mockElement = document.createElement('div');
    mockElement.innerHTML = '<table><tr><td>Test</td></tr></table>';

    // Create mock canvas
    mockCanvas = {
      width: 800,
      height: 600,
      toDataURL: vi.fn().mockReturnValue('data:image/png;base64,mockImageData')
    };

    // Mock html2canvas to return the mock canvas
    html2canvas.mockResolvedValue(mockCanvas);

    // Create mock PDF instance
    mockPdf = {
      internal: {
        pageSize: {
          getWidth: vi.fn().mockReturnValue(297),
          getHeight: vi.fn().mockReturnValue(210)
        }
      },
      addImage: vi.fn(),
      save: vi.fn()
    };

    // Mock jsPDF constructor to return mockPdf
    jsPDF.mockImplementation(function() {
      return mockPdf;
    });
  });

  it('should capture element with html2canvas', async () => {
    await exportPdf(mockElement);

    expect(html2canvas).toHaveBeenCalledWith(mockElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
  });

  it('should create PDF with correct orientation for landscape content', async () => {
    await exportPdf(mockElement);

    expect(jsPDF).toHaveBeenCalledWith({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
  });

  it('should add image to PDF', async () => {
    await exportPdf(mockElement);

    expect(mockPdf.addImage).toHaveBeenCalledWith(
      'data:image/png;base64,mockImageData',
      'PNG',
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
      expect.any(Number)
    );
  });

  it('should trigger PDF download with default filename', async () => {
    await exportPdf(mockElement);

    expect(mockPdf.save).toHaveBeenCalledWith('timetable.pdf');
  });

  it('should trigger PDF download with custom filename', async () => {
    const customFilename = 'my-timetable.pdf';
    await exportPdf(mockElement, customFilename);

    expect(mockPdf.save).toHaveBeenCalledWith(customFilename);
  });

  it('should throw error if no element is provided', async () => {
    await expect(exportPdf(null)).rejects.toThrow('No element provided for PDF export');
  });

  it('should handle html2canvas errors', async () => {
    const error = new Error('Canvas capture failed');
    html2canvas.mockRejectedValue(error);

    await expect(exportPdf(mockElement)).rejects.toThrow('Failed to export PDF: Canvas capture failed');
  });

  it('should convert canvas to image data URL', async () => {
    await exportPdf(mockElement);

    expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png');
  });

  it('should use portrait orientation for tall content', async () => {
    // Create a tall canvas (height > width)
    mockCanvas.width = 600;
    mockCanvas.height = 1200;

    await exportPdf(mockElement);

    expect(jsPDF).toHaveBeenCalledWith({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
  });
});
