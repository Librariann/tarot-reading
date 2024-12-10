import { useSearchParams, useNavigate } from "react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import type { Route } from "./+types/reading-result";
import { useTarotContext } from "~/lib/TarotContext";
import type { DrawnCard } from "~/types/tarot";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "오늘 뭐 뽑지? - 결과" },
    { name: "description", content: "오늘 뭐 뽑지? 결과를 확인하세요." },
  ];
}

function DrawnCardComponent({
  drawnCard,
  index,
}: {
  drawnCard: DrawnCard;
  index: number;
}) {
  const { card, position, isReversed } = drawnCard;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -90 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.3,
        ease: "easeOut",
      }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mb-6"
    >
      {/* Position Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <h3 className="text-xl font-semibold text-white">{position.nameKo}</h3>
        <span className="text-sm text-purple-200 italic">
          {position.descriptionKo}
        </span>
      </div>

      {/* Card Display */}
      <div className="flex gap-6 items-start">
        {/* Card Visual */}
        <motion.div
          className={`w-28 h-40 bg-white rounded-lg border-2 border-white/30 shadow-xl relative overflow-hidden ${
            isReversed ? "rotate-180" : ""
          }`}
          whileHover={{ scale: 1.05 }}
        >
          {/* Card Image - 전체 카드를 채움 */}
          <div className="w-full h-full p-1">
            <img
              src={card.image}
              alt={card.nameKo}
              className="w-full h-full object-cover rounded-sm"
              loading="lazy"
            />
          </div>
        </motion.div>

        {/* Card Information */}
        <div className="flex-1">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-white mb-1">
              {card.id}. {card.nameKo} {isReversed ? "(역방향)" : "(정방향)"}
            </h4>
            <p className="text-sm text-purple-200 italic">{card.name}</p>
          </div>

          {/* Keywords */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {card.keywordsKo.slice(0, 3).map((keyword, idx) => (
                <span
                  key={idx}
                  className="bg-purple-500/30 text-purple-100 px-3 py-1 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Meaning */}
          <div>
            <p className="text-purple-100 leading-relaxed">
              {isReversed ? card.meaningKo.reversed : card.meaningKo.upright}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ReadingResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getReading } = useTarotContext();
  const readingId = searchParams.get("readingId") || "";

  const reading = getReading(readingId);

  useEffect(() => {
    if (!reading) {
      navigate("/");
    }
  }, [reading, navigate]);

  if (!reading) {
    return null;
  }

  const handleNewReading = () => {
    navigate("/");
  };

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
            {reading.spread.nameKo} 리딩 결과
          </h1>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 max-w-2xl mx-auto mb-4">
            <p className="text-purple-100 italic text-lg">
              "{reading.question}"
            </p>
            <p className="text-sm text-purple-200 mt-2">
              {new Date(reading.timestamp).toLocaleString("ko-KR")}
            </p>
          </div>
        </motion.div>

        {/* AI Interpretation Section */}
        {reading.aiInterpretation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl border border-indigo-300/20 p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                  🃏 타로 마스터의 해석
                </h2>
                <p className="text-indigo-200">
                  깊은 통찰과 지혜로 카드를 해석합니다
                </p>
              </div>

              {/* Overall Reading */}
              <div className="mb-8 text-center">
                <h3 className="text-xl font-semibold text-white mb-4">
                  전체적인 메시지
                </h3>
                <p className="text-indigo-100 text-lg leading-relaxed max-w-3xl mx-auto">
                  {reading.aiInterpretation.overallReading}
                </p>
              </div>

              {/* Individual Card Interpretations */}
              <div className="space-y-6 mb-8">
                {reading.aiInterpretation.cardInterpretations.map(
                  (cardInterp, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.2 }}
                      className="bg-white/10 rounded-xl p-6 border border-white/10"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold mb-2">
                            {cardInterp.cardName} - {cardInterp.position}
                            {cardInterp.isReversed && (
                              <span className="text-orange-300 ml-2">
                                (역방향)
                              </span>
                            )}
                          </h4>
                          <p className="text-indigo-100 mb-3 leading-relaxed">
                            {cardInterp.interpretation}
                          </p>
                          <p className="text-indigo-200/80 text-sm italic">
                            💡 {cardInterp.significance}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                )}
              </div>

              {/* Advice */}
              <div className="mb-6 text-center">
                <h3 className="text-xl font-semibold text-white mb-4">
                  조언과 지침
                </h3>
                <p className="text-indigo-100 text-lg leading-relaxed max-w-3xl mx-auto">
                  {reading.aiInterpretation.advice}
                </p>
              </div>

              {/* Summary */}
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl p-6 border border-purple-300/20">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    타로의 메시지
                  </h3>
                  <p className="text-purple-100 text-lg font-medium">
                    {reading.aiInterpretation.summary}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Cards Display */}
        <div className="mb-8">
          {reading.drawnCards.map((drawnCard, index) => (
            <DrawnCardComponent
              key={`${drawnCard.card.id}-${drawnCard.position.id}`}
              drawnCard={drawnCard}
              index={index}
            />
          ))}
        </div>

        {/* Summary & Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reading.drawnCards.length * 0.3 + 1.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center"
        >
          <h3 className="text-2xl font-semibold text-white mb-4">
            리딩을 마치며
          </h3>
          <p className="text-purple-100 mb-6 leading-relaxed max-w-2xl mx-auto">
            타로의 지혜가 합쳐진 이 해석이 당신에게 도움이 되기를 바랍니다.{" "}
            <br />
            최종적인 선택과 결정은 언제나 당신의 몫입니다. <br />
            긍정적인 마음으로 미래를 만들어 나가세요.
          </p>
          <motion.button
            onClick={handleNewReading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            새로운 리딩 시작하기
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
