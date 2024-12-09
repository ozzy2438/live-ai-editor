import { useState, useCallback, useEffect, useRef } from 'react';

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: {
    transcript: string;
  };
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionConstructor {
  new (): ISpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const processingRef = useRef(false);
  const lastProcessedText = useRef('');

  const isSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

  useEffect(() => {
    if (!isSupported) return;

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'tr-TR';
      recognition.maxAlternatives = 1;
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        if (processingRef.current) return;

        let interim = '';
        let final = '';

        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (interim && interim !== interimTranscript) {
          setInterimTranscript(interim);
        }
        
        if (final && final !== lastProcessedText.current) {
          lastProcessedText.current = final;
          processingRef.current = true;
          setTranscript(final);
          processingRef.current = false;
          
          recognition.stop();
          setTimeout(() => {
            if (recognitionRef.current) {
              recognition.start();
            }
          }, 100);
        }
      };

      recognition.onerror = () => {
        setError('Ses tanıma hatası oluştu');
      };

      recognition.onend = () => {
        setInterimTranscript('');
        processingRef.current = false;
      };

      recognitionRef.current = recognition;

      return () => {
        recognition.stop();
      };
    } catch {
      setError('Ses tanıma başlatılamadı');
    }
  }, [isSupported]);

  const start = useCallback(() => {
    setError(null);
    setInterimTranscript('');
    processingRef.current = false;
    recognitionRef.current?.start();
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  return {
    isSupported,
    transcript,
    interimTranscript,
    error,
    start,
    stop,
  };
}