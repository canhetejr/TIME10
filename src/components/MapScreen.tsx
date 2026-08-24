import React, { useState } from 'react';
import {
  Lock,
  Play,
  RotateCcw,
  Sparkles,
  Compass,
  Brain,
  Layers,
  Dices,
  Gift,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Zap,
  Award,
  Crown,
  Flame
} from 'lucide-react';
import { LevelConfig, LevelProgress, MilestoneChest, PlayerState, TrackId } from '../types';
import { sound } from '../utils/sound';
import { AvatarInsignia, GameStar, LevelIconBadge, MoEduCoin } from './GameIcons';
import { MILESTONE_CHESTS, TRACKS, TrackInfo } from '../data/gameData';

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
  const nextPlayableLevel = levels.find((lvl) => {
    const prog = player.levels[lvl.id];
    return prog?.unlocked && !prog?.completed;
  }) || levels.find((lvl) => player.levels[lvl.id]?.unlocked) || levels[0];

  // Helper for level node styles
  const getLevelNodeStyle = (level: LevelConfig, isUnlocked: boolean, isCompleted: boolean) => {
    if (!isUnlocked) {
      return {
        bg: 'bg-slate-900/90 border-slate-800 text-slate-500',
        shadow: 'border-b-4 border-slate-950 shadow-inner',
        ring: '',
      };
    }

    if (level.isBossLevel) {
      if (isCompleted) {
        return {
          bg: 'bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 border-amber-200 text-slate-950',
          shadow: 'border-b-6 border-amber-800 shadow-[0_10px_30px_rgba(245,158,11,0.6)]',
          ring: 'ring-4 ring-amber-400/80 ring-offset-4 ring-offset-slate-950 hover:scale-110 transition-transform',
        };
      }
      return {
        bg: 'bg-gradient-to-tr from-rose-500 via-amber-400 to-yellow-300 border-rose-200 text-slate-950',
        shadow: 'border-b-6 border-rose-800 shadow-[0_10px_30px_rgba(244,63,94,0.6)] animate-pulse',
        ring: 'ring-4 ring-rose-400/80 ring-offset-4 ring-offset-slate-950 hover:scale-110 transition-transform',
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
      shadow: 'border-b-6 border-teal-800 shadow-[0_8px_25px_rgba(45,212,191,0.6)]',
      ring: 'ring-4 ring-emerald-400/80 ring-offset-4 ring-offset-slate-950 hover:scale-110 transition-transform',
    };
  };

  const filteredTracks = selectedTrackFilter === 'all'
    ? TRACKS
    : TRACKS.filter((t) => t.id === selectedTrackFilter);

  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full pb-24 pt-4 px-3 sm:px-6 overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950">
      {/* Decorative Floating Lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-48 h-20 bg-indigo-500/10 rounded-full blur-2xl" />
        <div className="absolute top-96 right-10 w-64 h-24 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-60 left-16 w-52 h-20 bg-teal-500/10 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        {/* Main Progress & Star Milestones Card */}
        <div className="w-full bg-slate-900/90 border-2 border-indigo-500/30 rounded-3xl p-4 sm:p-5 mb-6 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white font-['Fredoka',sans-serif] flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-md flex items-center justify-center">
                  <Compass className="w-4 h-4 text-amber-300" />
                </div>
                <span>Trilhas da Graduação ENADE</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete as 3 trilhas acadêmicas, vença os minijogos e destranque os baús de MoEdu!
              </p>
            </div>

            <div className="text-right shrink-0">
              <div className="flex items-center justify-end gap-1 text-sm font-black text-amber-300 font-mono">
                <span>{totalStars}/{maxPossibleStars}</span>
                <GameStar size="sm" />
              </div>
              <div className="text-[10px] text-slate-400 font-semibold">{progressPercent}% do Mapa</div>
            </div>
          </div>

          {/* Global Progress Bar */}
          <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-800 overflow-hidden mb-4">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(52,211,153,0.5)]"
              style={{ width: `${Math.max(4, progressPercent)}%` }}
            />
          </div>

          {/* Star Milestone Chests Bar */}
          <div className="border-t border-slate-800/80 pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-amber-400" />
                <span>Baús de Meta de Estrelas</span>
              </span>
              <span className="text-[10px] text-indigo-300 font-semibold">
                Colete estrelas para abrir
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                    className={`relative p-2 rounded-2xl border transition-all flex flex-col items-center text-center cursor-pointer ${
                      isClaimed
                        ? 'bg-slate-950/70 border-emerald-500/40 text-slate-400'
                        : canClaim
                        ? 'bg-gradient-to-b from-amber-500/20 to-yellow-500/10 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-bounce-gentle hover:scale-105'
                        : 'bg-slate-950/40 border-slate-800/80 opacity-65 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <div className="flex items-center gap-1 text-[10px] font-black text-amber-300 font-mono">
                        <span>{chest.requiredStars}</span>
                        <GameStar size="xs" />
                      </div>
                      {isClaimed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : canClaim ? (
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
                      ) : (
                        <Lock className="w-3 h-3 text-slate-500" />
                      )}
                    </div>

                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-1">
                      <Gift className={`w-4 h-4 ${canClaim ? 'text-yellow-300 animate-pulse' : isClaimed ? 'text-emerald-400' : 'text-slate-500'}`} />
                    </div>

                    <span className="text-[10px] font-bold text-slate-200 truncate max-w-full">
                      {chest.title.replace('Baú do ', '').replace('Cofre ', '')}
                    </span>

                    <div className="mt-1 flex items-center gap-1 text-[10px] font-black text-yellow-300 font-mono">
                      <span>+{chest.rewardMoEdu}</span>
                      <MoEduCoin size="xs" />
                    </div>

                    {canClaim && (
                      <span className="mt-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-[9px] uppercase tracking-tighter">
                        Resgatar
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Play Action Button for Next Playable Level */}
        {nextPlayableLevel && (
          <div className="w-full mb-6">
            <button
              onClick={() => {
                sound.playClick();
                onSelectLevel(nextPlayableLevel);
              }}
              className="w-full p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 border-2 border-amber-400/60 shadow-[0_8px_25px_rgba(99,102,241,0.4)] flex items-center justify-between gap-3 text-left hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-slate-950/80 border border-amber-400/60 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                  <LevelIconBadge levelId={nextPlayableLevel.id} type={nextPlayableLevel.type} size="md" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase tracking-wider">
                      Continuar Jornada
                    </span>
                    <span className="text-xs text-amber-200 font-bold">
                      {nextPlayableLevel.trackTitle}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-white font-['Fredoka',sans-serif]">
                    {nextPlayableLevel.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-amber-400/40 text-amber-300 font-black text-xs shrink-0 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                <Play className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Jogar</span>
              </div>
            </button>
          </div>
        )}

        {/* Track Filter Tabs */}
        <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2 mb-8 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => {
              sound.playClick();
              setSelectedTrackFilter('all');
            }}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              selectedTrackFilter === 'all'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md border border-indigo-400'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Todas as Trilhas (9 Fases)
          </button>

          {TRACKS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                sound.playClick();
                setSelectedTrackFilter(t.id);
              }}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                selectedTrackFilter === t.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md border border-indigo-400'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t.title.split(':')[0]}
            </button>
          ))}
        </div>

        {/* Themed Roadmaps by Track */}
        <div className="w-full space-y-12 sm:space-y-16">
          {filteredTracks.map((track, trackIdx) => {
            const trackLevels = levels.filter((lvl) => track.levelIds.includes(lvl.id));
            const trackStars = trackLevels.reduce((acc, lvl) => acc + (player.levels[lvl.id]?.stars || 0), 0);
            const trackMaxStars = trackLevels.length * 3;
            const isTrackCompleted = trackLevels.every((lvl) => player.levels[lvl.id]?.completed);

            return (
              <div
                key={track.id}
                className={`relative rounded-3xl p-4 sm:p-6 border ${track.accentBorder} bg-gradient-to-b ${track.bgGradient} backdrop-blur-sm shadow-xl`}
              >
                {/* Track Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-800/80">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${track.themeColor} flex items-center justify-center p-0.5 shrink-0 shadow-lg`}>
                      <div className="w-full h-full bg-slate-900/90 rounded-[14px] flex items-center justify-center text-amber-300">
                        {track.id === 'geral' && <Compass className="w-5 h-5" />}
                        {track.id === 'raciocinio' && <Zap className="w-5 h-5" />}
                        {track.id === 'lideranca' && <Crown className="w-5 h-5" />}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-wider">
                          {track.badge}
                        </span>
                        {isTrackCompleted && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Trilha Concluída</span>
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-white font-['Fredoka',sans-serif] mt-0.5">
                        {track.title}
                      </h3>
                      <p className="text-xs text-slate-300 max-w-md">
                        {track.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 bg-slate-950/60 px-3.5 py-2 rounded-2xl border border-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Estrelas</span>
                      <div className="flex items-center gap-1 text-xs font-black text-amber-300 font-mono">
                        <span>{trackStars}/{trackMaxStars}</span>
                        <GameStar size="xs" />
                      </div>
                    </div>
                    <div className="w-px h-6 bg-slate-800" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Fases</span>
                      <span className="text-xs font-black text-indigo-300 font-mono">
                        {trackLevels.filter((l) => player.levels[l.id]?.completed).length}/{trackLevels.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sinuous Curved Phase Trail */}
                <div className="relative w-full flex flex-col items-center py-4 space-y-12 sm:space-y-16">
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

                    // Sinuous curve offset calculation
                    const offsets = ['translate-x-0', 'translate-x-12 sm:translate-x-16', 'translate-x-0', '-translate-x-12 sm:-translate-x-16'];
                    const curveClass = offsets[idx % offsets.length];

                    const style = getLevelNodeStyle(level, isUnlocked, isCompleted);

                    return (
                      <div
                        key={level.id}
                        className={`relative flex flex-col items-center z-10 transition-all duration-300 ${curveClass}`}
                      >
                        {/* Connecting dashed path */}
                        {idx < trackLevels.length - 1 && (
                          <div
                            className={`absolute top-16 w-1.5 h-16 sm:h-20 -z-10 border-l-4 border-dashed transition-colors ${
                              isCompleted ? 'border-amber-400/80 shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'border-slate-700/60'
                            }`}
                            style={{
                              transform: idx % 2 === 0 ? 'rotate(18deg)' : 'rotate(-18deg)',
                              transformOrigin: 'top center',
                            }}
                          />
                        )}

                        {/* Avatar standing on active level */}
                        {isCurrentActive && (
                          <div className="absolute -top-12 flex flex-col items-center animate-bounce z-20 pointer-events-none">
                            <div className="bg-slate-900 border border-emerald-400 text-[10px] font-black text-emerald-300 px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap mb-0.5">
                              SUA PRÓXIMA FASE
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
                                <GameStar filled={false} size="xs" />
                              </div>
                            </div>
                          )}

                          {/* Level Type Badge */}
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

                        {/* Boss Tag */}
                        {level.isBossLevel && (
                          <div className="mt-1 px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/50 text-[9px] font-black text-rose-300 uppercase tracking-wider shadow-sm flex items-center gap-1">
                            <Flame className="w-2.5 h-2.5 text-amber-400" />
                            <span>Clímax</span>
                          </div>
                        )}

                        {/* Stars earned under the bubble */}
                        {isUnlocked && (
                          <div className="flex items-center gap-1 mt-2">
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
              </div>
            );
          })}
        </div>

        {/* Reset Progress Action */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm('Deseja reiniciar seu progresso e jogar tudo novamente desde a Fase 1?')) {
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
