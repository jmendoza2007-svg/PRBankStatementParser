import React, { useState } from 'react';
import { Download, ChevronDown, ChevronRight, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { FileResult } from '../types';
import { TransactionTable } from './TransactionTable';
import { generateExcel } from '../services/excelService';

interface ResultsViewProps {
  results: FileResult[];
  onReset: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ results, onReset }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleExport = (fileResult: FileResult, e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileResult.data) {
      generateExcel(fileResult.data.transactions, fileResult.data.bank, fileResult.filename);
    }
  };

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Overall Summary Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Processing Complete</h2>
          <p className="text-gray-500 mt-1">
            Successfully parsed <span className="font-semibold text-green-600">{successCount}</span> files. 
            {errorCount > 0 && <span className="text-red-600 ml-1">Failed: {errorCount}.</span>}
          </p>
        </div>
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
        >
          Process More Files
        </button>
      </div>

      {/* File List */}
      <div className="space-y-4">
        {results.map((result) => (
          <div key={result.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            
            {/* Row Header / Summary */}
            <div 
              className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${expandedId === result.id ? 'bg-gray-50' : ''}`}
              onClick={() => result.status === 'success' && toggleExpand(result.id)}
            >
              <div className="flex items-center space-x-4 overflow-hidden">
                <div className="flex-shrink-0">
                  {result.status === 'success' ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    {result.filename}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    {result.status === 'success' && result.data ? (
                      <>
                        <span className="font-medium text-gray-700">{result.data.bank}</span>
                        <span>•</span>
                        <span>{result.data.transactions.length} transactions</span>
                      </>
                    ) : (
                      <span className="text-red-600">{result.error || 'Unknown error'}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 ml-4">
                {result.status === 'success' && (
                  <button
                    onClick={(e) => handleExport(result, e)}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                    title="Download Excel"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                )}
                {result.status === 'success' && (
                  <div className="text-gray-400">
                    {expandedId === result.id ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                )}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedId === result.id && result.data && (
              <div className="border-t border-gray-200 p-4 bg-gray-50/50">
                <TransactionTable 
                  transactions={result.data.transactions} 
                  bank={result.data.bank}
                  // Hide the internal summary card and reset buttons since we handle them in the parent
                  simpleView={true} 
                  onReset={() => {}} // No-op in this context
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
