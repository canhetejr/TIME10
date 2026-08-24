import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Lock,
  Play,
  RotateCcw,
  Gift,
  CheckCircle2,
  Compass,
  Zap,
  Crown,
} from 'lucide-react';
import { LevelConfig, LevelProgress, MilestoneChest, PlayerState, TrackId } from '../types';
import { sound } from '../utils/sound';
import { AvatarInsignia, GameStar, LevelIconBadge } from './GameIcons';
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
        bg: 'bg-slate-900 text-slate-500 border border-slate-800',
        shadow: 'border-b-4 border-slate-950',
      };
    }

    if (level.isBossLevel) {
      return {
        bg: 'bg-amber-500 text-slate-950 border border-amber-300',
        shadow: 'border-b-4 border-amber-700 shadow-md',
      };
    }

    if (isCompleted) {
      return {
        bg: 'bg-slate-800 text-amber-400 border border-slate-700',
        shadow: 'border-b-4 border-slate-950',
      };
    }

    // Active current level
    return {
      bg: 'bg-emerald-600 text-white border border-emerald-400',
      shadow: 'border-b-4 border-emerald-800 shadow-md ring-2 ring-emerald-400/40',
    };
  };

  const filteredTracks =
    selectedTrackFilter === 'all' ? TRACKS : TRACKS.filter((t) => t.id === selectedTrackFilter);

  return (
    <div className="relative min-h-[calc(100vh-56px)] w-full pb-20 pt-3 px-3 sm:px-4 bg-slate-950 text-slate-100">
      <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
        {/* Top Progress & Chests Card */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 sm:p-4 mb-4 shadow-sm">
          {/* Progress Bar & Header */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-slate-200">
              Progresso Geral da Trilha
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 font-mono">
              <span>{completedCount}/{levels.length} Fases</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400">{totalStars}/{maxPossibleStars}</span>
              <GameStar size="xs" />
            </div>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-2.5 p-0.5 border border-slate-800 overflow-hidden mb-3">
            <div
              style={{ width: `${Math.max(4, progressPercent)}%` }}
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            />
          </div>

          {/* Milestone Chests Mini Row */}
          <div className="grid grid-cols-4 gap-2 pt-2.5 border-t border-slate-800">
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
                  className={`relative p-2 rounded-lg border transition-all flex flex-col items-center text-center cursor-pointer ${
                    isClaimed
                      ? 'bg-slate-950 border-slate-800 text-slate-500'
                      : canClaim
                      ? 'bg-amber-500/10 border-amber-400 text-amber-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-600 cursor-not-allowed opacity-60'
                  }`}
                  title={`${chest.title} (${chest.requiredStars} estrelas)`}
                >
                  <div className="flex items-center gap-0.5 text-[9px] font-bold font-mono text-amber-400">
                    <span>{chest.requiredStars}</span>
                    <GameStar size="xs" />
                  </div>
                  <Gift className={`w-4 h-4 my-1 ${canClaim ? 'text-amber-400' : isClaimed ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span className="text-[9px] font-bold text-slate-300 font-mono leading-none">
                    {isClaimed ? 'Resgatado' : canClaim ? 'Coletar' : `+${chest.rewardMoEdu}`}
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
            className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-sm flex items-center justify-between gap-3 mb-4 text-left cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                <LevelIconBadge levelId={nextPlayableLevel.id} type={nextPlayableLevel.type} size="sm" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide block">
                  Fase Atual
                </span>
                <h3 className="text-sm font-bold text-white leading-tight">
                  Fase {nextPlayableLevel.id}: {nextPlayableLevel.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg font-bold text-xs shrink-0 transition-colors">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Jogar</span>
            </div>
          </button>
        )}

        {/* Track Filter Tabs */}
        <div className="w-full flex items-center gap-1.5 mb-4 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => {
              sound.playClick();
              setSelectedTrackFilter('all');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              selectedTrackFilter === 'all'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedTrackFilter === t.id
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {t.title.split(':')[0]}
            </button>
          ))}
        </div>

        {/* Tracks & Level Nodes Trail */}
        <div className="w-full space-y-4">
          {filteredTracks.map((track) => {
            const trackLevels = levels.filter((lvl) => track.levelIds.includes(lvl.id));
            const isTrackCompleted = trackLevels.every((lvl) => player.levels[lvl.id]?.completed);

            return (
              <div
                key={track.id}
                className="rounded-xl p-4 border border-slate-800 bg-slate-900 shadow-sm"
              >
                {/* Track Header */}
                <div className="flex items-center justify-between pb-3 mb-6 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400">
                      {track.id === 'geral' && <Compass className="w-3.5 h-3.5" />}
                      {track.id === 'raciocinio' && <Zap className="w-3.5 h-3.5" />}
                      {track.id === 'lideranca' && <Crown className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        {track.title}
                      </h3>
                      <span className="text-[10px] text-slate-400">{track.badge}</span>
                    </div>
                  </div>

                  {isTrackCompleted && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Concluída</span>
                    </span>
                  )}
                </div>

                {/* Sinuous Clean Trail */}
                <div className="relative w-full flex flex-col items-center py-2 space-y-8">
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

                    // Gentle offset
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
                          <div className="absolute -top-7 flex flex-col items-center z-20 pointer-events-none">
                            <AvatarInsignia avatarKey={player.equippedAvatar || 'capelo'} size="xs" className="ring-2 ring-emerald-400 shadow-md" />
                          </div>
                        )}

                        {/* Level Button */}
                        <button
                          disabled={!isUnlocked}
                          onClick={() => {
                            if (isUnlocked) {
                              sound.playClick();
                              onSelectLevel(level);
                            }
                          }}
                          className={`group relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center p-1 transition-all cursor-pointer ${
                            style.bg
                          } ${style.shadow} ${
                            !isUnlocked ? 'cursor-not-allowed opacity-40' : 'active:translate-y-1 active:border-b-0'
                          }`}
                        >
                          {isUnlocked ? (
                            <>
                              <LevelIconBadge levelId={level.id} type={level.type} size="sm" />
                              <span className="text-xs font-black font-mono leading-none mt-0.5">
                                {level.id}
                              </span>
                            </>
                          ) : (
                            <Lock className="w-4 h-4 text-slate-500" />
                          )}

                          {/* Level Type Badge */}
                          <div className="absolute -bottom-2 px-1.5 py-0.2 rounded bg-slate-950 border border-slate-800 text-[8px] font-bold text-slate-400 uppercase tracking-tight">
                            {level.type === 'quiz' && <span>Quiz</span>}
                            {level.type === 'match3' && <span>Match</span>}
                            {level.type === 'slot' && <span>Giro</span>}
                          </div>
                        </button>

                        {/* Stars earned */}
                        {isUnlocked && (
                          <div className="flex items-center gap-0.5 mt-2">
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
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-rose-400 transition-colors p-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Progresso</span>
          </button>
        </div>
      </div>
    </div>
  );
};
