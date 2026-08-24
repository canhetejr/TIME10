import React from 'react';
import { Play, X, Sparkles, Award, Zap, Clock, Target, Dices } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-2 border-indigo-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-indigo-950/80 text-center animate-scale-up">
        {/* Close button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-700"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Level Icon & Badge */}
        <div className="relative inline-flex items-center justify-center mb-3">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-amber-500 p-0.5 shadow-xl">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-md">
                <LevelIconBadge levelId={level.id} type={level.type} size="lg" />
              </div>
            </div>
          </div>
          <div className="absolute -bottom-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-md">
            Fase {level.id}
          </div>
        </div>

        {/* Level Title & Subtitle */}
        <h2 className="text-xl sm:text-2xl font-black text-white font-['Fredoka',sans-serif] mt-2 leading-tight">
          {level.title}
        </h2>
        <p className="text-xs sm:text-sm text-indigo-300 font-medium mt-1 mb-4">
          {level.subtitle}
        </p>

        {/* Stars Status */}
        <div className="flex items-center justify-center gap-2 mb-4 bg-slate-950/60 py-2 px-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((starNum) => (
              <GameStar
                key={starNum}
                filled={starNum <= currentStars}
                size="lg"
              />
            ))}
          </div>
          <span className="text-xs font-bold text-slate-400 ml-2">
            {currentStars > 0 ? `${currentStars}/3 Estrelas` : 'Não concluída'}
          </span>
        </div>

        {/* Objectives Box */}
        <div className="text-left bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 mb-5 space-y-2">
          <div className="flex items-start gap-2.5">
            <Target className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300">
              <strong className="text-emerald-300">Objetivo: </strong>
              {level.description}
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-1 border-t border-slate-800/80">
            <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
            <div className="text-xs text-slate-300 flex items-center gap-1.5">
              <strong className="text-yellow-300">Recompensa da Vitória: </strong>
              <span className="font-bold text-amber-300 flex items-center gap-1 font-mono">
                +{level.rewardMoEdu} MoEdu <MoEduCoin size="xs" />
              </span>
            </div>
          </div>

          {level.type === 'quiz' && (
            <div className="flex items-center gap-2.5 text-xs text-indigo-300">
              <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>5 Perguntas • 15s por questão • Combos multiplicam pontos!</span>
            </div>
          )}

          {level.type === 'match3' && (
            <div className="flex items-center gap-2.5 text-xs text-indigo-300">
              <Zap className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Meta: {level.match3TargetScore} pontos • Limite: {level.match3MaxMoves} jogadas</span>
            </div>
          )}

          {level.type === 'slot' && (
            <div className="flex items-center gap-2.5 text-xs text-amber-300">
              <Dices className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{level.slotSpinsAllowed} Giros • Meta: {level.slotTargetMoEdu} MoEdu</span>
            </div>
          )}
        </div>

        {/* Start Button */}
        <button
          onClick={() => {
            sound.playClick();
            onStart();
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 active:translate-y-1 text-slate-950 font-black text-lg sm:text-xl uppercase tracking-wider font-['Fredoka',sans-serif] border-b-4 border-amber-700 shadow-[0_8px_20px_rgba(245,158,11,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5 fill-slate-950 text-slate-950" />
          <span>JOGAR MINIJOGO</span>
        </button>
      </div>
    </div>
  );
};
