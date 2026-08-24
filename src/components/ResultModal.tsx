import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, ArrowRight, RotateCcw, Map, ShieldAlert } from 'lucide-react';
import { LevelConfig } from '../types';
import { sound } from '../utils/sound';
import { fireWinConfetti } from '../utils/confetti';
import { GameStar, MoEduCoin } from './GameIcons';

interface ResultModalProps {
  level: LevelConfig;
  result: {
    stars: number;
    score: number;
    moEduEarned: number;
    victory: boolean;
  };
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onBackToMap: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  level,
  result,
  hasNextLevel,
  onNextLevel,
  onReplay,
  onBackToMap,
}) => {
  const { stars, score, moEduEarned, victory } = result;

  useEffect(() => {
    if (victory) {
      sound.playVictory();
      fireWinConfetti();
    } else {
      sound.playWrong();
    }
  }, [victory]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBackToMap();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        sound.playClick();
        if (victory && hasNextLevel) {
          onNextLevel();
        } else {
          onReplay();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [victory, hasNextLevel, onNextLevel, onReplay, onBackToMap]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sound.playClick();
          onBackToMap();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.95, y: 10, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 10, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-center"
      >
        {/* Icon */}
        <div className="relative inline-flex items-center justify-center mb-2">
          {victory ? (
            <div className="w-14 h-14 rounded-full bg-slate-800 border border-amber-500/50 flex items-center justify-center shadow-sm">
              <Trophy className="w-7 h-7 text-amber-400" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shadow-sm">
              <ShieldAlert className="w-7 h-7 text-rose-400" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
          {victory ? 'Fase Concluída!' : 'Tente Novamente'}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 mb-3 font-normal">
          {victory ? level.title : 'Alcance a pontuação mínima para avançar.'}
        </p>

        {/* 3 Stars */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {[1, 2, 3].map((starNum) => (
            <div key={starNum}>
              <GameStar filled={starNum <= stars} size="xl" />
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 mb-4 flex items-center justify-between text-xs font-mono">
          <div className="text-left">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Pontos</span>
            <span className="text-sm font-bold text-white">{score}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Recompensa</span>
            <span className="text-sm font-bold text-amber-400 flex items-center justify-end gap-1">
              +{moEduEarned} <MoEduCoin size="xs" />
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {victory && hasNextLevel && (
            <button
              onClick={() => {
                sound.playClick();
                onNextLevel();
              }}
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider border-b-2 border-emerald-800 active:border-b-0 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Próxima Fase</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onReplay();
              }}
              className="py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Repetir</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onBackToMap();
              }}
              className="py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Map className="w-3.5 h-3.5 text-amber-400" />
              <span>Mapa</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
