import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Export the timetable grid to PDF
 * @param {HTMLElement} element - The DOM element to capture (timetable grid)
 * @param {string} filename - The name of the PDF file (default: 'timetable.pdf')
 * @returns {Promise<void>}
 */
export const exportPdf = async (element, filename = 'timetable.pdf') => {
  try {
    if (!element) {
      throw new Error('No element provided for PDF export');
    }

    // Capture the timetable grid as a canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Allow cross-origin images
      logging: false, // Disable console logs
      backgroundColor: '#ffffff' // White background
    });

    // Get canvas dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Convert canvas to image data
    const imgData = canvas.toDataURL('image/png');

    // Create PDF document (A4 size, landscape orientation for better fit)
    const pdf = new jsPDF({
      orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Calculate dimensions for landscape if needed
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate scaling to fit the image on the page
    let finalWidth = pdfWidth;
    let finalHeight = (canvas.height * pdfWidth) / canvas.width;
    
    // If image is taller than page, scale down to fit
    if (finalHeight > pdfHeight) {
      finalHeight = pdfHeight;
      finalWidth = (canvas.width * pdfHeight) / canvas.height;
    }

    // Center the image on the page
    const xOffset = (pdfWidth - finalWidth) / 2;
    const yOffset = (pdfHeight - finalHeight) / 2;

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);

    // Trigger download
    pdf.save(filename);

    return Promise.resolve();
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw new Error(`Failed to export PDF: ${error.message}`);
  }
};
