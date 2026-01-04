// Timer Component
// Displays a countdown timer for ALMOST_FREE tables
// Uses setInterval to update every second

import { useState, useEffect } from 'react';

interface TimerProps {
  endTime: number;  // Timestamp when timer should end
  onExpire?: () => void;  // Callback when timer expires
  className?: string;
}

export function Timer({ endTime, onExpire, className = '' }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    // Calculate initial time left
    const calculateTimeLeft = () => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      return remaining;
    };

    setTimeLeft(calculateTimeLeft());

    // Update every second
    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      // Check if timer has expired
      if (remaining <= 0) {
        clearInterval(interval);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, onExpire]);

  // Format time as MM:SS
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`font-mono text-lg font-bold ${className}`}>
      {formatTime(timeLeft)}
    </div>
  );
}
