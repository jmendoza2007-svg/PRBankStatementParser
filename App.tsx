import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { ResultsView } from './components/ResultsView';
import { ProcessingState, FileResult } from './types';
import { fileToBase64 } from './utils/fileUtils';
import { parseBankStatement } from './services/geminiService';
import { AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [processingState, setProcessingState] = useState<ProcessingState>({ status: 'idle' });
  const [results, setResults] = useState<FileResult[]>([]);

  const handleFilesSelect = async (files: File[]) => {
    // Validate file types
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    const validFiles = files.filter(f => validTypes.includes(f.type));

    if (validFiles.length === 0) {
      setProcessingState({ status: 'error', globalError: 'Please upload valid PDF or Image files.' });
      return;
    }

    setProcessingState({ 
      status: 'processing', 
      totalFiles: validFiles.length, 
      currentFileIndex: 0 
    });
    
    setResults([]);
    const newResults: FileResult[] = [];

    // Process sequentially
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      setProcessingState({ 
        status: 'processing', 
        totalFiles: validFiles.length, 
        currentFileIndex: i + 1,
        currentFileName: file.name
      });

      try {
        const base64 = await fileToBase64(file);
        const data = await parseBankStatement(base64, file.type);
        
        newResults.push({
          id: Math.random().toString(36).substr(2, 9),
          filename: file.name,
          status: 'success',
          data: data
        });
      } catch (err: any) {
        console.error(`Error processing ${file.name}:`, err);
        newResults.push({
          id: Math.random().toString(36).substr(2, 9),
          filename: file.name,
          status: 'error',
          error: err.message || 'Processing failed'
        });
      }
      
      // Update results progressively
      setResults([...newResults]);
    }

    setProcessingState({ status: 'complete' });
  };

  const handleReset = () => {
    setProcessingState({ status: 'idle' });
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Hero / Intro */}
          {processingState.status === 'idle' && (
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                Convert Bank Statements <br className="hidden sm:block"/> to <span className="text-blue-600">QuickBooks Excel</span>
              </h1>
              <p className="max-w-2xl mx-auto text-lg text-gray-600">
                Automatically extract transactions from PDF or Image statements for Banco Popular, FirstBank, and Oriental. 
                Upload multiple files to process them in batch.
              </p>
            </div>
          )}

          {/* Upload Section */}
          {processingState.status !== 'complete' && (
            <div className="bg-white rounded-xl shadow-sm p-1">
              <FileUpload 
                onFilesSelect={handleFilesSelect} 
                isProcessing={processingState.status === 'processing'} 
              />
            </div>
          )}
          
          {/* Progress Indicator */}
          {processingState.status === 'processing' && (
            <div className="max-w-xl mx-auto text-center space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${((processingState.currentFileIndex || 0) / (processingState.totalFiles || 1)) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm font-medium text-gray-600">
                Processing {processingState.currentFileIndex} of {processingState.totalFiles}: <span className="text-gray-900">{processingState.currentFileName}</span>
              </p>
            </div>
          )}

          {/* Global Error Message */}
          {processingState.status === 'error' && processingState.globalError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-in fade-in slide-in-from-top-2">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {processingState.globalError}
                  </p>
                  <button 
                    onClick={handleReset}
                    className="mt-2 text-sm font-medium text-red-600 hover:text-red-500 underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results Section */}
          {processingState.status === 'complete' && results.length > 0 && (
            <ResultsView 
              results={results} 
              onReset={handleReset}
            />
          )}

        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-400">
            Powered by Google Gemini 2.5 Flash • Does not store data.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
