import React, { useState } from 'react';
import {
  Lock,
  Play,
  RotateCcw,
  Gift,
  CheckCircle2,
  Compass,
  Zap,
  Crown,
  Brain,
  Layers,
  Dices,
  Flame,
  Sparkles,
} from 'lucide-react';
import { LevelConfig, LevelProgress, MilestoneChest, PlayerState, TrackId } from '../types';
import { sound } from '../utils/sound';
import { AvatarInsignia, GameStar, LevelIconBadge, MoEduCoin } from './GameIcons';
import { MILESTONE_CHESTS, TRACKS } from '../data/gameData';

interface MapScreenProps {
  levels: LevelConfig[];
  player: PlayerState;
  onSelectLevel: (level: LevelConfig) => void;
  onResetProgress: () => void;
  onClaimChest: (chest: MilestoneChest) => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({
  levels,
  player,
  onSelectLevel,
  onResetProgress,
  onClaimChest,
}) => {
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<TrackId | 'all'>('all');

  // Calculate global stars and progress
  const progressList = Object.values(player.levels) as LevelProgress[];
  const totalStars = progressList.reduce((acc, lvl) => acc + lvl.stars, 0);
  const maxPossibleStars = levels.length * 3;
  const completedCount = progressList.filter((l) => l.completed).length;
  const progressPercent = Math.round((completedCount / levels.length) * 100);

  // Find next playable level
  const nextPlayableLevel =
    levels.find((lvl) => {
      const prog = player.levels[lvl.id];
      return prog?.unlocked && !prog?.completed;
    }) || levels.find((lvl) => player.levels[lvl.id]?.unlocked) || levels[0];

  const getLevelStyle = (level: LevelConfig, isUnlocked: boolean, isCompleted: boolean) => {
    if (!isUnlocked) {
      return {
        bg: 'bg-slate-900 border-slate-800 text-slate-500',
        shadow: 'border-b-4 border-slate-950',
      };
    }

    if (level.isBossLevel) {
      return {
        bg: 'bg-gradient-to-tr from-rose-500 via-amber-400 to-yellow-300 border-rose-200 text-slate-950',
        shadow: 'border-b-4 border-rose-800 shadow-[0_4px_20px_rgba(244,63,94,0.4)]',
      };
    }

    if (isCompleted) {
      return {
        bg: 'bg-gradient-to-tr from-amber-500 to-yellow-400 border-yellow-200 text-slate-950',
        shadow: 'border-b-4 border-amber-700 shadow-[0_4px_15px_rgba(245,158,11,0.3)]',
      };
    }

    // Active current level
    return {
      bg: 'bg-gradient-to-tr from-teal-400 via-emerald-400 to-green-500 border-teal-200 text-slate-950',
      shadow: 'border-b-4 border-teal-800 shadow-[0_4px_20px_rgba(45,212,191,0.5)] ring-4 ring-emerald-400/60',
    };
  };

  const filteredTracks =
    selectedTrackFilter === 'all' ? TRACKS : TRACKS.filter((t) => t.id === selectedTrackFilter);

  return (
    <div className="relative min-h-[calc(100vh-56px)] w-full pb-20 pt-3 px-3 sm:px-4 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 overflow-x-hidden">
      <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
        {/* Top Progress & Chests Card */}
        <div className="w-full bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-3 sm:p-4 mb-4 shadow-xl backdrop-blur-md">
          {/* Progress Bar & Header */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-black text-white font-['Fredoka',sans-serif]">
              Progresso Geral
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 font-mono">
              <span>{completedCount}/{levels.length} Fases</span>
              <span className="text-slate-500">•</span>
              <span>{totalStars}/{maxPossibleStars}</span>
              <GameStar size="xs" />
            </div>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-2.5 p-0.5 border border-slate-800 overflow-hidden mb-3">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(4, progressPercent)}%` }}
            />
          </div>

          {/* Milestone Chests Mini Row */}
          <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-800">
            {MILESTONE_CHESTS.map((chest) => {
              const isClaimed = player.claimedChests?.includes(chest.id);
              const isUnlocked = totalStars >= chest.requiredStars;
              const canClaim = isUnlocked && !isClaimed;

              return (
                <button
                  key={chest.id}
                  disabled={!canClaim && !isClaimed}
                  onClick={() => {
                    if (canClaim) {
                      onClaimChest(chest);
                    }
                  }}
                  className={`relative p-1.5 rounded-xl border transition-all flex flex-col items-center text-center cursor-pointer ${
                    isClaimed
                      ? 'bg-slate-950/60 border-emerald-500/40 text-slate-500'
                      : canClaim
                      ? 'bg-amber-500/20 border-amber-400 text-yellow-300 animate-pulse shadow-md active:scale-95'
                      : 'bg-slate-950/40 border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                  }`}
                  title={`${chest.title} (${chest.requiredStars} estrelas)`}
                >
                  <div className="flex items-center gap-0.5 text-[9px] font-bold font-mono text-amber-300">
                    <span>{chest.requiredStars}</span>
                    <GameStar size="xs" />
                  </div>
                  <Gift className={`w-4 h-4 my-0.5 ${canClaim ? 'text-yellow-300' : isClaimed ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className="text-[9px] font-black text-yellow-400 font-mono leading-none">
                    {isClaimed ? 'OK' : canClaim ? 'RESGATAR' : `+${chest.rewardMoEdu}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Play CTA (Next Phase) */}
        {nextPlayableLevel && (
          <button
            onClick={() => {
              sound.playClick();
              onSelectLevel(nextPlayableLevel);
            }}
            className="w-full p-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 border border-amber-400/40 shadow-lg flex items-center justify-between gap-3 mb-4 text-left active:scale-[0.98] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-slate-950/80 border border-amber-400/60 flex items-center justify-center shrink-0">
                <LevelIconBadge levelId={nextPlayableLevel.id} type={nextPlayableLevel.type} size="sm" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wide block">
                  Continuar Jogando
                </span>
                <h3 className="text-sm font-black text-white leading-tight">
                  Fase {nextPlayableLevel.id}: {nextPlayableLevel.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl font-black text-xs shrink-0">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Jogar</span>
            </div>
          </button>
        )}

        {/* Track Filter Tabs */}
        <div className="w-full flex items-center gap-1.5 mb-6 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => {
              sound.playClick();
              setSelectedTrackFilter('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedTrackFilter === 'all'
                ? 'bg-indigo-600 text-white border border-indigo-400'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            Todas as Trilhas
          </button>

          {TRACKS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                sound.playClick();
                setSelectedTrackFilter(t.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedTrackFilter === t.id
                  ? 'bg-indigo-600 text-white border border-indigo-400'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {t.title.split(':')[0]}
            </button>
          ))}
        </div>

        {/* Tracks & Level Nodes Trail */}
        <div className="w-full space-y-6">
          {filteredTracks.map((track) => {
            const trackLevels = levels.filter((lvl) => track.levelIds.includes(lvl.id));
            const isTrackCompleted = trackLevels.every((lvl) => player.levels[lvl.id]?.completed);

            return (
              <div
                key={track.id}
                className="rounded-3xl p-4 border border-indigo-500/20 bg-slate-900/60 backdrop-blur-sm shadow-md"
              >
                {/* Track Header */}
                <div className="flex items-center justify-between pb-3 mb-6 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-amber-300">
                      {track.id === 'geral' && <Compass className="w-4 h-4" />}
                      {track.id === 'raciocinio' && <Zap className="w-4 h-4" />}
                      {track.id === 'lideranca' && <Crown className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white font-['Fredoka',sans-serif]">
                        {track.title}
                      </h3>
                      <span className="text-[10px] text-slate-400">{track.badge}</span>
                    </div>
                  </div>

                  {isTrackCompleted && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Concluída</span>
                    </span>
                  )}
                </div>

                {/* Sinuous Clean Trail (Safe max horizontal offset to guarantee NO horizontal scroll) */}
                <div className="relative w-full flex flex-col items-center py-2 space-y-10">
                  {trackLevels.map((level, idx) => {
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
                      isUnlocked && !isCompleted && (level.id === 1 || player.levels[level.id - 1]?.completed);

                    // Gentle zigzag that NEVER overflows small 320px screens
                    const offsets = ['translate-x-0', 'translate-x-6 sm:translate-x-8', 'translate-x-0', '-translate-x-6 sm:-translate-x-8'];
                    const curveClass = offsets[idx % offsets.length];

                    const style = getLevelStyle(level, isUnlocked, isCompleted);

                    return (
                      <div
                        key={level.id}
                        className={`relative flex flex-col items-center z-10 ${curveClass}`}
                      >
                        {/* Avatar pin for current active level */}
                        {isCurrentActive && (
                          <div className="absolute -top-9 flex flex-col items-center animate-bounce z-20 pointer-events-none">
                            <AvatarInsignia avatarKey={player.equippedAvatar || 'capelo'} size="xs" className="ring-2 ring-emerald-400 shadow-md" />
                          </div>
                        )}

                        {/* Level Button Bubble */}
                        <button
                          disabled={!isUnlocked}
                          onClick={() => {
                            if (isUnlocked) {
                              sound.playClick();
                              onSelectLevel(level);
                            }
                          }}
                          className={`group relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center p-1.5 transition-all cursor-pointer ${
                            style.bg
                          } ${style.shadow} ${
                            !isUnlocked ? 'cursor-not-allowed opacity-50' : 'active:scale-95'
                          }`}
                        >
                          {isUnlocked ? (
                            <>
                              <LevelIconBadge levelId={level.id} type={level.type} size="sm" />
                              <span className="text-xs sm:text-sm font-black font-['Fredoka',sans-serif] leading-none mt-0.5">
                                {level.id}
                              </span>
                            </>
                          ) : (
                            <Lock className="w-5 h-5 text-slate-500" />
                          )}

                          {/* Level Type Badge */}
                          <div className="absolute -bottom-2 px-1.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[8px] font-bold text-slate-300 uppercase tracking-tighter shadow-sm flex items-center gap-0.5">
                            {level.type === 'quiz' && <span>Quiz</span>}
                            {level.type === 'match3' && <span>Match-3</span>}
                            {level.type === 'slot' && <span>Giro</span>}
                          </div>
                        </button>

                        {/* Boss Tag */}
                        {level.isBossLevel && (
                          <div className="mt-1 px-1.5 py-0.2 rounded-full bg-rose-950 border border-rose-500/40 text-[8px] font-black text-rose-300 uppercase">
                            Clímax
                          </div>
                        )}

                        {/* Stars earned */}
                        {isUnlocked && (
                          <div className="flex items-center gap-0.5 mt-1.5">
                            {[1, 2, 3].map((starNum) => (
                              <GameStar
                                key={starNum}
                                filled={starNum <= progress.stars}
                                size="xs"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reset Progress */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => {
              if (window.confirm('Deseja reiniciar seu progresso e jogar tudo novamente desde a Fase 1?')) {
                sound.playClick();
                onResetProgress();
              }
            }}
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-400 transition-colors p-2 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reiniciar Progresso</span>
          </button>
        </div>
      </div>
    </div>
  );
};
