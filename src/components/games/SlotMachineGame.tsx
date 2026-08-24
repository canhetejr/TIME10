import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, RotateCw, ArrowLeft } from 'lucide-react';
import { LevelConfig } from '../../types';
import { SLOT_SYMBOLS } from '../../data/gameData';
import { sound } from '../../utils/sound';
import { fireJackpotShower, fireCorrectSparkles } from '../../utils/confetti';
import { MoEduCoin, SlotReelBadge } from '../GameIcons';

interface SlotMachineGameProps {
  level: LevelConfig;
  onFinishGame: (result: { stars: number; score: number; moEduEarned: number; victory: boolean }) => void;
  onExit: () => void;
}

export const SlotMachineGame: React.FC<SlotMachineGameProps> = ({ level, onFinishGame, onExit }) => {
  const maxSpins = level.slotSpinsAllowed || 5;
  const targetMoEdu = level.slotTargetMoEdu || 400;

  const [spinsLeft, setSpinsLeft] = useState(maxSpins);
  const [totalWon, setTotalWon] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reel1, setReel1] = useState(SLOT_SYMBOLS[0]);
  const [reel2, setReel2] = useState(SLOT_SYMBOLS[1]);
  const [reel3, setReel3] = useState(SLOT_SYMBOLS[2]);
  const [lastWinText, setLastWinText] = useState<string | null>(null);
  const [isJackpot, setIsJackpot] = useState(false);

  const spinIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleSpin = useCallback(() => {
    if (isSpinning || spinsLeft <= 0) return;

    sound.playClick();
    setIsSpinning(true);
    setSpinsLeft((prev) => prev - 1);
    setLastWinText(null);
    setIsJackpot(false);

    const pick1 = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
    const luckRoll = Math.random();
    let pick2 = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
    let pick3 = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];

    if (luckRoll > 0.45) {
      pick2 = pick1;
      if (luckRoll > 0.75) {
        pick3 = pick1;
      }
    }

    spinIntervalRef.current = setInterval(() => {
      sound.playSpinTick();
      setReel1(SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]);
      setReel2(SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]);
      setReel3(SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]);
    }, 70);

    setTimeout(() => {
      setReel1(pick1);
      sound.playReelStop();
    }, 700);

    setTimeout(() => {
      setReel2(pick2);
      sound.playReelStop();
    }, 1100);

    setTimeout(() => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
      setReel3(pick3);
      sound.playReelStop();
      setIsSpinning(false);

      if (pick1.id === pick2.id && pick2.id === pick3.id) {
        const payout = pick1.payout3;
        setTotalWon((prev) => prev + payout);
        setLastWinText(`🎉 JACKPOT! 3x ${pick1.name} (+${payout} MoEdu)`);
        setIsJackpot(true);
        sound.playJackpot();
        fireJackpotShower();
      } else if (pick1.id === pick2.id || pick2.id === pick3.id || pick1.id === pick3.id) {
        const matched = pick1.id === pick2.id ? pick1 : pick3;
        const payout = matched.payout2;
        setTotalWon((prev) => prev + payout);
        setLastWinText(`⭐ PAR DE ${matched.name.toUpperCase()}! (+${payout} MoEdu)`);
        sound.playCorrect();
        fireCorrectSparkles(0.5, 0.5);
      } else {
        setLastWinText('Tente novamente no próximo giro!');
      }
    }, 1500);
  }, [isSpinning, spinsLeft]);

  // Space/Enter keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        handleSpin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSpin]);

  const handleConfirmExit = () => {
    if (window.confirm('Deseja sair do Giro da Fortuna? As moedas acumuladas nesta partida só contam ao finalizar os giros.')) {
      sound.playClick();
      onExit();
    }
  };

  useEffect(() => {
    if (isSpinning) return;

    if (spinsLeft === 0) {
      const stars =
        totalWon >= targetMoEdu
          ? totalWon >= targetMoEdu * 1.5
            ? 3
            : 2
          : totalWon >= targetMoEdu * 0.5
          ? 1
          : 0;
      const baseReward = stars > 0 ? level.rewardMoEdu : 30;

      const finishTimer = setTimeout(() => {
        onFinishGame({
          stars,
          score: totalWon,
          moEduEarned: totalWon + baseReward,
          victory: stars >= 1,
        });
      }, 1000);

      return () => clearTimeout(finishTimer);
    }
  }, [spinsLeft, isSpinning, totalWon, targetMoEdu, level.rewardMoEdu, onFinishGame]);

  return (
    <div className="relative min-h-[calc(100vh-56px)] w-full flex flex-col items-center justify-start p-3 bg-slate-950 text-slate-100">
      <div className="w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center">
        {/* Compact Status Header */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 shadow-sm mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleConfirmExit}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Sair para o Mapa"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 font-mono text-xs">
              <span className="text-slate-400">Giros:</span>
              <strong className={`font-bold ${spinsLeft <= 1 ? 'text-rose-400' : 'text-amber-400'}`}>
                {spinsLeft}/{maxSpins}
              </strong>
            </div>
          </div>

          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">Prêmio Total</span>
            <div className="flex items-center justify-center gap-1 text-sm font-bold text-amber-400 font-mono">
              <span>+{totalWon}</span>
              <MoEduCoin size="xs" />
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 font-mono text-xs">
            <span className="text-slate-400">Meta:</span>
            <strong className="text-emerald-400 font-bold">{targetMoEdu}</strong>
          </div>
        </div>

        {/* Tactile Slot Cabinet */}
        <div className="w-full bg-slate-900 p-3 rounded-2xl shadow-sm border border-slate-800">
          {/* Header */}
          <div className="w-full py-1.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center gap-1.5 mb-2.5">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Giro da Fortuna ENADE
            </h3>
          </div>

          {/* 3 Slot Reels */}
          <div className="bg-slate-950 rounded-xl p-2.5 border border-slate-800 flex items-center justify-between gap-2">
            <div className="flex-1 h-28 sm:h-32 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center p-1">
              <SlotReelBadge symbolId={reel1.id} name={reel1.name} isSpinning={isSpinning} />
            </div>
            <div className="flex-1 h-28 sm:h-32 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center p-1">
              <SlotReelBadge symbolId={reel2.id} name={reel2.name} isSpinning={isSpinning} />
            </div>
            <div className="flex-1 h-28 sm:h-32 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center p-1">
              <SlotReelBadge symbolId={reel3.id} name={reel3.name} isSpinning={isSpinning} />
            </div>
          </div>

          {/* Win Message */}
          <div className="mt-2.5 py-1.5 px-2 bg-slate-950 rounded-lg border border-slate-800 text-center min-h-[32px] flex items-center justify-center">
            <span className={`text-xs font-semibold ${isJackpot ? 'text-amber-400' : 'text-slate-300'}`}>
              {lastWinText || (isSpinning ? 'Girando...' : 'Pressione Espaço ou clique abaixo para girar')}
            </span>
          </div>

          {/* Spin Button */}
          <div className="mt-3">
            <button
              disabled={isSpinning || spinsLeft <= 0}
              onClick={handleSpin}
              className={`w-full py-3 px-4 rounded-xl font-bold text-base uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer select-none ${
                isSpinning || spinsLeft <= 0
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                  : 'bg-emerald-600 hover:bg-emerald-500 active:border-b-0 active:translate-y-1 text-white border-b-4 border-emerald-800'
              }`}
            >
              <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Girando...' : 'Girar Roleta'}</span>
            </button>
          </div>
        </div>

        {/* Minimal Payout Reference Strip */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 mt-3 flex items-center justify-between text-[11px] text-slate-400 px-3">
          <span className="font-semibold text-slate-300">Premiações:</span>
          <span className="text-amber-400 font-mono font-medium">Capelo (+500) • Livro (+300) • MoEdu (+200)</span>
        </div>
      </div>
    </div>
  );
};
