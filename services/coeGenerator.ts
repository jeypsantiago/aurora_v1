import jsPDF from 'jspdf';
import { EmploymentRecord } from '../types';

export const generateCOE = (record: EmploymentRecord) => {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    doc.text('Republic of the Philippines', pageWidth / 2, 20, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.text('PHILIPPINE STATISTICS AUTHORITY', pageWidth / 2, 25, { align: 'center' });
    doc.text('Aurora Provincial Statistical Office', pageWidth / 2, 30, { align: 'center' });

    // Title
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('CERTIFICATE OF EMPLOYMENT', pageWidth / 2, 50, { align: 'center' });

    // Body
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    const textLeft = 25;
    const contentWidth = pageWidth - 50;

    doc.text('TO WHOM IT MAY CONCERN:', textLeft, 70);

    const paragraph1 = `This is to certify that ${record.name.toUpperCase()} has been engaged by the Philippine Statistics Authority - Aurora Provincial Statistical Office as a ${record.surveyProject} personnel under a Contract of Service (COS) status.`;

    const splitText1 = doc.splitTextToSize(paragraph1, contentWidth);
    doc.text(splitText1, textLeft, 85, { maxWidth: contentWidth, align: 'justify' });

    let dateExecutionStr = record.dateExecution;
    try {
        dateExecutionStr = new Date(record.dateExecution).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) { }

    const paragraph2 = `The employment period for the aforementioned assignment is marked as ${record.duration} executed in the month of ${record.month} starting ${dateExecutionStr}.`;

    const splitText2 = doc.splitTextToSize(paragraph2, contentWidth);
    doc.text(splitText2, textLeft, 110, { maxWidth: contentWidth, align: 'justify' });

    const paragraph3 = `This certification is issued upon the request of the interested party for whatever legal purpose it may serve.`;

    const splitText3 = doc.splitTextToSize(paragraph3, contentWidth);
    doc.text(splitText3, textLeft, 135, { maxWidth: contentWidth, align: 'justify' });

    // Issuance Details
    doc.text(`Issued this ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} at Baler, Aurora.`, textLeft, 160);

    // Signatory
    doc.setFont('helvetica', 'bold');
    doc.text(record.focalPerson.toUpperCase(), pageWidth - 60, 200, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Provincial Statistics Officer', pageWidth - 60, 205, { align: 'center' });

    // Footer / Serial No.
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Registry Serial No: ${record.serialNumber}`, 20, 270);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 275);
    doc.text('System Generated Document - Not Valid Without Dry Seal', pageWidth / 2, 285, { align: 'center' });

    // Save Document
    doc.save(`COE_${record.serialNumber}_${record.name.replace(/\s+/g, '_')}.pdf`);
};
