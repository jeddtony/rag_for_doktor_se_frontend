// Dummy endpoint configuration - replace with your actual endpoint
const CHAT_API_ENDPOINT = import.meta.env.VITE_BACKEND_URL + '/api/v1/rag/query/';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  websiteUrls?: string[];
}

export interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
  language?: string;
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  websiteUrls?: string[];
  error?: string;
}

export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  try {
    const response = await fetch(CHAT_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: request.message,
        history: request.conversationHistory?.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        language: request.language || 'sv',
      }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: data.answer || 'I could not find an answer to your question.',
      websiteUrls: data.website_urls || [],
    };
  } catch (error) {
    console.error('Chat API error:', error);
    // For demo purposes, return a mock response
    return {
      success: true,
      message: 'This is a demo response. Connect your actual endpoint to get real answers about health articles from Kry.',
    };
  }
}
