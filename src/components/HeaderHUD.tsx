import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, ShoppingBag, Trophy, ArrowLeft } from 'lucide-react';
import { PlayerState } from '../types';
import { sound } from '../utils/sound';
import { AvatarInsignia, GameStar, MoEduCoin } from './GameIcons';

interface HeaderHUDProps {
  player: PlayerState;
  onToggleSound: () => void;
  onOpenShop: () => void;
  onOpenRanking: () => void;
  onBackToMap?: () => void;
  showBackButton?: boolean;
  totalStars: number;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  player,
  onToggleSound,
  onOpenShop,
  onOpenRanking,
  onBackToMap,
  showBackButton = false,
  totalStars,
}) => {
  const [displayCoins, setDisplayCoins] = useState(player.moEdu);
  const [isCoinPulsing, setIsCoinPulsing] = useState(false);

  // Smooth animated rolling coin counter
  useEffect(() => {
    if (displayCoins === player.moEdu) return;

    setIsCoinPulsing(true);
    const pulseTimer = setTimeout(() => setIsCoinPulsing(false), 500);

    const diff = player.moEdu - displayCoins;
    const step = Math.sign(diff) * Math.max(1, Math.floor(Math.abs(diff) / 8));

    const interval = setInterval(() => {
      setDisplayCoins((prev) => {
        const next = prev + step;
        if ((step > 0 && next >= player.moEdu) || (step < 0 && next <= player.moEdu)) {
          clearInterval(interval);
          return player.moEdu;
        }
        return next;
      });
    }, 25);

    return () => {
      clearInterval(interval);
      clearTimeout(pulseTimer);
    };
  }, [player.moEdu, displayCoins]);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur border-b border-slate-800 px-3 py-2 sm:px-4 sm:py-2.5">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Back button or Player Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {showBackButton && onBackToMap ? (
            <button
              onClick={() => {
                sound.playClick();
                onBackToMap();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
              title="Voltar ao Mapa"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span className="hidden xs:inline sm:inline font-medium">Voltar ao Mapa</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <AvatarInsignia avatarKey={player.equippedAvatar || 'capelo'} size="sm" />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-100 leading-tight truncate max-w-[85px] sm:max-w-[120px]">
                  {player.name}
                </span>
                <span className="text-[10px] font-medium text-amber-400 leading-none truncate max-w-[85px] sm:max-w-[120px]">
                  {player.equippedTitle || 'Estudante'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Center: Stars & MoEdu Counter */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Star pill */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg border border-slate-800">
            <GameStar size="xs" />
            <span className="text-xs sm:text-sm font-bold text-amber-400 font-mono">
              {totalStars}
            </span>
          </div>

          {/* MoEdu Animated Coin Counter */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg bg-slate-950 border border-slate-800 transition-all ${
              isCoinPulsing ? 'border-amber-500/60 bg-amber-950/20' : ''
            }`}
          >
            <MoEduCoin size="sm" />
            <span className="text-xs sm:text-sm font-bold text-amber-300 font-mono">
              {displayCoins.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>

        {/* Right: Sound, Shop, Ranking */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Shop button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playClick();
              onOpenShop();
            }}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
            title="Loja de Itens"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Loja</span>
          </motion.button>

          {/* Ranking button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playClick();
              onOpenRanking();
            }}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
            title="Classificação Geral"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Ranking</span>
          </motion.button>

          {/* Sound Mute Toggle */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playClick();
              onToggleSound();
            }}
            className={`p-1.5 rounded-lg transition-all cursor-pointer border ${
              player.soundEnabled
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-500 border-slate-800'
            }`}
            title={player.soundEnabled ? 'Som Ativado' : 'Som Mudo'}
          >
            {player.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-slate-300" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
};
