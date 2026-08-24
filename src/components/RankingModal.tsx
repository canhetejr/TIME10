import React, { useEffect } from 'react';
import { motion } from 'motion/react';
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
        className="relative w-full max-w-sm sm:max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Classificação Geral
              </h2>
              <span className="text-xs text-slate-400">
                Ranking de Estudantes ENADE
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer border border-slate-700 transition-colors"
            title="Fechar (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Leaderboard List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 mt-3 pr-1 custom-scrollbar">
          {rankedList.map((entry) => {
            const isMe = (entry as { isCurrentPlayer?: boolean }).isCurrentPlayer;

            return (
              <div
                key={entry.name}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2.5 transition-all ${
                  isMe
                    ? 'bg-slate-800 border-amber-400/80 shadow-sm'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 flex justify-center shrink-0">
                    <LeaderboardRankBadge rank={entry.calculatedRank} />
                  </div>
                  <AvatarInsignia avatarKey={entry.avatar || 'capelo'} size="xs" />
                  <div>
                    <span className={`text-xs font-bold block leading-tight ${isMe ? 'text-amber-400' : 'text-slate-100'}`}>
                      {entry.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block leading-none mt-0.5">
                      {entry.title}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-400">
                    <span>{entry.moEdu.toLocaleString('pt-BR')}</span>
                    <MoEduCoin size="xs" />
                  </div>
                  <div className="flex items-center justify-end gap-0.5 text-[10px] text-slate-400 font-semibold font-mono">
                    <span>{entry.stars}</span>
                    <GameStar size="xs" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};
