import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
// import { InventoryItem } from '../../types'; // Removed, using local interface
import { SupplySignatures } from '../../types';

// Augment jsPDF to include autoTable type
interface jsPDFWithAutoTable extends jsPDF {
    lastAutoTable: { finalY: number };
}

export interface RisItem {
    id?: string;
    stockNo?: string;
    unit?: string;
    name: string;
    quantity?: number;       // Request Quantity
    issueQuantity?: number;  // Approved/Issued Quantity
    remarks?: string;
}

export const generateRisPdf = (
    items: RisItem[],
    purpose: string = '',
    risNumber: string = '',
    signatures?: SupplySignatures,
    dates?: { requested?: Date; verified?: Date; issued?: Date; received?: Date },
    mode: 'download' | 'print' | 'blob' = 'download'
): Blob | string | undefined => {
    // 1. Setup Document
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a5' // 210mm x 148.5mm
    }) as jsPDFWithAutoTable;

    const pageWidth = 210;
    const pageHeight = 148.5;
    const leftMargin = 8;
    const rightMargin = 8;
    const topMargin = 8;
    const contentWidth = pageWidth - leftMargin - rightMargin;

    // 2. Pagination Logic (10 items per page)
    const itemsPerPage = 10;
    const totalPages = Math.ceil(items.length / itemsPerPage);

    for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
            doc.addPage();
        }

        const startIdx = page * itemsPerPage;
        const endIdx = Math.min((page + 1) * itemsPerPage, items.length);
        const pageItems = items.slice(startIdx, endIdx);

        // Fill with empty rows if less than 10
        while (pageItems.length < itemsPerPage) {
            pageItems.push({ name: '', unit: '', quantity: 0 }); // Empty placeholder
        }

        let currentY = topMargin;

        // ==========================================
        // HEADER
        // ==========================================
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.text('Appendix 63', pageWidth - rightMargin, currentY, { align: 'right' });

        currentY += 5;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('REQUISITION AND ISSUE SLIP', pageWidth / 2, currentY, { align: 'center' });

        currentY += 8;

        // Info Block
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');

        // Left Column
        const leftColonX = leftMargin + 22;
        const leftValueX = leftColonX + 2;

        const drawHeaderLine = (label: string, value: string, y: number) => {
            doc.setFont('helvetica', 'normal');
            doc.text(label, leftMargin, y);
            doc.text(':', leftColonX, y);
            doc.setFont('helvetica', 'bold');
            doc.text(value, leftValueX, y);
            const textWidth = doc.getTextWidth(value);
            doc.line(leftValueX, y + 1, leftValueX + textWidth + 10, y + 1); // Reduced underline: content width + 10mm
        };

        drawHeaderLine('Entity Name', 'PHILIPPINE STATISTICS AUTHORITY', currentY);

        // Right Column Block - Aligned Colons and shifted left
        const rightLabelX = pageWidth - 85;
        const colonAlignX = pageWidth - 42;
        const rightLineStartX = colonAlignX + 2;

        const drawRightItem = (label: string, value: string, y: number) => {
            doc.setFont('helvetica', 'normal');
            doc.text(label, rightLabelX, y);
            doc.text(':', colonAlignX, y);
            if (value) {
                doc.setFont('helvetica', 'bold');
                doc.text(value, rightLineStartX, y);
            }
            doc.line(rightLineStartX, y + 1, pageWidth - rightMargin, y + 1);
        };

        drawRightItem('Fund Cluster', '', currentY);

        currentY += 5;
        doc.setFont('helvetica', 'normal');
        drawHeaderLine('Division', 'Aurora Provincial Statistical Office', currentY);
        drawRightItem('Responsibility Center Code', '', currentY);

        currentY += 5;
        drawHeaderLine('Office', 'J.S. Center Brgy. Pingit Baler, Aurora', currentY);
        drawRightItem('RIS No.', risNumber || '', currentY);

        currentY += 3;

        // ==========================================
        // TABLE
        // ==========================================
        const tableBody = pageItems.map(item => {
            const isPlaceholder = !item.name;
            const reqQty = !isPlaceholder && item.quantity ? item.quantity.toString() : '';

            // Stock Available Logic
            // If issueQuantity is explicitly defined (checked/issued):
            // > 0 -> Yes
            // == 0 -> No
            // undefined -> Blank (Initial Request)
            let yesCheck = '';
            let noCheck = '';
            let issueQtyStr = '';

            if (!isPlaceholder && item.issueQuantity !== undefined) {
                if (item.issueQuantity > 0) {
                    yesCheck = '/';
                    issueQtyStr = item.issueQuantity.toString();
                } else {
                    noCheck = '/';
                    issueQtyStr = '0'; // Explicit 0 if rejected/unavailable
                }
            }

            return [
                item.stockNo || '',
                item.unit || '',
                item.name || '',
                reqQty,
                yesCheck,
                noCheck,
                issueQtyStr,
                item.remarks || ''
            ];
        });

        // Exact Column Widths (Sum = 194mm)
        // Stock No: 12
        // Unit: 10
        // Description: 78
        // Qty: 16
        // Yes: 8
        // No: 8
        // Qty: 16
        // Remarks: 46 (Remaining)

        const colWidths = {
            stockNo: 12,
            unit: 10,
            description: 78,
            reqQty: 16,
            yes: 8,
            no: 8,
            issueQty: 16,
            remarks: 46
        };

        autoTable(doc, {
            startY: currentY,
            head: [[
                { content: 'Requisition', colSpan: 4, styles: { halign: 'center' } },
                { content: 'Stock Available?', colSpan: 2, styles: { halign: 'center' } },
                { content: 'Issue', colSpan: 2, styles: { halign: 'center' } }
            ], [
                'Stock No.', 'Unit', 'Description', 'Quantity', 'Yes', 'No', 'Quantity', 'Remarks'
            ]],
            body: tableBody,
            theme: 'grid',
            styles: {
                fontSize: 8,
                cellPadding: 0.75,
                minCellHeight: 5.5,  // Reduced to 5.5mm to ensure A5 fit
                lineColor: [0, 0, 0],
                lineWidth: 0.15,
                textColor: [0, 0, 0],
                valign: 'middle'
            },
            headStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                lineWidth: 0.15,
                minCellHeight: 5.5,
                halign: 'center',
                valign: 'middle'
            },
            columnStyles: {
                0: { cellWidth: colWidths.stockNo, halign: 'center' },
                1: { cellWidth: colWidths.unit, halign: 'center' },
                2: { cellWidth: colWidths.description },
                3: { cellWidth: colWidths.reqQty, halign: 'center' },
                4: { cellWidth: colWidths.yes, halign: 'center' },
                5: { cellWidth: colWidths.no, halign: 'center' },
                6: { cellWidth: colWidths.issueQty, halign: 'center' },
                7: { cellWidth: colWidths.remarks },
            },
            margin: { left: leftMargin, right: rightMargin },
            showHead: 'firstPage', // Actually we want header on every page in strictly manually paginated mode? 
            // Since we use manual loop and new page, autoTable sees each as a fresh table if we recall it.
            // But here we call it once per page loop. So showHead: 'everyPage' is default for new tables.
        });

        // ==========================================
        // PURPOSE ROW
        // ==========================================
        let finalY = doc.lastAutoTable.finalY;

        // Safety check for overflow
        if (finalY > 105) finalY = 105;

        doc.setLineWidth(0.15);
        doc.rect(leftMargin, finalY, contentWidth, 6);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.text('Purpose:', leftMargin + 2, finalY + 4);
        doc.setFont('helvetica', 'bold');
        doc.text(purpose || '', leftMargin + 20, finalY + 4);

        finalY += 6;

        // ==========================================
        // SIGNATURE BLOCK
        // ==========================================
        const sigRowHeight = 10; // Locked at 10mm per user request
        const colWidth = (contentWidth - 25) / 4; // 25mm for label col

        const labelX = leftMargin;
        const col1X = leftMargin + 25;
        const col2X = col1X + colWidth;
        const col3X = col2X + colWidth;
        const col4X = col3X + colWidth;

        // 1. Headers
        doc.rect(leftMargin, finalY, contentWidth, 5);
        doc.line(col1X, finalY, col1X, finalY + 5 + (sigRowHeight + 15)); // Vertical lines (sig + name + desig + date rows)
        doc.line(col2X, finalY, col2X, finalY + 5 + (sigRowHeight + 15));
        doc.line(col3X, finalY, col3X, finalY + 5 + (sigRowHeight + 15));
        doc.line(col4X, finalY, col4X, finalY + 5 + (sigRowHeight + 15));

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);

        doc.text('Requested by:', col1X + 2, finalY + 3.5);
        doc.text('Approved by:', col2X + 2, finalY + 3.5);
        doc.text('Issued by:', col3X + 2, finalY + 3.5);
        doc.text('Received by:', col4X + 2, finalY + 3.5);

        finalY += 5;

        // 2. Rows
        const drawRow = (label: string, y: number, height: number) => {
            doc.rect(leftMargin, y, contentWidth, height);
            doc.setFont('helvetica', 'normal');
            doc.text(label, leftMargin + 2, y + (height / 2) + 1);
        };

        // Signature Row
        drawRow('Signature :', finalY, sigRowHeight);

        // --- Signature Images ---
        if (signatures) {
            const renderSig = (url: string | undefined, x: number, y: number, w: number, h: number) => {
                if (url) {
                    try {
                        // Standard signature size (55mm x 16mm)
                        // Will overlap the 10mm box naturally
                        const sigWidth = 55;
                        const sigHeight = 16;

                        const sigOffsetX = (w - sigWidth) / 2;
                        const sigOffsetY = (h - sigHeight) / 2;

                        // Thickness effect: render twice with tiny offset
                        doc.addImage(url, 'PNG', x + sigOffsetX, y + sigOffsetY, sigWidth, sigHeight);
                        doc.addImage(url, 'PNG', x + sigOffsetX + 0.05, y + sigOffsetY + 0.05, sigWidth, sigHeight);
                    } catch (e) {
                        console.warn('Failed to render signature', e);
                    }
                }
            };

            renderSig(signatures.requesterSigUrl, col1X, finalY, colWidth, sigRowHeight);
            // Blank Approved/Issued signatures for now per user request
            // renderSig(signatures.verifierSigUrl || signatures.approverSigUrl, col2X, finalY, colWidth, sigRowHeight);
            // renderSig(signatures.issuerSigUrl, col3X, finalY, colWidth, sigRowHeight);

            // Column 4: Received By
            renderSig(signatures.receiverSigUrl, col4X, finalY, colWidth, sigRowHeight);
        }

        finalY += sigRowHeight;

        // Printed Name Row
        drawRow('Printed Name :', finalY, 5);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        const centerText = (text: string, xStart: number, width: number, y: number, uppercase: boolean = true) => {
            if (!text) return;
            const displayText = uppercase ? text.toUpperCase() : text;
            doc.text(displayText, xStart + (width / 2), y, { align: 'center' });
        };

        // Naming Logic:
        // Requested = Requester
        // Approved By = FERDINAND E. SANTIAGO
        // Issued By = ABNER JUNE A. TABLAN
        // Received By = Receiver (Fallback to Requester if not yet received)

        centerText(signatures?.requester || '', col1X, colWidth, finalY + 3.5, true);
        centerText('FERDINAND E. SANTIAGO', col2X, colWidth, finalY + 3.5, true);
        centerText('ABNER JUNE A. TABLAN', col3X, colWidth, finalY + 3.5, true);
        centerText(signatures?.receiver || signatures?.requester || '', col4X, colWidth, finalY + 3.5, true);

        finalY += 5;

        // Designation Row
        drawRow('Designation :', finalY, 5);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);

        // Hardcoded designations for now per user request
        centerText((signatures as any)?.requesterDesignation || '', col1X, colWidth, finalY + 3.5, false);
        centerText('Chief Statistical Specialist', col2X, colWidth, finalY + 3.5, false);
        centerText('Statistical Specialist II', col3X, colWidth, finalY + 3.5, false);
        centerText(signatures?.receiver ? '' : ((signatures as any)?.requesterDesignation || ''), col4X, colWidth, finalY + 3.5, false);

        finalY += 5;

        // Date Row
        drawRow('Date :', finalY, 5);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);

        const formatDate = (d?: Date) => d ? d.toLocaleDateString() : '';

        centerText(formatDate(dates?.requested), col1X, colWidth, finalY + 3.5);
        centerText(formatDate(dates?.verified), col2X, colWidth, finalY + 3.5);
        centerText(formatDate(dates?.issued), col3X, colWidth, finalY + 3.5);
        centerText(formatDate((dates as any)?.received || dates?.requested), col4X, colWidth, finalY + 3.5);

    }

    // 3. Output Logic
    const requesterName = (signatures?.requester || 'UNKNOWN').toUpperCase();
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `RIS_${requesterName}_${risNumber || 'DRAFT'}_${dateStr}.pdf`;

    if (mode === 'print') {
        // doc.autoPrint(); // Removed triggers print dialog
        const blobUrl = doc.output('bloburl');
        window.open(blobUrl, '_blank');
        return filename;
    } else if (mode === 'blob') {
        return doc.output('blob');
    } else {
        doc.save(filename);
        return filename;
    }
};
