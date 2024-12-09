import { useSearchParams, useNavigate, useFetcher } from "react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { data } from "react-router";
import type { Route } from "./+types/reveal-cards";
import { useTarotContext } from "~/lib/TarotContext";
import { generateTarotReading } from "~/lib/aiTarotService";
import type { TarotReading, DrawnCard } from "~/types/tarot";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const readingData = JSON.parse(formData.get("reading") as string);

  try {
    const aiInterpretation = await generateTarotReading(readingData);
    return data({ success: true, aiInterpretation }, { status: 200 });
  } catch (error) {
    console.error("AI 타로 해석 생성 오류:", error);
    return data(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "오늘 뭐 뽑지? - 카드 공개" },
    { name: "description", content: "선택한 카드를 하나씩 공개해보세요." },
  ];
}

export default function RevealCards() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fetcher = useFetcher<{
    success: boolean;
    aiInterpretation?: any;
    error?: string;
  }>();
  const { addReading } = useTarotContext();

  // URL에서 리딩 데이터 파싱
  const readingData = searchParams.get("reading");
  const [reading, setReading] = useState<TarotReading | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [revealedCards, setRevealedCards] = useState<boolean[]>([]);
  const [isAutoRevealing, setIsAutoRevealing] = useState(false);
  const [pendingReading, setPendingReading] = useState<TarotReading | null>(
    null
  );

  // 초기 데이터 설정
  useEffect(() => {
    if (readingData) {
      try {
        const parsedReading = JSON.parse(decodeURIComponent(readingData));
        setReading(parsedReading);
        setRevealedCards(
          new Array(parsedReading.drawnCards.length).fill(false)
        );
      } catch (error) {
        console.error("Reading data parsing error:", error);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [readingData, navigate]);

  // AI 해석 결과 처리
  useEffect(() => {
    if (fetcher.data && pendingReading) {
      const finalReading = { ...pendingReading };

      if (fetcher.data.success && fetcher.data.aiInterpretation) {
        finalReading.aiInterpretation = fetcher.data.aiInterpretation;
      } else if (fetcher.data.error) {
        console.warn("AI 해석 생성 실패:", fetcher.data.error);
      }

      addReading(finalReading);

      // Navigate to results
      const params = new URLSearchParams();
      params.set("readingId", finalReading.id);
      navigate(`/reading-result?${params.toString()}`);

      // Clean up
      setPendingReading(null);
    }
  }, [fetcher.data, pendingReading, addReading, navigate]);

  const revealCard = (index: number) => {
    setRevealedCards((prev) => {
      const newRevealed = [...prev];
      newRevealed[index] = true;
      return newRevealed;
    });
  };

  const revealNextCard = () => {
    if (!reading) return;

    if (currentCardIndex < reading.drawnCards.length) {
      revealCard(currentCardIndex);
      setCurrentCardIndex((prev) => prev + 1);
    }
  };

  const revealAllCards = () => {
    if (!reading) return;

    setIsAutoRevealing(true);
    const totalCards = reading.drawnCards.length;

    // 순차적으로 모든 카드 공개 (0.5초 간격)
    for (let i = 0; i < totalCards; i++) {
      setTimeout(() => {
        revealCard(i);
        if (i === totalCards - 1) {
          setCurrentCardIndex(totalCards);
          setIsAutoRevealing(false);
        }
      }, i * 500);
    }
  };

  const proceedToInterpretation = async () => {
    if (!reading) return;

    setPendingReading(reading);

    // AI 해석 요청
    const formData = new FormData();
    formData.append("reading", JSON.stringify(reading));

    fetcher.submit(formData, {
      method: "POST",
      action: "/reveal-cards",
    });
  };

  if (!reading) {
    return null;
  }

  const allCardsRevealed = revealedCards.every((revealed) => revealed);
  const hasRevealedCards = revealedCards.some((revealed) => revealed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            {reading.spread.nameKo} - 카드 공개
          </h1>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 max-w-2xl mx-auto mb-4">
            <p className="text-purple-100 italic">"{reading.question}"</p>
          </div>
          <p className="text-purple-200">카드를 하나씩 뒤집어서 확인해보세요</p>
        </motion.div>

        {/* Cards Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {reading.drawnCards.map((drawnCard: DrawnCard, index: number) => (
              <motion.div
                key={`${drawnCard.card.id}-${index}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className="flex flex-col items-center"
              >
                {/* Position Label */}
                <div className="bg-white/10 text-purple-100 px-3 py-1 rounded-lg text-sm mb-2">
                  {drawnCard.position.nameKo}
                </div>

                {/* Card */}
                <motion.div
                  className="relative cursor-pointer"
                  style={{ perspective: "1000px" }}
                  onClick={() =>
                    !revealedCards[index] &&
                    !isAutoRevealing &&
                    revealCard(index)
                  }
                >
                  <motion.div
                    className="relative w-36 h-56 rounded-lg"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{
                      rotateY: revealedCards[index] ? 180 : 0,
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    {/* Card Back */}
                    <div
                      className="absolute inset-0 rounded-lg border-2 border-purple-300 bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-lg"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <div className="text-white text-4xl">🌟</div>
                    </div>

                    {/* Card Front */}
                    <div
                      className="absolute inset-0 rounded-lg border-2 border-gray-300 bg-white shadow-lg overflow-hidden"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <div
                        className={`h-full ${drawnCard.isReversed ? "rotate-180" : ""}`}
                      >
                        {/* Card Image - 전체 카드를 채움 */}
                        <div className="w-full h-full p-1">
                          <img
                            src={drawnCard.card.image}
                            alt={drawnCard.card.nameKo}
                            className="w-full h-full object-cover rounded-sm"
                            loading="eager"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Card Info (shown after reveal) */}
                <AnimatePresence>
                  {revealedCards[index] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-3 text-center max-w-32"
                    >
                      <div className="text-white font-medium text-sm mb-1">
                        {drawnCard.card.id}. {drawnCard.card.nameKo}(
                        {drawnCard.isReversed ? "역방향" : "정방향"})
                      </div>
                      <div className="text-purple-200 text-xs">
                        {drawnCard.card.keywordsKo?.slice(0, 2).join(", ")}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Control Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center gap-4"
        >
          {!allCardsRevealed && (
            <div className="flex gap-4">
              <button
                onClick={revealNextCard}
                disabled={
                  isAutoRevealing ||
                  currentCardIndex >= reading.drawnCards.length
                }
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-lg"
              >
                다음 카드 공개
              </button>

              <button
                onClick={revealAllCards}
                disabled={isAutoRevealing}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-500 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-lg"
              >
                모든 카드 공개
              </button>
            </div>
          )}

          {allCardsRevealed && (
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-4"
              >
                <p className="text-white text-lg mb-2">
                  모든 카드가 공개되었습니다!
                </p>
                <p className="text-purple-200">이제 카드를 해석해드릴게요.</p>
              </motion.div>

              <button
                onClick={proceedToInterpretation}
                disabled={
                  fetcher.state === "submitting" || fetcher.state === "loading"
                }
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg transform hover:scale-105"
              >
                {fetcher.state === "submitting" || fetcher.state === "loading"
                  ? "해석 중..."
                  : "타로 해석 보기 ✨"}
              </button>
            </div>
          )}
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 max-w-md mx-auto"
        >
          <div className="bg-white/10 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${(revealedCards.filter((r) => r).length / reading.drawnCards.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-center text-purple-200 text-sm mt-2">
            {revealedCards.filter((r) => r).length} /{" "}
            {reading.drawnCards.length} 카드 공개됨
          </p>
        </motion.div>
      </div>
    </div>
  );
}
