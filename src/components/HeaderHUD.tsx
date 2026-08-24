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
    const pulseTimer = setTimeout(() => setIsCoinPulsing(false), 600);

    const diff = player.moEdu - displayCoins;
    const step = Math.sign(diff) * Math.max(1, Math.floor(Math.abs(diff) / 10));

    const interval = setInterval(() => {
      setDisplayCoins((prev) => {
        const next = prev + step;
        if ((step > 0 && next >= player.moEdu) || (step < 0 && next <= player.moEdu)) {
          clearInterval(interval);
          return player.moEdu;
        }
        return next;
      });
    }, 30);

    return () => {
      clearInterval(interval);
      clearTimeout(pulseTimer);
    };
  }, [player.moEdu, displayCoins]);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-md border-b-2 border-indigo-900/60 shadow-lg px-3 py-2 sm:px-6 sm:py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Back button or Player Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {showBackButton && onBackToMap ? (
            <button
              onClick={() => {
                sound.playClick();
                onBackToMap();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:translate-y-0.5 text-slate-200 text-xs sm:text-sm font-bold border-b-3 border-slate-950 transition-all cursor-pointer shadow-md"
              title="Voltar ao Mapa"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Mapa</span>
            </button>
          ) : null}

          {/* Player avatar & title badge */}
          <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-2xl border border-slate-700/80 shadow-inner">
            <AvatarInsignia avatarKey={player.equippedAvatar || 'capelo'} size="sm" />
            <div className="flex flex-col text-left">
              <span className="text-xs font-black text-white leading-tight truncate max-w-[90px] sm:max-w-[120px]">
                {player.name}
              </span>
              <span className="text-[10px] font-semibold text-amber-300 leading-none">
                {player.equippedTitle || 'Estudante'}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Stars & MoEdu Counter */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Star pill */}
          <div className="flex items-center gap-1.5 bg-amber-950/60 border border-amber-500/40 px-3 py-1 rounded-full shadow-inner">
            <GameStar size="sm" />
            <span className="text-xs sm:text-sm font-black text-amber-300 font-mono">
              {totalStars}
            </span>
          </div>

          {/* MoEdu Animated Coin Counter */}
          <div
            className={`flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-600/40 via-yellow-500/30 to-amber-600/40 border-2 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-transform duration-300 ${
              isCoinPulsing ? 'scale-110 ring-4 ring-yellow-400/50' : ''
            }`}
          >
            <MoEduCoin size="md" />
            <div className="flex flex-col items-start leading-none">
              <span className="text-[9px] text-yellow-300/80 font-bold uppercase tracking-wider hidden sm:block">
                MoEdu
              </span>
              <span className="text-xs sm:text-base font-black text-yellow-300 font-mono tracking-tight drop-shadow">
                {displayCoins.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Sound, Shop, Ranking */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Shop button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenShop();
            }}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-gradient-to-b from-indigo-500 to-indigo-700 hover:from-indigo-400 hover:to-indigo-600 active:translate-y-0.5 text-white font-bold text-xs border-b-3 border-indigo-900 transition-all cursor-pointer shadow-md flex items-center gap-1.5"
            title="Loja de Recompensas"
          >
            <ShoppingBag className="w-4 h-4 text-yellow-300" />
            <span className="hidden sm:inline">Loja</span>
          </button>

          {/* Ranking button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenRanking();
            }}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-gradient-to-b from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 active:translate-y-0.5 text-white font-bold text-xs border-b-3 border-amber-900 transition-all cursor-pointer shadow-md flex items-center gap-1.5"
            title="Classificação"
          >
            <Trophy className="w-4 h-4 text-yellow-100" />
            <span className="hidden sm:inline">Rank</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleSound();
            }}
            className={`p-2 rounded-xl transition-all cursor-pointer border-b-3 shadow-md ${
              player.soundEnabled
                ? 'bg-slate-800 hover:bg-slate-700 text-teal-300 border-slate-950'
                : 'bg-rose-900/60 hover:bg-rose-800 text-rose-300 border-rose-950'
            }`}
            title={player.soundEnabled ? 'Som Ativado' : 'Som Mudo'}
          >
            {player.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
