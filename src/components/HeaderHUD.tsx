import React, { useEffect, useState } from 'react';
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
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-indigo-500/20 shadow-md px-2.5 py-2 sm:px-4 sm:py-2.5">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Left: Back button or Player Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {showBackButton && onBackToMap ? (
            <button
              onClick={() => {
                sound.playClick();
                onBackToMap();
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer shadow-sm"
              title="Voltar ao Mapa"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span className="hidden xs:inline sm:inline">Mapa</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-slate-900/90 px-2 py-1 rounded-xl border border-slate-800">
              <AvatarInsignia avatarKey={player.equippedAvatar || 'capelo'} size="sm" />
              <div className="flex flex-col text-left">
                <span className="text-[11px] sm:text-xs font-bold text-white leading-tight truncate max-w-[75px] sm:max-w-[110px]">
                  {player.name}
                </span>
                <span className="text-[9px] font-semibold text-amber-400 leading-none truncate max-w-[75px] sm:max-w-[110px]">
                  {player.equippedTitle || 'Estudante'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Center: Stars & MoEdu Counter */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Star pill */}
          <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 sm:px-2.5 sm:py-1 rounded-full border border-amber-500/30">
            <GameStar size="xs" />
            <span className="text-xs sm:text-sm font-black text-amber-300 font-mono">
              {totalStars}
            </span>
          </div>

          {/* MoEdu Animated Coin Counter */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-gradient-to-r from-amber-600/30 to-yellow-500/30 border border-yellow-400/60 shadow-sm transition-transform duration-300 ${
              isCoinPulsing ? 'scale-105 ring-2 ring-yellow-400/40' : ''
            }`}
          >
            <MoEduCoin size="sm" />
            <span className="text-xs sm:text-sm font-black text-yellow-300 font-mono">
              {displayCoins.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>

        {/* Right: Sound, Shop, Ranking */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Shop button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenShop();
            }}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs border border-indigo-400/40 transition-all cursor-pointer shadow-sm flex items-center gap-1"
            title="Loja"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-300" />
            <span className="hidden sm:inline">Loja</span>
          </button>

          {/* Ranking button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenRanking();
            }}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold text-xs border border-amber-400/40 transition-all cursor-pointer shadow-sm flex items-center gap-1"
            title="Rank"
          >
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-200" />
            <span className="hidden sm:inline">Rank</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleSound();
            }}
            className={`p-1.5 rounded-xl transition-all cursor-pointer border shadow-sm ${
              player.soundEnabled
                ? 'bg-slate-900 hover:bg-slate-800 text-teal-300 border-slate-700'
                : 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border-rose-800'
            }`}
            title={player.soundEnabled ? 'Som Ativado' : 'Som Mudo'}
          >
            {player.soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
