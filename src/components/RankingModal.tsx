import React from 'react';
import { X, Trophy, Medal, Star } from 'lucide-react';
import { LevelProgress, PlayerState } from '../types';
import { MOCK_LEADERBOARD } from '../data/gameData';
import { sound } from '../utils/sound';
import { AvatarInsignia, GameStar, LeaderboardRankBadge, MoEduCoin } from './GameIcons';

interface RankingModalProps {
  player: PlayerState;
  onClose: () => void;
}

export const RankingModal: React.FC<RankingModalProps> = ({ player, onClose }) => {
  const totalPlayerStars = (Object.values(player.levels) as LevelProgress[]).reduce((acc, l) => acc + l.stars, 0);

  // Merge player into leaderboard and sort by MoEdu
  const allPlayers = [
    ...MOCK_LEADERBOARD,
    {
      rank: 0,
      name: `${player.name} (Você)`,
      moEdu: player.moEdu,
      stars: totalPlayerStars,
      avatar: player.equippedAvatar,
      title: player.equippedTitle,
      isCurrentPlayer: true,
    },
  ].sort((a, b) => b.moEdu - a.moEdu);

  // Assign ranks
  const rankedList = allPlayers.map((p, idx) => ({ ...p, calculatedRank: idx + 1 }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-2 border-amber-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-600/40 border border-amber-400/30 flex items-center justify-center shadow-md">
              <Trophy className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white font-['Fredoka',sans-serif]">
                Classificação Geral ENADE
              </h2>
              <p className="text-xs text-amber-300">
                Os melhores estudantes da universidade!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Leaderboard List */}
        <div className="flex-1 overflow-y-auto space-y-2 mt-4 pr-1 py-1 custom-scrollbar">
          {rankedList.map((entry) => {
            const isTop3 = entry.calculatedRank <= 3;
            const isMe = (entry as { isCurrentPlayer?: boolean }).isCurrentPlayer;

            return (
              <div
                key={entry.name}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                  isMe
                    ? 'bg-indigo-900/60 border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                    : isTop3
                    ? 'bg-slate-950/90 border-slate-700/80'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 flex justify-center shrink-0">
                    <LeaderboardRankBadge rank={entry.calculatedRank} />
                  </div>
                  <div className="shrink-0">
                    <AvatarInsignia avatarKey={entry.avatar || 'capelo'} size="sm" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs sm:text-sm font-bold ${isMe ? 'text-amber-300' : 'text-white'}`}>
                        {entry.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-indigo-300 font-semibold block">
                      {entry.title}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 font-mono text-xs sm:text-sm font-black text-yellow-300">
                    <span>{entry.moEdu.toLocaleString('pt-BR')}</span>
                    <MoEduCoin size="xs" />
                  </div>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-amber-400/90 font-bold font-mono">
                    <span>{entry.stars}</span>
                    <GameStar size="xs" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
