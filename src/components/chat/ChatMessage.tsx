import { cn } from '@/lib/utils';
import { User, Bot, ExternalLink } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
  websiteUrls?: string[];
}

export function ChatMessage({ role, content, isLoading, websiteUrls }: ChatMessageProps) {
  const isUser = role === 'user';

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
          <div className="flex gap-1.5 py-1">
            <span className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.3s] opacity-60" />
            <span className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.15s] opacity-60" />
            <span className="w-2 h-2 rounded-full bg-current animate-bounce opacity-60" />
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
            {websiteUrls && websiteUrls.length > 0 && (
              <div className="pt-2 border-t border-border/50 space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Related articles:</p>
                <div className="flex flex-col gap-1.5">
                  {websiteUrls.map((url, index) => (
                    <a
                      key={index}
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
