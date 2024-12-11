import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "오늘 뭐 뽑지? - 질문하기" },
    {
      name: "description",
      content: "궁금한 것을 물어보세요. 타로가 답해드립니다.",
    },
  ];
}

export default function Home() {
  const [question, setQuestion] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      navigate(
        `/select-spread?question=${encodeURIComponent(question.trim())}`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-6xl mb-4"
          >
            🔮
          </motion.div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
            오늘 뭐 뽑지?
          </h1>
          <p className="text-xl text-purple-100">당신의 미래를 들여다보세요</p>
        </div>

        {/* Question Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl"
        >
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            당신의 운세를 점 쳐보세요!
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="궁금한 것을 물어보세요... (예: 나의 연애운은 어떨까요?)"
                className="w-full min-h-[120px] p-4 text-lg bg-white/10 border border-white/30 rounded-xl text-white placeholder-purple-200 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-purple-200">
                  {question.length}/500
                </span>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={!question.trim()}
              whileHover={{ scale: question.trim() ? 1.05 : 1 }}
              whileTap={{ scale: question.trim() ? 0.95 : 1 }}
              className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all ${
                question.trim()
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl"
                  : "bg-gray-500/50 text-gray-300 cursor-not-allowed"
              }`}
            >
              다음 단계로
            </motion.button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-purple-200/60">
            타로는 참고용일 뿐입니다. 긍정적인 마음으로 미래를 만들어 가세요.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
