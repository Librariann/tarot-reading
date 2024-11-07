import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { TarotReading } from '~/types/tarot';

interface TarotContextType {
  readings: Map<string, TarotReading>;
  addReading: (reading: TarotReading) => void;
  getReading: (id: string) => TarotReading | undefined;
  clearReadings: () => void;
}

const TarotContext = createContext<TarotContextType | undefined>(undefined);

export function TarotProvider({ children }: { children: ReactNode }) {
  const [readings, setReadings] = useState<Map<string, TarotReading>>(new Map());

  const addReading = (reading: TarotReading) => {
    setReadings(prev => new Map(prev).set(reading.id, reading));
  };

  const getReading = (id: string) => {
    return readings.get(id);
  };

  const clearReadings = () => {
    setReadings(new Map());
  };

  return (
    <TarotContext.Provider value={{ readings, addReading, getReading, clearReadings }}>
      {children}
    </TarotContext.Provider>
  );
}

export function useTarotContext() {
  const context = useContext(TarotContext);
  if (context === undefined) {
    throw new Error('useTarotContext must be used within a TarotProvider');
  }
  return context;
}