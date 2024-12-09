import { Message } from '../types/message';

const API_KEY = process.env.VITE_OPENAI_API_KEY || '';

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class OpenAIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OpenAIError';
  }
}

let lastResponse = ''; // Son cevabı takip etmek için

export async function getOpenAIResponse(text: string): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Sen yardımcı bir asistansın. Lütfen kendini tekrar etmeden, doğrudan soruya odaklanarak yanıt ver. Her seferinde "Ben bir yapay zeka asistanıyım" gibi tanıtım cümleleri kullanma.',
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new OpenAIError(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as OpenAIResponse;
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new OpenAIError('Invalid response from OpenAI API');
    }

    // Eğer son cevapla aynıysa veya benzer bir tanıtım cümlesi içeriyorsa
    if (content === lastResponse || content.toLowerCase().includes('yapay zeka asistanı')) {
      return 'Nasıl yardımcı olabilirim?';
    }

    lastResponse = content;
    return content.trim();
  } catch (error) {
    if (error instanceof OpenAIError) {
      throw error;
    }
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new OpenAIError('Bağlantı hatası oluştu. Lütfen internet bağlantınızı kontrol edin.');
    }
    throw new OpenAIError('OpenAI ile iletişim sırasında beklenmeyen bir hata oluştu');
  }
} 