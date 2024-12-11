export interface TarotCard {
  id: number;
  name: string;
  nameKo: string;
  suit: 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';
  image: string;
  emoji: string;
  meaning: {
    upright: string;
    reversed: string;
  };
  meaningKo: {
    upright: string;
    reversed: string;
  };
  keywords: string[];
  keywordsKo: string[];
}

export interface TarotSpread {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  descriptionKo: string;
  cardCount: number;
  positions: SpreadPosition[];
}

export interface SpreadPosition {
  id: number;
  name: string;
  nameKo: string;
  description: string;
  descriptionKo: string;
  x: number;
  y: number;
}

export interface TarotReading {
  id: string;
  question: string;
  spread: TarotSpread;
  drawnCards: DrawnCard[];
  timestamp: Date;
  aiInterpretation?: AITarotInterpretation;
}

export interface DrawnCard {
  card: TarotCard;
  position: SpreadPosition;
  isReversed: boolean;
}

export interface AITarotInterpretation {
  overallReading: string;
  cardInterpretations: {
    cardName: string;
    position: string;
    isReversed: boolean;
    interpretation: string;
    significance: string;
  }[];
  advice: string;
  summary: string;
}