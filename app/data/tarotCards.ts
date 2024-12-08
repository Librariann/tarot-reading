import type { TarotCard } from '~/types/tarot';

export const tarotCards: TarotCard[] = [
  // Major Arcana
  {
    id: 0,
    name: 'The Fool',
    nameKo: '바보',
    suit: 'major',
    image: '/tarot_card/0_the_fool.png',
    emoji: '🃏',
    meaning: {
      upright: 'New beginnings, spontaneity, innocence, free spirit',
      reversed: 'Recklessness, taken advantage of, inconsideration'
    },
    meaningKo: {
      upright: '새로운 시작, 자발성, 순수함, 자유로운 영혼',
      reversed: '무모함, 이용당함, 경솔함'
    },
    keywords: ['new beginnings', 'innocence', 'adventure'],
    keywordsKo: ['새로운 시작', '순수함', '모험']
  },
  {
    id: 1,
    name: 'The Magician',
    nameKo: '마법사',
    suit: 'major',
    image: '/tarot_card/1_the_magacian.png',
    emoji: '🎩',
    meaning: {
      upright: 'Manifestation, resourcefulness, power, inspired action',
      reversed: 'Manipulation, poor planning, untapped talents'
    },
    meaningKo: {
      upright: '현실화, 수완, 힘, 영감을 받은 행동',
      reversed: '조작, 부실한 계획, 활용되지 않은 재능'
    },
    keywords: ['manifestation', 'willpower', 'desire'],
    keywordsKo: ['현실화', '의지력', '욕망']
  },
  {
    id: 2,
    name: 'The High Priestess',
    nameKo: '여교황',
    suit: 'major',
    image: '/tarot_card/2_the_highpriestess.png',
    emoji: '🌙',
    meaning: {
      upright: 'Intuition, sacred knowledge, divine feminine, subconscious mind',
      reversed: 'Secrets, disconnected from intuition, withdrawal'
    },
    meaningKo: {
      upright: '직감, 신성한 지식, 신성한 여성성, 무의식',
      reversed: '비밀, 직관과의 단절, 은둔'
    },
    keywords: ['intuition', 'mystery', 'subconscious'],
    keywordsKo: ['직관', '신비', '무의식']
  },
  {
    id: 3,
    name: 'The Empress',
    nameKo: '여황제',
    suit: 'major',
    image: '/tarot_card/3_the_empress.png',
    emoji: '👑',
    meaning: {
      upright: 'Femininity, beauty, nature, nurturing, abundance',
      reversed: 'Creative block, dependence on others'
    },
    meaningKo: {
      upright: '여성성, 아름다움, 자연, 양육, 풍요로움',
      reversed: '창조적 막힘, 타인 의존'
    },
    keywords: ['abundance', 'nurturing', 'fertility'],
    keywordsKo: ['풍요', '양육', '다산']
  },
  {
    id: 4,
    name: 'The Emperor',
    nameKo: '황제',
    suit: 'major',
    image: '/tarot_card/4_the_emperor.png',
    emoji: '🏛️',
    meaning: {
      upright: 'Authority, establishment, structure, father figure',
      reversed: 'Domination, excessive control, lack of discipline'
    },
    meaningKo: {
      upright: '권위, 확립, 구조, 아버지상',
      reversed: '지배, 과도한 통제, 규율 부족'
    },
    keywords: ['authority', 'structure', 'control'],
    keywordsKo: ['권위', '구조', '통제']
  },
  {
    id: 5,
    name: 'The Hierophant',
    nameKo: '교황',
    suit: 'major',
    image: '/tarot_card/5_the_hierophant.png',
    emoji: '⛪',
    meaning: {
      upright: 'Spiritual wisdom, religious beliefs, conformity, tradition',
      reversed: 'Personal beliefs, freedom, challenging the status quo'
    },
    meaningKo: {
      upright: '영적 지혜, 종교적 믿음, 순응, 전통',
      reversed: '개인적 믿음, 자유, 기존 질서에 도전'
    },
    keywords: ['tradition', 'conformity', 'morality'],
    keywordsKo: ['전통', '순응', '도덕성']
  },
  {
    id: 6,
    name: 'The Lovers',
    nameKo: '연인',
    suit: 'major',
    image: '/tarot_card/6_the_lovers.png',
    emoji: '💑',
    meaning: {
      upright: 'Love, harmony, relationships, values alignment',
      reversed: 'Self-love, disharmony, imbalance, misalignment'
    },
    meaningKo: {
      upright: '사랑, 조화, 관계, 가치 일치',
      reversed: '자기애, 불화, 불균형, 불일치'
    },
    keywords: ['love', 'relationships', 'choices'],
    keywordsKo: ['사랑', '관계', '선택']
  },
  {
    id: 7,
    name: 'The Chariot',
    nameKo: '전차',
    suit: 'major',
    image: '/tarot_card/7_the_chariot.png',
    emoji: '🏎️',
    meaning: {
      upright: 'Control, willpower, success, determination',
      reversed: 'Self-discipline, opposition, lack of direction'
    },
    meaningKo: {
      upright: '통제, 의지력, 성공, 결의',
      reversed: '자제력, 반대, 방향성 부족'
    },
    keywords: ['willpower', 'determination', 'control'],
    keywordsKo: ['의지력', '결의', '통제']
  },
  {
    id: 8,
    name: 'Strength',
    nameKo: '힘',
    suit: 'major',
    image: '/tarot_card/8_strength.png',
    emoji: '🦁',
    meaning: {
      upright: 'Strength, courage, persuasion, influence, compassion',
      reversed: 'Self-doubt, lack of confidence, low energy'
    },
    meaningKo: {
      upright: '힘, 용기, 설득, 영향력, 연민',
      reversed: '자기 의심, 자신감 부족, 저에너지'
    },
    keywords: ['inner strength', 'bravery', 'compassion'],
    keywordsKo: ['내적 힘', '용기', '연민']
  },
  {
    id: 9,
    name: 'The Hermit',
    nameKo: '은둔자',
    suit: 'major',
    image: '/tarot_card/9_the_hermit.png',
    emoji: '🎆',
    meaning: {
      upright: 'Soul searching, introspection, being alone, inner guidance',
      reversed: 'Isolation, loneliness, withdrawal'
    },
    meaningKo: {
      upright: '영혼 탐색, 성찰, 고독, 내적 안내',
      reversed: '고립, 외로움, 철수'
    },
    keywords: ['introspection', 'search for truth', 'inner guidance'],
    keywordsKo: ['성찰', '진실 탐구', '내적 안내']
  },
  {
    id: 10,
    name: 'Wheel of Fortune',
    nameKo: '운명의 수레바퀴',
    suit: 'major',
    image: '/tarot_card/10_the_wheel_of_fortune.png',
    emoji: '🎰',
    meaning: {
      upright: 'Good luck, karma, life cycles, destiny, turning point',
      reversed: 'Bad luck, lack of control, clinging to control'
    },
    meaningKo: {
      upright: '행운, 카르마, 생명의 순환, 운명, 전환점',
      reversed: '불운, 통제력 부족, 통제에 집착'
    },
    keywords: ['fate', 'luck', 'cycles'],
    keywordsKo: ['운명', '행운', '순환']
  },
  {
    id: 11,
    name: 'Justice',
    nameKo: '정의',
    suit: 'major',
    image: '/tarot_card/11_justice.png',
    emoji: '⚖️',
    meaning: {
      upright: 'Justice, fairness, truth, cause and effect, law',
      reversed: 'Unfairness, lack of accountability, dishonesty'
    },
    meaningKo: {
      upright: '정의, 공정함, 진실, 인과응보, 법',
      reversed: '불공정, 책임감 부족, 부정직'
    },
    keywords: ['justice', 'balance', 'truth'],
    keywordsKo: ['정의', '균형', '진실']
  },
  {
    id: 12,
    name: 'The Hanged Man',
    nameKo: '매달린 사람',
    suit: 'major',
    image: '/tarot_card/12_the_hangman.png',
    emoji: '😵',
    meaning: {
      upright: 'Suspension, restriction, letting go, sacrifice',
      reversed: 'Martyrdom, indecision, delay'
    },
    meaningKo: {
      upright: '정지, 제한, 놓아버림, 희생',
      reversed: '순교, 우유부단, 지연'
    },
    keywords: ['sacrifice', 'waiting', 'letting go'],
    keywordsKo: ['희생', '기다림', '놓아버림']
  },
  {
    id: 13,
    name: 'Death',
    nameKo: '죽음',
    suit: 'major',
    image: '/tarot_card/13_death.png',
    emoji: '☠️',
    meaning: {
      upright: 'Endings, beginnings, change, transformation, transition',
      reversed: 'Resistance to change, personal transformation, inner purging'
    },
    meaningKo: {
      upright: '끝, 시작, 변화, 변환, 전환',
      reversed: '변화에 대한 저항, 개인적 변화, 내적 정화'
    },
    keywords: ['transformation', 'change', 'endings'],
    keywordsKo: ['변화', '전환', '끝']
  },
  {
    id: 14,
    name: 'Temperance',
    nameKo: '절제',
    suit: 'major',
    image: '/tarot_card/14_temperance.png',
    emoji: '♾️',
    meaning: {
      upright: 'Balance, moderation, patience, purpose',
      reversed: 'Imbalance, excess, self-healing, re-alignment'
    },
    meaningKo: {
      upright: '균형, 절제, 인내, 목적',
      reversed: '불균형, 과도함, 자기치유, 재정렬'
    },
    keywords: ['balance', 'moderation', 'patience'],
    keywordsKo: ['균형', '절제', '인내']
  },
  {
    id: 15,
    name: 'The Devil',
    nameKo: '악마',
    suit: 'major',
    image: '/tarot_card/15_the_devil.png',
    emoji: '😈',
    meaning: {
      upright: 'Bondage, addiction, sexuality, materialism',
      reversed: 'Liberation, independence, overcoming addiction'
    },
    meaningKo: {
      upright: '속박, 중독, 성적 욕망, 물질주의',
      reversed: '해방, 독립, 중독 극복'
    },
    keywords: ['temptation', 'bondage', 'materialism'],
    keywordsKo: ['유혹', '속박', '물질주의']
  },
  {
    id: 16,
    name: 'The Tower',
    nameKo: '탑',
    suit: 'major',
    image: '/tarot_card/16_the_tower.png',
    emoji: '🏰',
    meaning: {
      upright: 'Sudden change, upheaval, chaos, revelation, awakening',
      reversed: 'Personal transformation, fear of change, averting disaster'
    },
    meaningKo: {
      upright: '갑작스러운 변화, 격변, 혼돈, 계시, 각성',
      reversed: '개인적 변화, 변화에 대한 두려움, 재난 회피'
    },
    keywords: ['upheaval', 'awakening', 'chaos'],
    keywordsKo: ['격변', '각성', '혼돈']
  },
  {
    id: 17,
    name: 'The Star',
    nameKo: '별',
    suit: 'major',
    image: '/tarot_card/17_the_star.png',
    emoji: '⭐',
    meaning: {
      upright: 'Hope, faith, purpose, renewal, spirituality',
      reversed: 'Lack of faith, despair, self-trust, disconnection'
    },
    meaningKo: {
      upright: '희망, 믿음, 목적, 갱신, 영성',
      reversed: '믿음 부족, 절망, 자기 신뢰, 단절'
    },
    keywords: ['hope', 'guidance', 'inspiration'],
    keywordsKo: ['희망', '안내', '영감']
  },
  {
    id: 18,
    name: 'The Moon',
    nameKo: '달',
    suit: 'major',
    image: '/tarot_card/18_the_moon.png',
    emoji: '🌜',
    meaning: {
      upright: 'Illusion, fear, anxiety, subconscious, intuition',
      reversed: 'Release of fear, repressed emotion, inner confusion'
    },
    meaningKo: {
      upright: '환상, 두려움, 불안, 무의식, 직감',
      reversed: '두려움의 해방, 억압된 감정, 내적 혼란'
    },
    keywords: ['illusion', 'intuition', 'subconscious'],
    keywordsKo: ['환상', '직감', '무의식']
  },
  {
    id: 19,
    name: 'The Sun',
    nameKo: '태양',
    suit: 'major',
    image: '/tarot_card/19_the_sun.png',
    emoji: '☀️',
    meaning: {
      upright: 'Positivity, fun, warmth, success, vitality',
      reversed: 'Inner child, feeling down, overly optimistic'
    },
    meaningKo: {
      upright: '긍정, 즐거움, 따뜻함, 성공, 활력',
      reversed: '내면의 아이, 우울함, 지나친 낙관'
    },
    keywords: ['joy', 'success', 'positivity'],
    keywordsKo: ['기쁨', '성공', '긍정']
  },
  {
    id: 20,
    name: 'Judgement',
    nameKo: '심판',
    suit: 'major',
    image: '/tarot_card/20_judgement.png',
    emoji: '🎺',
    meaning: {
      upright: 'Judgement, rebirth, inner calling, absolution',
      reversed: 'Self-doubt, inner critic, ignoring the call'
    },
    meaningKo: {
      upright: '심판, 재생, 내적 소명, 사면',
      reversed: '자기 의심, 내면의 비판자, 소명 무시'
    },
    keywords: ['rebirth', 'inner calling', 'absolution'],
    keywordsKo: ['재생', '내적 소명', '사면']
  },
  {
    id: 21,
    name: 'The World',
    nameKo: '세계',
    suit: 'major',
    image: '/tarot_card/21_the_world.png',
    emoji: '🌍',
    meaning: {
      upright: 'Completion, accomplishment, travel, fulfillment',
      reversed: 'Seeking personal closure, short-cut to success'
    },
    meaningKo: {
      upright: '완성, 성취, 여행, 성취감',
      reversed: '개인적 마무리 추구, 성공의 지름길'
    },
    keywords: ['completion', 'accomplishment', 'fulfillment'],
    keywordsKo: ['완성', '성취', '성취감']
  }
];