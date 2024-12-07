import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TarotCard } from "~/types/tarot";
import { tarotCards } from "~/data/tarotCards";

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
  error = null,
}: CardSelectionGridProps) {
  const [shufflePhase, setShufflePhase] = useState<
    "hindu-shuffle" | "distributing" | "ready"
  >("hindu-shuffle");
  const [shuffledCards, setShuffledCards] = useState<TarotCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [extractedCards, setExtractedCards] = useState<Set<number>>(new Set());
  const shuffleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Hindu shuffle and card distribution animation
  useEffect(() => {
    const shuffleArray = (array: TarotCard[]): TarotCard[] => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    // Phase 1: Hindu shuffle animation (3초)
    if (shufflePhase === "hindu-shuffle") {
      setTimeout(() => {
        setShufflePhase("distributing");
        const finalShuffled = shuffleArray([...tarotCards]);
        setShuffledCards(finalShuffled);
      }, 3000);
    }

    // Phase 2: Card distribution animation (2초)
    if (shufflePhase === "distributing") {
      setTimeout(() => {
        setShufflePhase("ready");
      }, 2000);
    }

    return () => {
      if (shuffleIntervalRef.current) {
        clearInterval(shuffleIntervalRef.current);
      }
    };
  }, [shufflePhase]);

  const handleCardClick = (card: TarotCard) => {
    if (shufflePhase !== "ready" || extractedCards.has(card.id)) return;

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
        {shufflePhase === "hindu-shuffle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center mb-8"
          >
            <div className="relative flex justify-center items-center h-48 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 rounded-2xl p-8 shadow-2xl">
              {/* Hindu Shuffle Packets */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-16 h-24 rounded-xl bg-white border-2 border-slate-200 shadow-lg"
                  initial={{ x: -80, y: 0, rotate: 0 }}
                  animate={{
                    x: [-80, -80, 80, 80, -80],
                    y: [0, -30, -30, 0, 0],
                    rotate: [0, -3, 0, 1.5, 0],
                  }}
                  transition={{
                    duration: 2.7,
                    repeat: Infinity,
                    delay: i * 0.12,
                    ease: "easeInOut",
                  }}
                  style={{
                    background: `linear-gradient(to bottom, #ffffff 0px, #ffffff 8px, #f8fafc 8px, #f8fafc 16px)`,
                    boxShadow:
                      "0 1px 0 rgba(0,0,0,.05), 0 8px 16px rgba(0,0,0,.25)",
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      background: `
                        radial-gradient(40% 35% at 70% 30%, rgba(0,0,0,.06), rgba(0,0,0,0)),
                        linear-gradient(to top, rgba(0,0,0,.08), rgba(0,0,0,0) 28%),
                        linear-gradient(to bottom, rgba(0,0,0,.03), rgba(0,0,0,0) 40%)
                      `,
                    }}
                  />
                </motion.div>
              ))}
            </div>

            <motion.p
              className="text-white text-lg mt-4"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              카드를 셔플하는 중... ✨
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Distribution to Selection Transition */}
      <AnimatePresence>
        {(shufflePhase === "distributing" || shufflePhase === "ready") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            {shufflePhase === "distributing" && (
              <motion.p
                className="text-white text-lg text-center mb-4"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                exit={{ opacity: 0 }}
              >
                카드를 배치하는 중...
              </motion.p>
            )}

            {/* Instruction Text - appears smoothly after distribution */}
            {shufflePhase === "ready" && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }} // 배치 애니메이션이 끝난 후에 나타남
                className="text-center mb-8"
              >
                <p className="text-white text-lg mb-2">
                  {requiredCount}장의 카드를 선택해주세요
                </p>
                <p className="text-purple-200 text-sm">
                  선택된 카드: {selectedCards.length}/{requiredCount}
                </p>
              </motion.div>
            )}

            {/* Selected Cards Row - appears when ready */}
            {shufflePhase === "ready" && (
              <motion.div
                initial={{ 
                  opacity: 0, 
                  height: 0,
                  scaleY: 0,
                  y: -20
                }}
                animate={{ 
                  opacity: 1, 
                  height: "auto",
                  scaleY: 1,
                  y: 0
                }}
                transition={{ 
                  delay: 2,
                  duration: 0.6,
                  height: { duration: 0.5 },
                  scaleY: { duration: 0.5 },
                  opacity: { duration: 0.3, delay: 2.2 },
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="flex justify-center items-center gap-4 min-h-[180px] mb-8"
                style={{ originY: 0 }}
              >
                {Array.from({ length: requiredCount }).map((_, index) => (
                  <div key={index} className="relative">
                    {selectedCards[index] ? (
                      <motion.div
                        initial={{ scale: 0.3, y: 300 }}
                        animate={{
                          scale: 1,
                          y: 0,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 25,
                          delay: 0.1,
                          duration: 0.8,
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
                          {index + 1}번째
                          <br />
                          카드
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}

            {/* Cards Grid - 배치에서 선택으로 자연스럽게 전환 */}
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-11 gap-3">
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
                    <motion.div
                      className="relative"
                      initial={{
                        opacity: 0,
                        scale: 0,
                        rotate: 180,
                        x: -200,
                        y: -150,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        rotate: [180, 5, -2, 0],
                        x: 0,
                        y: [0, -5, 0], // 살짝 튀어오르는 효과
                      }}
                      transition={{
                        delay: index * 0.06,
                        duration: 1.2,
                        opacity: { duration: 0.3, delay: index * 0.06 },
                        scale: { duration: 0.8, delay: index * 0.06 },
                        rotate: { 
                          duration: 1.0, 
                          delay: index * 0.06,
                          ease: [0.175, 0.885, 0.32, 1.275] // 자연스러운 회전
                        },
                        x: { 
                          duration: 1.0, 
                          delay: index * 0.06, 
                          ease: [0.23, 1, 0.32, 1] // 부드러운 수평 이동
                        },
                        y: { 
                          duration: 1.2, 
                          delay: index * 0.06,
                          ease: [0.34, 1.56, 0.64, 1], // 바운스 효과
                          times: [0, 0.6, 1] // 키프레임 타이밍
                        }
                      }}
                      onClick={() =>
                        shufflePhase === "ready" && handleCardClick(card)
                      }
                      whileHover={
                        shufflePhase === "ready" ? { scale: 1.1, y: -10 } : {}
                      }
                      whileTap={shufflePhase === "ready" ? { scale: 0.95 } : {}}
                      style={{
                        cursor:
                          shufflePhase === "ready" ? "pointer" : "default",
                      }}
                    >
                      {/* Card Back */}
                      <motion.div
                        className="w-16 h-24 sm:w-20 sm:h-32 rounded-lg border-2 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 transition-all duration-500"
                        animate={{
                          borderColor:
                            shufflePhase === "ready"
                              ? "rgba(255, 255, 255, 0.6)"
                              : "rgba(255, 255, 255, 0.3)",
                          boxShadow:
                            shufflePhase === "ready"
                              ? "0 4px 16px rgba(255, 255, 255, 0.2), 0 0 20px rgba(168, 85, 247, 0.3)"
                              : "0 4px 16px rgba(0, 0, 0, 0.2)",
                        }}
                        transition={{
                          delay: index * 0.03 + 1.5,
                          duration: 0.8,
                        }}
                      >
                        <div className="h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl sm:text-3xl mb-1">🌟</div>
                            <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-white/30 rounded-full mx-auto flex items-center justify-center">
                              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white/20 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
        {shufflePhase === "ready" && canConfirm && (
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
                선택 완료
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
