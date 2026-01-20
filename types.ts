export interface Transaction {
  date: string;
  description: string;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  reference?: string;
}

export enum BankType {
  POPULAR = 'Banco Popular',
  FIRSTBANK = 'FirstBank',
  ORIENTAL = 'Oriental Bank',
  UNKNOWN = 'Unknown Bank',
}

export interface ParseResult {
  bank: BankType;
  transactions: Transaction[];
  rawText?: string;
}

export interface FileResult {
  id: string;
  filename: string;
  status: 'success' | 'error';
  data?: ParseResult;
  error?: string;
}

export interface ProcessingState {
  status: 'idle' | 'processing' | 'complete' | 'error';
  currentFileIndex?: number;
  totalFiles?: number;
  currentFileName?: string;
  globalError?: string;
}
