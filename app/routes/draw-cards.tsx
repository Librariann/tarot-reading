import { useSearchParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Route } from "./+types/draw-cards";
import { tarotSpreads } from "~/data/tarotSpreads";
import { CardSelectionGrid } from "~/components/CardSelectionGrid";
import type { TarotCard, TarotReading, DrawnCard } from "~/types/tarot";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "오늘 뭐 뽑지? - 카드 뽑기" },
    { name: "description", content: "카드를 뽑아서 운세를 확인하세요." },
  ];
}

export default function DrawCards() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const question = searchParams.get("question") || "";
  const spreadId = searchParams.get("spreadId") || "";
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [error, setError] = useState<string | null>(null);

  const spread = tarotSpreads.find((s) => s.id === spreadId);

  useEffect(() => {
    if (!question || !spread) {
      navigate("/");
    }
  }, [question, spread, navigate]);


  const handleSelectionChange = (cards: TarotCard[]) => {
    setSelectedCards(cards);
    setError(null); // Clear any previous errors
  };

  const handleConfirm = async (cards: TarotCard[]) => {
    if (!spread || !question || cards.length !== spread.cardCount) return;

    setError(null);

    try {
      // Create drawn cards with random reversed state
      const drawnCards: DrawnCard[] = cards.map((card, index) => ({
        card,
        position: spread.positions[index],
        isReversed: Math.random() < 0.3, // 30% chance of reversed card
      }));

      // Create basic reading
      const reading: TarotReading = {
        id: Date.now().toString(),
        question,
        spread,
        drawnCards,
        timestamp: new Date(),
      };

      // Navigate to card reveal page with reading data
      const params = new URLSearchParams();
      params.set("reading", encodeURIComponent(JSON.stringify(reading)));
      navigate(`/reveal-cards?${params.toString()}`);
    } catch (error) {
      console.error("카드 생성 오류:", error);
      setError(
        "카드를 생성하는 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    }
  };

  if (!question || !spread) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            {spread.nameKo} 리딩
          </h1>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 max-w-2xl mx-auto mb-4">
            <p className="text-purple-100 italic">"{question}"</p>
          </div>
          <p className="text-purple-200">{spread.descriptionKo}</p>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center mb-8"
        >
          <button
            onClick={() =>
              navigate(
                `/select-spread?question=${encodeURIComponent(question)}`
              )
            }
            className="text-purple-200 hover:text-white transition-colors flex items-center gap-2"
          >
            ← 스프레드 변경하기
          </button>
        </motion.div>

        {/* Card Selection Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <CardSelectionGrid
            requiredCount={spread.cardCount}
            onSelectionChange={handleSelectionChange}
            onConfirm={handleConfirm}
            isLoading={false}
            error={error}
          />
        </motion.div>

        {/* Spread Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 max-w-2xl mx-auto"
        >
          <h3 className="text-white font-semibold mb-4 text-center">
            포지션 미리보기
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {spread.positions.map((position, index) => (
              <div
                key={position.id}
                className="bg-white/10 text-purple-100 px-4 py-2 rounded-lg text-sm"
              >
                {index + 1}. {position.nameKo}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
