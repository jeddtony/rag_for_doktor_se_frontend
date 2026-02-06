import { cn } from '@/lib/utils';
import { User, Bot, ExternalLink } from 'lucide-react';
import { useRotatingMessage } from '@/hooks/use-rotating-message';
import { useTypewriter } from '@/hooks/use-typewriter';

interface ChatMessageProps {
  readonly role: 'user' | 'assistant';
  readonly content: string;
  readonly isLoading?: boolean;
  readonly websiteUrls?: string[];
  readonly loadingMessages?: string[];
  readonly enableTyping?: boolean;
}

export function ChatMessage({ role, content, isLoading, websiteUrls, loadingMessages = [], enableTyping = false }: ChatMessageProps) {
  const isUser = role === 'user';
  const rotatingMessage = useRotatingMessage(loadingMessages, 2000, isLoading);
  
  // Use typewriter effect for assistant messages when enabled
  const shouldType = !isUser && !isLoading && enableTyping && content.length > 0;
  const { displayedText, isTyping } = useTypewriter({
    text: content,
    speed: 20,
    autoStart: shouldType,
  });
  
  // Use typed text when typing is enabled, otherwise use full content
  const displayContent = shouldType ? displayedText : content;

  return (
    <div
      className={cn(
        'flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
        )}
      >
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'bg-muted text-foreground rounded-tl-sm'
        )}
      >
        {isLoading ? (
          <div className="flex items-center gap-2 py-1">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.3s] opacity-60" />
              <span className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.15s] opacity-60" />
              <span className="w-2 h-2 rounded-full bg-current animate-bounce opacity-60" />
            </div>
            {rotatingMessage && (
              <span className="text-sm text-muted-foreground animate-in fade-in duration-300">
                {rotatingMessage}
              </span>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {displayContent}
              {shouldType && isTyping && (
                <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
              )}
            </p>
            {websiteUrls && websiteUrls.length > 0 && !isTyping && (
              <div className="pt-2 border-t border-border/50 space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Related articles:</p>
                <div className="flex flex-col gap-1.5">
                  {websiteUrls.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:text-primary/80 flex items-center gap-1.5 transition-colors group"
                    >
                      <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                      <span className="truncate">{url}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
