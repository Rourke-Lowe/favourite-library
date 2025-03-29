// src/components/shows/DateDisplay.tsx
import React from 'react';

interface DateDisplayProps {
  dateString: string;
}

export const DateDisplay: React.FC<DateDisplayProps> = ({ dateString }) => {
  const date = new Date(dateString);
  
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  
  return (
    <div className="flex flex-col items-center text-center">
      <span className="text-xs font-mono uppercase tracking-wider text-surface-500">{month}</span>
      <span className="text-xl font-display">{day}</span>
      <span className="text-xs text-surface-500">{year}</span>
    </div>
  );
};

// Function to calculate time left until an event
export function calculateTimeLeft(dateString: string) {
  const difference = new Date(dateString).getTime() - new Date().getTime();
  
  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };
  
  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }
  
  return timeLeft;
}

// Simple formatting function that returns a string
export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'long', 
    day: 'numeric', 
    year: 'numeric'
  });
}