import React, { useEffect } from 'react';
import { Star, Trophy, ArrowRight, RotateCcw, Map, Sparkles, XCircle, ShieldAlert } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-3 border-indigo-500/60 rounded-3xl p-6 shadow-2xl text-center animate-scale-up">
        {/* Top Trophy / Badge */}
        <div className="relative inline-flex items-center justify-center mb-2">
          {victory ? (
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.6)] border-4 border-white animate-bounce-short">
              <Trophy className="w-10 h-10 text-amber-950 fill-yellow-200 stroke-[2] drop-shadow" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center border-4 border-slate-700 shadow-lg">
              <ShieldAlert className="w-10 h-10 text-rose-400 stroke-[2]" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-white font-['Fredoka',sans-serif] uppercase tracking-wide">
          {victory ? 'FASE CONCLUÍDA!' : 'NÃO FOI DESSA VEZ'}
        </h2>
        <p className="text-xs sm:text-sm text-indigo-200 mt-0.5 mb-4 font-medium">
          {victory ? `Excelente desempenho na ${level.title}!` : 'Tente novamente para alcançar a meta e desbloquear a trilha.'}
        </p>

        {/* 3 Slam Animated Stars */}
        <div className="flex items-center justify-center gap-3 mb-5">
          {[1, 2, 3].map((starNum) => {
            const hasStar = starNum <= stars;
            return (
              <div
                key={starNum}
                className={`transition-all transform duration-500 ${
                  hasStar ? 'scale-125 animate-bounce-gentle' : 'opacity-30 scale-90'
                }`}
                style={{ animationDelay: `${starNum * 150}ms` }}
              >
                <GameStar filled={hasStar} size="2xl" />
              </div>
            );
          })}
        </div>

        {/* Rewards Summary Box */}
        <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase">MoEdu Faturado</span>
            <span className="text-lg font-black text-yellow-300 font-mono flex items-center gap-1.5">
              <span>+{moEduEarned}</span>
              <MoEduCoin size="sm" />
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span className="text-xs text-slate-400 font-bold uppercase">Pontuação Final</span>
            <span className="text-base font-black text-white font-mono">{score}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          {victory && hasNextLevel && (
            <button
              onClick={() => {
                sound.playClick();
                onNextLevel();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 active:translate-y-0.5 text-slate-950 font-black text-base uppercase tracking-wider font-['Fredoka',sans-serif] border-b-4 border-emerald-800 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>PRÓXIMA FASE</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                sound.playClick();
                onReplay();
              }}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:translate-y-0.5 text-white font-bold text-xs sm:text-sm border-b-3 border-slate-950 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Jogar de Novo</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onBackToMap();
              }}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:translate-y-0.5 text-white font-bold text-xs sm:text-sm border-b-3 border-indigo-950 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Map className="w-4 h-4 text-yellow-300" />
              <span>Voltar ao Mapa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
