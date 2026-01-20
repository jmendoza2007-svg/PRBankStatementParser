import * as XLSX from 'xlsx';
import { Transaction, BankType } from '../types';

export const generateExcel = (transactions: Transaction[], bankName: BankType, originalFilename?: string) => {
  // 1. Prepare data for "QuickBooks Batch Entry" style (Generic Import)
  const data = transactions.map(t => {
    const isDebit = t.type === 'DEBIT';
    return {
      'Date': t.date,
      'Description': t.description,
      'Reference': t.reference || '',
      'Debit': isDebit ? t.amount : '',
      'Credit': !isDebit ? t.amount : '',
      'Amount': isDebit ? -t.amount : t.amount,
      'Type': t.type
    };
  });

  // 2. Create Workbook and Worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);

  // 3. Set column widths
  const wscols = [
    { wch: 12 }, // Date
    { wch: 40 }, // Description (Simplified)
    { wch: 15 }, // Reference
    { wch: 12 }, // Debit
    { wch: 12 }, // Credit
    { wch: 12 }, // Amount
    { wch: 10 }, // Type
  ];
  ws['!cols'] = wscols;

  // 4. Append sheet
  XLSX.utils.book_append_sheet(wb, ws, "Transactions");

  // 5. Generate Filename
  let filename = '';
  if (originalFilename) {
    const nameWithoutExt = originalFilename.split('.').slice(0, -1).join('.');
    filename = `${nameWithoutExt}_parsed.xlsx`;
  } else {
    const dateStr = new Date().toISOString().split('T')[0];
    const sanitizedBank = bankName.replace(/\s+/g, '_');
    filename = `${sanitizedBank}_Statement_${dateStr}.xlsx`;
  }

  // 6. Write and Download
  XLSX.writeFile(wb, filename);
};
