import { useState, useCallback } from 'react';
import type { TarotSpread, TarotReading, DrawnCard } from '~/types/tarot';
import { tarotCards } from '~/data/tarotCards';
import { useTarotContext } from './TarotContext';

export const useTarotReading = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const { addReading } = useTarotContext();

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const drawCards = useCallback(async (question: string, spread: TarotSpread): Promise<TarotReading> => {
    setIsDrawing(true);
    
    // Simulate card drawing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const shuffledCards = shuffleArray(tarotCards);
    const selectedCards = shuffledCards.slice(0, spread.cardCount);
    
    const drawnCards: DrawnCard[] = selectedCards.map((card, index) => ({
      card,
      position: spread.positions[index],
      isReversed: Math.random() < 0.3 // 30% chance of reversed card
    }));

    const reading: TarotReading = {
      id: Date.now().toString(),
      question,
      spread,
      drawnCards,
      timestamp: new Date()
    };

    addReading(reading);
    setIsDrawing(false);
    
    return reading;
  }, [addReading]);

  return {
    isDrawing,
    drawCards
  };
};