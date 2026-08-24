import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, X, Target, Sparkles, Award } from 'lucide-react';
import { LevelConfig, LevelProgress } from '../types';
import { sound } from '../utils/sound';
import { GameStar, LevelIconBadge, MoEduCoin } from './GameIcons';

interface LevelModalProps {
  level: LevelConfig;
  progress?: LevelProgress;
  onStart: () => void;
  onClose: () => void;
}

export const LevelModal: React.FC<LevelModalProps> = ({ level, progress, onStart, onClose }) => {
  const currentStars = progress?.stars || 0;
  const highScore = progress?.highScore || 0;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        sound.playClick();
        onStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onStart]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sound.playClick();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.95, y: 10, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 10, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl text-center"
      >
        {/* Close */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer border border-slate-700 transition-colors"
          title="Fechar (Esc)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Level Icon */}
        <div className="relative inline-flex items-center justify-center mb-2">
          <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-sm">
            <LevelIconBadge levelId={level.id} type={level.type} size="md" />
          </div>
          <div className="absolute -bottom-1.5 bg-amber-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow">
            Fase {level.id}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-base sm:text-lg font-bold text-white mt-1 leading-tight">
          {level.title}
        </h2>
        <p className="text-xs text-slate-400 font-normal mb-3">
          {level.subtitle}
        </p>

        {/* Stars and High Score */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 bg-slate-950 py-1.5 px-3 rounded-lg border border-slate-800">
            {[1, 2, 3].map((starNum) => (
              <GameStar key={starNum} filled={starNum <= currentStars} size="sm" />
            ))}
            <span className="text-xs font-semibold text-slate-400 ml-1">
              {currentStars > 0 ? `${currentStars}/3` : '0/3'}
            </span>
          </div>

          {highScore > 0 && (
            <div className="flex items-center gap-1 bg-slate-950 py-1.5 px-2.5 rounded-lg border border-slate-800 text-xs font-mono font-bold text-amber-400">
              <Award className="w-3.5 h-3.5" />
              <span>{highScore} pts</span>
            </div>
          )}
        </div>

        {/* Objective & Reward */}
        <div className="text-left bg-slate-950 border border-slate-800 rounded-xl p-3 mb-4 space-y-2">
          <div className="flex items-start gap-2">
            <Target className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="text-xs text-slate-300 leading-snug">
              {level.description}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-400 font-normal flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Recompensa:
            </span>
            <span className="font-bold text-amber-400 flex items-center gap-1 font-mono">
              +{level.rewardMoEdu} <MoEduCoin size="xs" />
            </span>
          </div>
        </div>

        {/* Play Button */}
        <button
          onClick={() => {
            sound.playClick();
            onStart();
          }}
          className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider border-b-2 border-emerald-800 active:border-b-0 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Jogar Fase</span>
        </button>
      </motion.div>
    </motion.div>
  );
};
