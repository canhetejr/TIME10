import React, { useEffect } from 'react';
import { X, Trophy } from 'lucide-react';
import { LevelProgress, PlayerState } from '../types';
import { MOCK_LEADERBOARD } from '../data/gameData';
import { sound } from '../utils/sound';
import { AvatarInsignia, GameStar, LeaderboardRankBadge, MoEduCoin } from './GameIcons';

interface RankingModalProps {
  player: PlayerState;
  onClose: () => void;
}

export const RankingModal: React.FC<RankingModalProps> = ({ player, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const totalPlayerStars = (Object.values(player.levels) as LevelProgress[]).reduce(
    (acc, l) => acc + l.stars,
    0
  );

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

  const rankedList = allPlayers.map((p, idx) => ({ ...p, calculatedRank: idx + 1 }));

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sound.playClick();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
    >
      <div className="relative w-full max-w-sm sm:max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-600/30 border border-amber-400/30 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white font-['Fredoka',sans-serif]">
                Classificação Geral
              </h2>
              <span className="text-[11px] text-amber-300">
                Top Estudantes ENADE
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer border border-slate-700"
            title="Fechar (Esc)"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Leaderboard List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 mt-3 pr-1 custom-scrollbar">
          {rankedList.map((entry) => {
            const isTop3 = entry.calculatedRank <= 3;
            const isMe = (entry as { isCurrentPlayer?: boolean }).isCurrentPlayer;

            return (
              <div
                key={entry.name}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2.5 transition-all ${
                  isMe
                    ? 'bg-indigo-900/50 border-amber-400 ring-1 ring-amber-400/50'
                    : isTop3
                    ? 'bg-slate-950/80 border-slate-700'
                    : 'bg-slate-950/40 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 flex justify-center shrink-0">
                    <LeaderboardRankBadge rank={entry.calculatedRank} />
                  </div>
                  <AvatarInsignia avatarKey={entry.avatar || 'capelo'} size="xs" />
                  <div>
                    <span className={`text-xs font-bold block leading-tight ${isMe ? 'text-amber-300' : 'text-white'}`}>
                      {entry.name}
                    </span>
                    <span className="text-[9px] text-indigo-300 font-semibold block leading-none mt-0.5">
                      {entry.title}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 font-mono text-xs font-black text-yellow-300">
                    <span>{entry.moEdu.toLocaleString('pt-BR')}</span>
                    <MoEduCoin size="xs" />
                  </div>
                  <div className="flex items-center justify-end gap-0.5 text-[9px] text-amber-400 font-bold font-mono">
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
