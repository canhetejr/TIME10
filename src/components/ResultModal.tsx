import React, { useEffect } from 'react';
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
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sound.playClick();
          onBackToMap();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn"
    >
      <div className="relative w-full max-w-sm bg-slate-900 border border-indigo-500/50 rounded-3xl p-5 shadow-2xl text-center">
        {/* Icon */}
        <div className="relative inline-flex items-center justify-center mb-2">
          {victory ? (
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-lg border-2 border-white">
              <Trophy className="w-8 h-8 text-amber-950 fill-yellow-100" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-700 shadow-md">
              <ShieldAlert className="w-8 h-8 text-rose-400" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-black text-white font-['Fredoka',sans-serif] uppercase">
          {victory ? 'FASE CONCLUÍDA!' : 'TENTE NOVAMENTE'}
        </h2>
        <p className="text-xs text-indigo-200 mt-0.5 mb-3 font-medium">
          {victory ? level.title : 'Alcance a pontuação meta para avançar.'}
        </p>

        {/* 3 Stars */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {[1, 2, 3].map((starNum) => (
            <GameStar key={starNum} filled={starNum <= stars} size="xl" />
          ))}
        </div>

        {/* Stats */}
        <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 mb-4 flex items-center justify-between text-xs font-mono">
          <div className="text-left">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Pontos</span>
            <span className="text-sm font-black text-white">{score}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Recompensa</span>
            <span className="text-sm font-black text-yellow-300 flex items-center justify-end gap-1">
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
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 active:scale-98 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider font-['Fredoka',sans-serif] border-b-2 border-emerald-800 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>PRÓXIMA FASE (Enter)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onReplay();
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Repetir</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onBackToMap();
              }}
              className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs border border-indigo-400/40 flex items-center justify-center gap-1 cursor-pointer"
            >
              <Map className="w-3.5 h-3.5 text-yellow-300" />
              <span>Mapa (Esc)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
