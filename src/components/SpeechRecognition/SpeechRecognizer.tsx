import React, { useState, useCallback, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { ChatMessage } from '../Chat/ChatMessage';
import { getOpenAIResponse, OpenAIError } from '../../services/openai';
import { Message } from '../../types/message';

export function SpeechRecognizer() {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { transcript, interimTranscript, isSupported, start, stop } = useSpeechRecognition();

  const handleSpeechInput = useCallback(async (text: string) => {
    try {
      setIsProcessing(true);
      
      const userMessage: Message = {
        id: Date.now().toString(),
        text,
        isUser: true,
        language: 'en',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, userMessage]);

      const response = await getOpenAIResponse(text);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        language: 'en',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = err instanceof OpenAIError 
        ? err.message 
        : 'An unexpected error occurred';
      
      const errorAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        isUser: false,
        language: 'en',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, errorAiMessage]);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  useEffect(() => {
    if (transcript) {
      handleSpeechInput(transcript);
    }
  }, [transcript, handleSpeechInput]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stop();
      setIsListening(false);
    } else {
      start();
      setIsListening(true);
    }
  }, [isListening, start, stop]);

  if (!isSupported) {
    return (
      <div className="text-center p-4 bg-red-50 text-red-600 rounded-lg">
        Speech recognition is not supported in your browser.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#343541]">
      <div className="max-w-3xl mx-auto">
        <div className="sticky top-0 z-10 bg-[#343541] border-b border-gray-800 p-4">
          <h2 className="text-xl font-semibold text-gray-200 text-center">Speech Assistant</h2>
          
          <div className="flex justify-center mt-4">
            <button
              onClick={toggleListening}
              disabled={isProcessing}
              className={`p-4 rounded-lg transition-all ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isListening ? (
                <MicOff className="w-6 h-6 text-white" />
              ) : (
                <Mic className="w-6 h-6 text-white" />
              )}
            </button>
          </div>

          {(isListening || isProcessing) && (
            <div className="text-center mt-4">
              <div className="flex items-center justify-center gap-2 text-gray-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isListening ? 'Listening...' : 'Processing...'}</span>
              </div>
              {interimTranscript && (
                <p className="text-gray-400 mt-2">{interimTranscript}</p>
              )}
            </div>
          )}
        </div>

        <div className="pb-32">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </div>
    </div>
  );
}