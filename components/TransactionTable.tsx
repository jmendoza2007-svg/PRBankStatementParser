import React, { useMemo } from 'react';
import { Download, CheckCircle, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { Transaction, BankType } from '../types';
import { generateExcel } from '../services/excelService';

interface TransactionTableProps {
  transactions: Transaction[];
  bank: BankType;
  onReset: () => void;
  simpleView?: boolean;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, bank, onReset, simpleView = false }) => {
  
  const stats = useMemo(() => {
    const totalCredits = transactions.filter(t => t.type === 'CREDIT').reduce((acc, t) => acc + t.amount, 0);
    const totalDebits = transactions.filter(t => t.type === 'DEBIT').reduce((acc, t) => acc + t.amount, 0);
    const count = transactions.length;
    return { totalCredits, totalDebits, count };
  }, [transactions]);

  const handleExport = () => {
    generateExcel(transactions, bank);
  };

  if (transactions.length === 0) return null;

  return (
    <div className="space-y-6">
      
      {/* Summary Stats - Only show detailed card if NOT in simple view, or simple stats if in simple view */}
      {!simpleView ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle className="text-green-500 w-6 h-6" />
                Extraction Complete
              </h2>
              <p className="text-gray-500 mt-1">
                Identified <span className="font-semibold text-gray-900">{bank}</span> statement with {stats.count} transactions.
              </p>
            </div>
            <div className="flex space-x-3">
               <button
                onClick={onReset}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Parse Another
              </button>
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export to Excel
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-red-600">Total Debits</span>
                <ArrowDownCircle className="w-5 h-5 text-red-500" />
              </div>
              <p className="mt-2 text-2xl font-bold text-red-700">
                ${stats.totalDebits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
               <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-600">Total Credits</span>
                <ArrowUpCircle className="w-5 h-5 text-green-500" />
              </div>
              <p className="mt-2 text-2xl font-bold text-green-700">
                ${stats.totalCredits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-4">
           <div className="flex items-center gap-2 text-red-700">
              <ArrowDownCircle className="w-4 h-4" />
              <span className="font-semibold">${stats.totalDebits.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              <span className="text-xs text-red-500 uppercase">Debits</span>
           </div>
           <div className="flex items-center gap-2 text-green-700">
              <ArrowUpCircle className="w-4 h-4" />
              <span className="font-semibold">${stats.totalCredits.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              <span className="text-xs text-green-500 uppercase">Credits</span>
           </div>
        </div>
      )}

      {/* Table */}
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${simpleView ? 'border-none shadow-none rounded-lg' : ''}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description (Vendor)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((t, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{t.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs md:max-w-md truncate" title={t.description}>{t.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.reference || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-red-600">
                    {t.type === 'DEBIT' ? `$${t.amount.toFixed(2)}` : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-green-600">
                     {t.type === 'CREDIT' ? `$${t.amount.toFixed(2)}` : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
