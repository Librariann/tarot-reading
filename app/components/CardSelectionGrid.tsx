import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TarotCard } from '~/types/tarot';
import { tarotCards } from '~/data/tarotCards';

interface CardSelectionGridProps {
  requiredCount: number;
  onSelectionChange: (selectedCards: TarotCard[]) => void;
  onConfirm: (selectedCards: TarotCard[]) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function CardSelectionGrid({ 
  requiredCount, 
  onSelectionChange, 
  onConfirm,
  isLoading = false,
  error = null
}: CardSelectionGridProps) {
  const [isShuffling, setIsShuffling] = useState(true);
  const [shuffledCards, setShuffledCards] = useState<TarotCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [extractedCards, setExtractedCards] = useState<Set<number>>(new Set());
  const shuffleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced shuffle animation
  useEffect(() => {
    const shuffleArray = (array: TarotCard[]): TarotCard[] => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    // Initial setup
    setShuffledCards([...tarotCards]);

    // More realistic shuffle animation - faster intervals, multiple passes
    let shuffleCount = 0;
    const maxShuffles = 15;
    
    shuffleIntervalRef.current = setInterval(() => {
      setShuffledCards(prev => shuffleArray([...prev]));
      shuffleCount++;
      
      if (shuffleCount >= maxShuffles) {
        if (shuffleIntervalRef.current) {
          clearInterval(shuffleIntervalRef.current);
          shuffleIntervalRef.current = null;
        }
        setIsShuffling(false);
      }
    }, 150);

    return () => {
      if (shuffleIntervalRef.current) {
        clearInterval(shuffleIntervalRef.current);
      }
    };
  }, []);

  const handleCardClick = (card: TarotCard) => {
    if (isShuffling || extractedCards.has(card.id)) return;

    if (selectedCards.length < requiredCount) {
      // Select card and mark as extracted
      const newSelectedCards = [...selectedCards, card];
      const newExtractedCards = new Set(extractedCards).add(card.id);
      
      setSelectedCards(newSelectedCards);
      setExtractedCards(newExtractedCards);
      onSelectionChange(newSelectedCards);
    }
  };

  const isCardExtracted = (card: TarotCard) => {
    return extractedCards.has(card.id);
  };

  const canConfirm = selectedCards.length === requiredCount;

  return (
    <div className="w-full">
      {/* Shuffling Status */}
      <AnimatePresence>
        {isShuffling && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{ 
                rotateZ: 360,
                scale: [1, 1.2, 1] 
              }}
              transition={{ 
                rotateZ: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity }
              }}
              className="text-6xl mb-4"
            >
              🃏
            </motion.div>
            <p className="text-white text-lg">
              카드를 섞는 중...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Cards Display Area */}
      {!isShuffling && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-center mb-4">
            <p className="text-white text-lg mb-2">
              {requiredCount}장의 카드를 선택해주세요
            </p>
            <p className="text-purple-200 text-sm">
              선택된 카드: {selectedCards.length}/{requiredCount}
            </p>
          </div>

          {/* Selected Cards Row */}
          <div className="flex justify-center items-center gap-4 min-h-[180px] mb-8">
            {Array.from({ length: requiredCount }).map((_, index) => (
              <div key={index} className="relative">
                {selectedCards[index] ? (
                  <motion.div
                    initial={{ scale: 0.3, y: 300 }}
                    animate={{ 
                      scale: 1, 
                      y: 0
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 25,
                      delay: 0.1,
                      duration: 0.8
                    }}
                    className="w-24 h-36 rounded-xl border-2 border-yellow-400 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 shadow-2xl shadow-yellow-500/50 relative"
                  >
                    {/* Card back design - same as grid cards but with golden border */}
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl mb-2">🌟</div>
                        <div className="w-10 h-10 border-2 border-yellow-400/60 rounded-full mx-auto flex items-center justify-center">
                          <div className="w-5 h-5 bg-yellow-400/30 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Position number indicator */}
                    <div className="absolute -top-3 -left-3 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm border-2 border-white">
                      {index + 1}
                    </div>
                    
                    {/* Mystery glow effect */}
                    <div className="absolute inset-0 rounded-xl border-2 border-yellow-400/20 animate-pulse"></div>
                  </motion.div>
                ) : (
                  <div className="w-24 h-36 rounded-xl border-2 border-dashed border-white/30 bg-white/5 flex items-center justify-center">
                    <div className="text-white/50 text-sm text-center">
                      {index + 1}번째<br />카드
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Cards Grid - All Back Face */}
      <motion.div
        className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-11 gap-3 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: isShuffling ? 0.7 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {shuffledCards.map((card, index) => (
          <div key={card.id} className="relative">
            {isCardExtracted(card) ? (
              // Empty slot showing where the card was
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 1 }}
                className="w-16 h-24 sm:w-20 sm:h-32 rounded-lg border-2 border-dashed border-white/20 bg-transparent flex items-center justify-center"
              >
                <div className="text-center text-white/30">
                  <div className="text-lg sm:text-xl mb-1">✨</div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-dashed border-white/20 rounded-full mx-auto flex items-center justify-center">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white/10 rounded-full"></div>
                  </div>
                </div>
              </motion.div>
            ) : (
              // Available card
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0,
                  x: isShuffling ? Math.sin(Date.now() / 200 + index) * 3 : 0,
                  y: isShuffling ? Math.cos(Date.now() / 200 + index) * 3 : 0
                }}
                transition={{ 
                  delay: isShuffling ? 0 : index * 0.02,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                className={`relative cursor-pointer ${isShuffling ? 'pointer-events-none' : ''}`}
                onClick={() => handleCardClick(card)}
                whileHover={!isShuffling ? { scale: 1.1, y: -10 } : undefined}
                whileTap={!isShuffling ? { scale: 0.95 } : undefined}
              >
                {/* Card Back */}
                <div className="w-16 h-24 sm:w-20 sm:h-32 rounded-lg border-2 border-white/30 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 hover:border-white/60 transition-colors">
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl mb-1">🌟</div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-white/30 rounded-full mx-auto flex items-center justify-center">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white/20 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center mb-6"
          >
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-200">
              <p className="text-sm">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Button / Loading State */}
      <AnimatePresence>
        {!isShuffling && canConfirm && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="text-center"
          >
            {isLoading ? (
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg flex items-center justify-center gap-3"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="text-2xl"
                >
                  🔮
                </motion.div>
                <span>AI가 타로를 해석하는 중...</span>
              </motion.div>
            ) : (
              <motion.button
                onClick={() => onConfirm(selectedCards)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                disabled={isLoading}
              >
                선택 완료 - AI 타로 리딩 받기
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}