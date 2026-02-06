import { useState, useEffect, useRef } from 'react';

interface UseTypewriterOptions {
  /**
   * The text to type out
   */
  text: string;
  /**
   * Speed of typing in milliseconds per character (default: 20)
   */
  speed?: number;
  /**
   * Whether to start typing immediately (default: true)
   */
  autoStart?: boolean;
  /**
   * Callback when typing is complete
   */
  onComplete?: () => void;
}

/**
 * Hook that types out text character by character with a typewriter effect
 */
export function useTypewriter({ text, speed = 20, autoStart = true, onComplete }: UseTypewriterOptions) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousTextRef = useRef('');

  // Reset and start typing when text changes
  useEffect(() => {
    // Only reset if text actually changed
    if (text !== previousTextRef.current) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Reset state
      setDisplayedText('');
      setIsTyping(false);
      previousTextRef.current = text;

      // Start typing if autoStart is enabled and text is not empty
      if (autoStart && text.length > 0) {
        setIsTyping(true);
      }
    }
  }, [text, autoStart]);

  // Typing effect - incrementally add characters
  useEffect(() => {
    if (!isTyping) {
      return;
    }

    if (displayedText.length >= text.length) {
      // Typing complete
      setIsTyping(false);
      onComplete?.();
      return;
    }

    // Schedule next character
    timeoutRef.current = setTimeout(() => {
      setDisplayedText(text.slice(0, displayedText.length + 1));
    }, speed);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isTyping, displayedText, text, speed, onComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { displayedText, isTyping };
}
