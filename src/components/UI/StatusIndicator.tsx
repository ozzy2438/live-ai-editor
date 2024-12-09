import React from 'react';
import { AlertCircle } from 'lucide-react';

interface StatusIndicatorProps {
  isListening: boolean;
  error: string | null;
}

export function StatusIndicator({ isListening, error }: StatusIndicatorProps) {
  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full">
        <AlertCircle className="w-4 h-4" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-3 h-3 rounded-full ${
          isListening ? 'bg-green-400 animate-pulse' : 'bg-gray-600'
        }`}
      />
      <span className="text-sm text-gray-400">
        {isListening ? 'Ready to receive voice input' : 'Click the microphone to start'}
      </span>
    </div>
  );
}