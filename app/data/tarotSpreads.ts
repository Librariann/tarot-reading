import type { TarotSpread } from '~/types/tarot';

export const tarotSpreads: TarotSpread[] = [
  {
    id: 'one-oracle',
    name: 'One Oracle',
    nameKo: '원 오라클',
    description: 'A single card reading for quick insight and guidance',
    descriptionKo: '빠른 통찰과 안내를 위한 한 장 카드 리딩',
    cardCount: 1,
    positions: [
      {
        id: 1,
        name: 'Oracle',
        nameKo: '오라클',
        description: 'The main message or guidance for your question',
        descriptionKo: '당신의 질문에 대한 주요 메시지나 안내',
        x: 50,
        y: 50
      }
    ]
  },
  {
    id: 'three-card',
    name: 'Three Card Spread',
    nameKo: '쓰리 카드 스프레드',
    description: 'Past, Present, and Future insights',
    descriptionKo: '과거, 현재, 미래에 대한 통찰',
    cardCount: 3,
    positions: [
      {
        id: 1,
        name: 'Past',
        nameKo: '과거',
        description: 'Past influences affecting your current situation',
        descriptionKo: '현재 상황에 영향을 미치는 과거의 요인들',
        x: 20,
        y: 50
      },
      {
        id: 2,
        name: 'Present',
        nameKo: '현재',
        description: 'Your current situation and state of mind',
        descriptionKo: '현재의 상황과 마음 상태',
        x: 50,
        y: 50
      },
      {
        id: 3,
        name: 'Future',
        nameKo: '미래',
        description: 'Potential outcomes and future possibilities',
        descriptionKo: '가능한 결과와 미래의 가능성들',
        x: 80,
        y: 50
      }
    ]
  }
];