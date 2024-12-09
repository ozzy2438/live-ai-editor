import React, { useState, useEffect, useRef } from 'react';
import { User, Bot } from 'lucide-react';
import { Message } from '../../types/message';
import { CodeBlock } from '../UI/CodeBlock';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [displayText, setDisplayText] = useState('');
  const hasCodeBlock = message.text.includes('```');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= message.text.length) {
        setDisplayText(message.text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [message.text]);

  const renderContent = () => {
    if (hasCodeBlock) {
      const parts = message.text.split(/(```[\s\S]*?```)/);
      return parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const code = part.slice(3, -3);
          const language = code.split('\n')[0].trim();
          const codeContent = code.substring(code.indexOf('\n') + 1);
          return <CodeBlock key={index} language={language} code={codeContent} />;
        }
        return (
          <p key={index} className="text-gray-100">
            {part}
          </p>
        );
      });
    }
    return <p className="text-gray-100">{message.text}</p>;
  };

  return (
    <div className={`border-b border-gray-800`}>
      <div className={`${message.isUser ? 'bg-[#343541]' : 'bg-[#444654]'}`}>
        <div className="max-w-3xl mx-auto px-4 py-6 flex gap-6">
          <div className="flex-shrink-0">
            {message.isUser ? (
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-gray-100 typing-effect">
              {displayText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}