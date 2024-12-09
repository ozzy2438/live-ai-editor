import React from 'react';

interface TranscriptListProps {
  transcripts: string[];
}

export function TranscriptList({ transcripts }: TranscriptListProps) {
  if (transcripts.length === 0) return null;

  return (
    <div className="w-full">
      <h3 className="font-semibold mb-4">Previous Transcripts:</h3>
      <div className="space-y-3">
        {transcripts.map((text, index) => (
          <div
            key={index}
            className="p-3 bg-white rounded-lg shadow-sm border border-gray-100"
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}