import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center text-blue-600">
              <FileSpreadsheet className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl tracking-tight text-gray-900">PR Bank Parser</span>
            </div>
            <div className="hidden md:block ml-10">
              <p className="text-sm text-gray-500">QuickBooks Ready Exports for Popular, FirstBank & Oriental</p>
            </div>
          </div>
          <div>
            <a 
              href="https://quickbooks.intuit.com" 
              target="_blank" 
              rel="noreferrer"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Help & Docs
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
