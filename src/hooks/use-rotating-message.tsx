import { useState, useEffect } from 'react';

/**
 * Hook that rotates through an array of messages at a specified interval
 * @param messages Array of messages to rotate through
 * @param intervalMs Interval in milliseconds between rotations (default: 2000)
 * @param isActive Whether the rotation should be active
 */
export function useRotatingMessage(messages: string[], intervalMs: number = 2000, isActive: boolean = true) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isActive || messages.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [messages.length, intervalMs, isActive]);

  // Reset to first message when messages change or when activation changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [messages, isActive]);

  return messages[currentIndex] || messages[0] || '';
}
