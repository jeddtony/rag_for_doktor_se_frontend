import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { sendChatMessage, type ChatMessage as ChatMessageType } from '@/lib/api/chat';
import { Heart, Stethoscope, Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export function ChatInterface() {
  const { language, setLanguage, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message when language changes
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessageType = {
        id: 'welcome',
        role: 'assistant',
        content: t.welcomeMessage,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    } else if (messages[0]?.id === 'welcome') {
      // Update welcome message if language changes
      setMessages((prev) => {
        const updated = [...prev];
        updated[0] = {
          ...updated[0],
          content: t.welcomeMessage,
        };
        return updated;
      });
    }
  }, [language, t.welcomeMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage({
        message: content,
        conversationHistory: messages,
        language: language,
      });

      const assistantMessage: ChatMessageType = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.message || t.errorNoAnswer,
        timestamp: new Date(),
        websiteUrls: response.websiteUrls,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessageType = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: t.errorSomethingWentWrong,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sv' : 'en');
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-4 bg-card border-b border-border">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Stethoscope className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-semibold text-foreground">{t.title}</h1>
          <p className="text-xs text-muted-foreground">{t.subtitle}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            onClick={toggleLanguage}
            variant="ghost"
            size="sm"
            className="h-9 px-3 gap-2"
            title={language === 'en' ? 'Switch to Swedish' : 'Växla till engelska'}
          >
            <Languages className="w-4 h-4" />
            <span className="text-xs font-medium">{language.toUpperCase()}</span>
          </Button>
          <Heart className="w-5 h-5 text-primary" />
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
            websiteUrls={message.websiteUrls}
          />
        ))}
        {isLoading && (
          <ChatMessage role="assistant" content="" isLoading />
        )}
        
        {/* Suggested questions - show only when no user messages yet */}
        {messages.length === 1 && !isLoading && (
          <div className="pt-4 space-y-2">
            <p className="text-xs text-muted-foreground text-center">{t.popularQuestions}</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {t.suggestedQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="px-4 py-2 text-sm bg-accent hover:bg-accent/80 text-accent-foreground rounded-full transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSendMessage} isLoading={isLoading} placeholder={t.inputPlaceholder} />
    </div>
  );
}
