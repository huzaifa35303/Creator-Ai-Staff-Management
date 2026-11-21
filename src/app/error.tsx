'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Prints error details directly to console/terminal
    console.error('====================================================');
    console.error('🚨 [CreatorAI Portal Runtime Error Detected]');
    console.error(`Timestamp: ${new Date().toISOString()}`);
    console.error(`Message: ${error.message}`);
    if (error.digest) {
      console.error(`Digest ID: ${error.digest}`);
    }
    if (error.stack) {
      console.error(`Stack Trace:\n${error.stack}`);
    }
    console.error('====================================================');
  }, [error]);

  return (
    <div className="min-h-screen bg-[#10131D] text-[#F7F8FC] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#1E2433] border border-[#D64545]/40 rounded-xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#D64545]/20 border border-[#D64545]/40 flex items-center justify-center text-[#D64545]">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#F7F8FC]">Application Error</h2>
            <p className="text-xs text-[#A6AEC0]">Logged directly to terminal & console</p>
          </div>
        </div>

        <div className="bg-[#10131D] border border-[#343B4D] rounded-lg p-3 my-4 font-mono text-[11px] text-[#D64545] overflow-x-auto">
          {error.message || 'An unexpected runtime error occurred.'}
        </div>

        <p className="text-xs text-[#A6AEC0] mb-5">
          The error details and stack trace have been printed to the server terminal. You can attempt to reload the component state below.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs bg-[#7057E8] text-white rounded-md font-medium hover:bg-[#6045d8] transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center justify-center gap-2 py-2 px-3 text-xs bg-[#171B28] border border-[#343B4D] text-[#A6AEC0] hover:text-[#F7F8FC] rounded-md transition"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
