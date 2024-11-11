import { useSearchParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import type { Route } from './+types/select-spread';
import { tarotSpreads } from '~/data/tarotSpreads';
import type { TarotSpread } from '~/types/tarot';

export function meta({}: Route.MetaArgs) {
  return [
    { title: '타로 리딩 - 스프레드 선택' },
    { name: 'description', content: '원하는 스프레드를 선택하세요.' },
  ];
}

export default function SelectSpread() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const question = searchParams.get('question') || '';

  const handleSpreadSelect = (spread: TarotSpread) => {
    const params = new URLSearchParams();
    params.set('question', question);
    params.set('spreadId', spread.id);
    navigate(`/draw-cards?${params.toString()}`);
  };

  if (!question) {
    navigate('/');
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
            스프레드를 선택하세요
          </h1>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 max-w-2xl mx-auto">
            <p className="text-purple-100 italic">
              "{question}"
            </p>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="text-purple-200 hover:text-white transition-colors flex items-center gap-2"
          >
            ← 질문 수정하기
          </button>
        </motion.div>

        {/* Spreads Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {tarotSpreads.map((spread, index) => (
            <motion.button
              key={spread.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 + 0.3 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSpreadSelect(spread)}
              className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl text-left hover:bg-white/15 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold text-white">
                  {spread.nameKo}
                </h3>
                <span className="bg-purple-500/30 text-purple-100 px-3 py-1 rounded-full text-sm font-medium">
                  {spread.cardCount}장
                </span>
              </div>
              
              <p className="text-purple-100 mb-6 leading-relaxed">
                {spread.descriptionKo}
              </p>
              
              <div className="space-y-3">
                <h4 className="text-white font-medium text-sm">포지션:</h4>
                <div className="flex flex-wrap gap-2">
                  {spread.positions.map((position, idx) => (
                    <span
                      key={position.id}
                      className="bg-white/10 text-purple-100 px-3 py-1 rounded-lg text-sm"
                    >
                      {idx + 1}. {position.nameKo}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 text-right">
                <span className="text-purple-200 group-hover:text-white transition-colors">
                  선택하기 →
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}