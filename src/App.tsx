import React from 'react';
import { SpeechRecognizer } from './components/SpeechRecognition/SpeechRecognizer';
import { MessageCircle } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <header className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Speech Assistant</h1>
              <p className="mt-1 text-gray-400">Start speaking to see your words appear in real-time</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <SpeechRecognizer />
      </main>
    </div>
  );
}

export default App;