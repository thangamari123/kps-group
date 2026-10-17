// Client-side PDF export for webinar registrations (jsPDF + autoTable, loaded on demand).
// Everything is generated in the browser from data the admin has already loaded; nothing is uploaded.

export interface WebinarPdfRow {
  fullName: string;
  email: string;
  phone: string;
  webinarName: string;
  registeredAt: string;
  status: string;
}

export interface WebinarPdfOptions {
  /** Human-readable summary of active search/filters, e.g. ["Status: New", 'Search: "priya"'] */
  filterSummary: string[];
  exportedAt: Date;
}

export interface WebinarPdfResult {
  fileName: string;
  /** Values that contained characters the built-in PDF font cannot draw (shown as "?") */
  replacedValues: number;
}

const GREEN_DARK: [number, number, number] = [7, 59, 44]; // #073B2C
const YELLOW: [number, number, number] = [255, 193, 7]; // #FFC107
const MINT: [number, number, number] = [243, 249, 246];
const BORDER: [number, number, number] = [200, 213, 207];
const TEXT: [number, number, number] = [23, 33, 30];
const MUTED: [number, number, number] = [102, 115, 110];

const STATUS_COLORS: Record<string, [number, number, number]> = {
  New: [180, 83, 9],
  Contacted: [29, 78, 216],
  Confirmed: [0, 107, 79],
};

// jsPDF's built-in fonts only cover Latin-1 (+ a few typographic characters in WinAnsi).
const WIN_ANSI_EXTRAS = '–—‘’“”•…€™';

function toPdfSafe(value: string, onReplace: () => void): string {
  let replaced = false;
  const text = Array.from(value.normalize('NFC'))
    .map((ch) => {
      const code = ch.codePointAt(0) as number;
      if (code === 0x09 || code === 0x0a || code === 0x0d) return ' ';
      if ((code >= 0x20 && code <= 0x7e) || (code >= 0xa0 && code <= 0xff) || WIN_ANSI_EXTRAS.includes(ch)) return ch;
      replaced = true;
      return '?';
    })
    .join('');
  if (replaced) onReplace();
  return text;
}

function formatExportDate(d: Date): string {
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export async function exportWebinarRegistrationsPdf(
  rows: WebinarPdfRow[],
  { filterSummary, exportedAt }: WebinarPdfOptions
): Promise<WebinarPdfResult> {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);

  let replacedValues = 0;
  const safe = (v: string) => toPdfSafe(v || '', () => (replacedValues += 1));

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth(); // 297
  const pageHeight = doc.internal.pageSize.getHeight(); // 210
  const marginX = 12;
  const contentWidth = pageWidth - marginX * 2; // 273

  // ---- Report heading (first page) ----
  doc.setFillColor(...YELLOW);
  doc.rect(marginX, 10, 22, 1.4, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...GREEN_DARK);
  doc.text('KPS Webinar Registrations', marginX, 21);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...MUTED);
  doc.text(`Exported on: ${formatExportDate(exportedAt)}`, marginX, 28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...TEXT);
  doc.text(`Total registrations: ${rows.length}`, pageWidth - marginX, 28, { align: 'right' });

  let tableStartY = 33;
  if (filterSummary.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...MUTED);
    const lines = doc.splitTextToSize(safe(`Filters applied: ${filterSummary.join('  |  ')}`), contentWidth) as string[];
    doc.text(lines, marginX, 33.5);
    tableStartY = 33.5 + lines.length * 4 + 1;
  }

  // ---- Table ----
  // Column widths add up to the 273 mm of usable width so nothing is clipped.
  const columnWidths = [13, 42, 57, 33, 62, 39, 27];
  autoTable(doc, {
    startY: tableStartY,
    margin: { top: 18, left: marginX, right: marginX, bottom: 16 },
    tableWidth: contentWidth,
    head: [['S.No.', 'Full Name', 'Email Address', 'Contact Number', 'Webinar Name', 'Registration Date', 'Status']],
    body: rows.map((r, i) => [
      String(i + 1),
      safe(r.fullName),
      safe(r.email),
      safe(r.phone),
      safe(r.webinarName),
      safe(r.registeredAt),
      safe(r.status),
    ]),
    theme: 'grid',
    showHead: 'everyPage',
    rowPageBreak: 'avoid',
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      textColor: TEXT,
      cellPadding: { top: 2.6, bottom: 2.6, left: 2.4, right: 2.4 },
      lineColor: BORDER,
      lineWidth: 0.2,
      overflow: 'linebreak', // long names / emails / webinar titles wrap inside their cell
      valign: 'middle',
    },
    headStyles: {
      fillColor: GREEN_DARK,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'left',
      lineColor: GREEN_DARK,
    },
    alternateRowStyles: { fillColor: MINT },
    columnStyles: {
      0: { cellWidth: columnWidths[0], halign: 'center' },
      1: { cellWidth: columnWidths[1] },
      2: { cellWidth: columnWidths[2] },
      3: { cellWidth: columnWidths[3] },
      4: { cellWidth: columnWidths[4] },
      5: { cellWidth: columnWidths[5] },
      6: { cellWidth: columnWidths[6], halign: 'center', fontStyle: 'bold' },
    },
    didParseCell: (data) => {
      if (data.section === 'head' && (data.column.index === 0 || data.column.index === 6)) {
        data.cell.styles.halign = 'center';
      }
      if (data.section === 'body' && data.column.index === 6) {
        const color = STATUS_COLORS[String(data.cell.raw)];
        if (color) data.cell.styles.textColor = color;
      }
    },
    didDrawPage: (data) => {
      // Running header on continuation pages (the first page already has the full heading)
      if (data.pageNumber > 1) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(...GREEN_DARK);
        doc.text('KPS Webinar Registrations', marginX, 12);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(...MUTED);
        doc.text(`Exported on: ${formatExportDate(exportedAt)}`, pageWidth - marginX, 12, { align: 'right' });
        doc.setDrawColor(...YELLOW);
        doc.setLineWidth(0.6);
        doc.line(marginX, 14, pageWidth - marginX, 14);
      }
    },
  });

  // ---- Footer on every page (needs the final page count) ----
  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page);
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.2);
    doc.line(marginX, pageHeight - 11, pageWidth - marginX, pageHeight - 11);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text('KPS Worldwide Logistics Pvt. Ltd. - Confidential: contains personal data', marginX, pageHeight - 6.5);
    doc.text(`Page ${page} of ${pageCount}`, pageWidth - marginX, pageHeight - 6.5, { align: 'right' });
  }

  const fileName = `KPS-Webinar-Registrations-${exportedAt.toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
  return { fileName, replacedValues };
}
