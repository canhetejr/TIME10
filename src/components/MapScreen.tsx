import React from 'react';
import { Lock, Star, Play, CheckCircle2, RotateCcw, Sparkles, Compass, Brain, Layers, Dices } from 'lucide-react';
import { LevelConfig, LevelProgress, PlayerState } from '../types';
import { sound } from '../utils/sound';
import { AvatarInsignia, GameStar, LevelIconBadge, MoEduCoin } from './GameIcons';

interface MapScreenProps {
  levels: LevelConfig[];
  player: PlayerState;
  onSelectLevel: (level: LevelConfig) => void;
  onResetProgress: () => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({
  levels,
  player,
  onSelectLevel,
  onResetProgress,
}) => {
  // Calculate total stars collected
  const progressList = Object.values(player.levels) as LevelProgress[];
  const totalStars = progressList.reduce((acc, lvl) => acc + lvl.stars, 0);
  const maxPossibleStars = levels.length * 3;
  const completedCount = progressList.filter((l) => l.completed).length;
  const progressPercent = Math.round((completedCount / levels.length) * 100);

  // Helper for level node colors
  const getLevelStyle = (level: LevelConfig, isUnlocked: boolean, isCompleted: boolean) => {
    if (!isUnlocked) {
      return {
        bg: 'bg-slate-800 border-slate-700 text-slate-500 shadow-none',
        shadow: 'border-b-4 border-slate-900',
        ring: '',
      };
    }
    if (isCompleted) {
      return {
        bg: 'bg-gradient-to-tr from-amber-500 to-yellow-400 border-yellow-200 text-slate-950',
        shadow: 'border-b-6 border-amber-800 shadow-[0_8px_20px_rgba(245,158,11,0.4)]',
        ring: 'hover:scale-110 transition-transform',
      };
    }
    // Active current level
    return {
      bg: 'bg-gradient-to-tr from-teal-400 via-emerald-400 to-green-500 border-teal-200 text-slate-950',
      shadow: 'border-b-6 border-teal-800 shadow-[0_8px_25px_rgba(45,212,191,0.6)] animate-bounce-gentle',
      ring: 'ring-4 ring-emerald-400/60 ring-offset-4 ring-offset-slate-950 hover:scale-110 transition-transform',
    };
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full pb-20 pt-4 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950">
      {/* Decorative Floating Clouds & Background Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-10 bg-indigo-500/10 rounded-full blur-xl" />
        <div className="absolute top-60 right-10 w-44 h-14 bg-purple-500/10 rounded-full blur-xl" />
        <div className="absolute bottom-40 left-16 w-40 h-12 bg-teal-500/10 rounded-full blur-xl" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
        {/* Map Header Progress Banner */}
        <div className="w-full bg-slate-900/90 border-2 border-indigo-500/30 rounded-3xl p-4 mb-8 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white font-['Fredoka',sans-serif] flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/40 border border-indigo-400/40 flex items-center justify-center">
                  <Compass className="w-4 h-4 text-amber-300" />
                </div>
                <span>Trilha do Conhecimento</span>
              </h2>
              <p className="text-xs text-slate-400">
                Avance pelas fases, domine os 3 minijogos e colete MoEdu!
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-xs font-bold text-amber-300 font-mono">
                <span>{totalStars}/{maxPossibleStars}</span>
                <GameStar size="sm" />
              </div>
              <div className="text-[10px] text-slate-400 font-semibold">{progressPercent}% Concluído</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-950 rounded-full h-3.5 p-0.5 border border-slate-800 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(52,211,153,0.5)]"
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            />
          </div>
        </div>

        {/* Winding Candy Crush Trail */}
        <div className="relative w-full max-w-md flex flex-col items-center py-4 space-y-12 sm:space-y-16">
          {levels.map((level, idx) => {
            const progress = player.levels[level.id] || {
              levelId: level.id,
              unlocked: level.id === 1,
              completed: false,
              stars: 0,
              highScore: 0,
            };

            const isUnlocked = progress.unlocked;
            const isCompleted = progress.completed;
            const isCurrentActive =
              isUnlocked && !isCompleted && (idx === 0 || player.levels[levels[idx - 1].id]?.completed);

            // Sinuous curve offset calculation: alternate left, center, right, center
            const offsets = ['translate-x-0', 'translate-x-12 sm:translate-x-16', 'translate-x-0', '-translate-x-12 sm:-translate-x-16'];
            const curveClass = offsets[idx % offsets.length];

            const style = getLevelStyle(level, isUnlocked, isCompleted);

            return (
              <div
                key={level.id}
                className={`relative flex flex-col items-center z-10 transition-all duration-300 ${curveClass}`}
              >
                {/* Visual connecting dashed path to next node */}
                {idx < levels.length - 1 && (
                  <div
                    className={`absolute top-16 w-1.5 h-16 sm:h-20 -z-10 border-l-4 border-dashed transition-colors ${
                      isCompleted ? 'border-amber-400/80 shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'border-slate-700/60'
                    }`}
                    style={{
                      // Slight tilt matching the zigzag curve
                      transform: idx % 2 === 0 ? 'rotate(15deg)' : 'rotate(-15deg)',
                      transformOrigin: 'top center',
                    }}
                  />
                )}

                {/* Avatar standing on active level */}
                {isCurrentActive && (
                  <div className="absolute -top-12 flex flex-col items-center animate-bounce z-20 pointer-events-none">
                    <div className="bg-slate-900 border border-emerald-400 text-[10px] font-black text-emerald-300 px-2 py-0.5 rounded-full shadow-md whitespace-nowrap mb-0.5">
                      VOCÊ ESTÁ AQUI
                    </div>
                    <AvatarInsignia avatarKey={player.equippedAvatar || 'capelo'} size="md" className="shadow-lg ring-2 ring-emerald-400" />
                  </div>
                )}

                {/* Level Bubble Button */}
                <button
                  disabled={!isUnlocked}
                  onClick={() => {
                    if (isUnlocked) {
                      sound.playClick();
                      onSelectLevel(level);
                    }
                  }}
                  className={`group relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center p-2 transition-all cursor-pointer ${
                    style.bg
                  } ${style.shadow} ${style.ring} ${
                    !isUnlocked ? 'cursor-not-allowed opacity-60' : 'active:translate-y-1'
                  }`}
                >
                  {/* Inside Content */}
                  {isUnlocked ? (
                    <>
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <LevelIconBadge levelId={level.id} type={level.type} size="md" />
                      </div>
                      <span className="text-xs sm:text-sm font-black font-['Fredoka',sans-serif] tracking-tight leading-none mt-1">
                        Fase {level.id}
                      </span>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-slate-500 mb-0.5" />
                      <div className="flex items-center gap-0.5 text-[10px] font-bold text-slate-500 font-mono">
                        <span>{level.requiredStarsToUnlock}</span>
                        <GameStar filled={false} size="sm" />
                      </div>
                    </div>
                  )}

                  {/* Level Type Badge (Quiz / Match / Slot) */}
                  <div className="absolute -bottom-2.5 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[9px] font-black text-slate-300 uppercase tracking-wider whitespace-nowrap shadow-md flex items-center gap-1">
                    {level.type === 'quiz' && (
                      <>
                        <Brain className="w-2.5 h-2.5 text-indigo-400" />
                        <span>Quiz</span>
                      </>
                    )}
                    {level.type === 'match3' && (
                      <>
                        <Layers className="w-2.5 h-2.5 text-emerald-400" />
                        <span>Match-3</span>
                      </>
                    )}
                    {level.type === 'slot' && (
                      <>
                        <Dices className="w-2.5 h-2.5 text-amber-400" />
                        <span>Giro</span>
                      </>
                    )}
                  </div>
                </button>

                {/* Stars earned under the bubble */}
                {isUnlocked && (
                  <div className="flex items-center gap-1 mt-3">
                    {[1, 2, 3].map((starNum) => (
                      <GameStar
                        key={starNum}
                        filled={starNum <= progress.stars}
                        size="md"
                      />
                    ))}
                  </div>
                )}

                {/* Reward MoEdu Pill */}
                <div className="mt-1 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-600/40 text-[10px] font-bold text-yellow-300 font-mono">
                  <span>+{level.rewardMoEdu}</span>
                  <MoEduCoin size="xs" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm('Deseja reiniciar seu progresso e jogar tudo novamente?')) {
                sound.playClick();
                onResetProgress();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-400 transition-colors p-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Progresso da Trilha</span>
          </button>
        </div>
      </div>
    </div>
  );
};
