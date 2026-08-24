import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Dices, RotateCw, Award, Zap } from 'lucide-react';
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
  const [multiplier, setMultiplier] = useState(1);

  const spinIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleSpin = () => {
    if (isSpinning || spinsLeft <= 0) return;

    sound.playClick();
    setIsSpinning(true);
    setSpinsLeft((prev) => prev - 1);
    setLastWinText(null);
    setIsJackpot(false);

    // Random roll outcomes
    const pick1 = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
    // Higher win chance for satisfying casual gameplay
    const luckRoll = Math.random();
    let pick2 = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
    let pick3 = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];

    if (luckRoll > 0.45) {
      // Guaranteed match 2 or 3
      pick2 = pick1;
      if (luckRoll > 0.75) {
        pick3 = pick1;
      }
    }

    // Rapid shuffle animation for reels
    let ticks = 0;
    spinIntervalRef.current = setInterval(() => {
      ticks++;
      sound.playSpinTick();
      setReel1(SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]);
      setReel2(SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]);
      setReel3(SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]);
    }, 70);

    // Reel 1 Stop
    setTimeout(() => {
      setReel1(pick1);
      sound.playReelStop();
    }, 900);

    // Reel 2 Stop
    setTimeout(() => {
      setReel2(pick2);
      sound.playReelStop();
    }, 1400);

    // Reel 3 Stop & Payout calculation
    setTimeout(() => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
      setReel3(pick3);
      sound.playReelStop();
      setIsSpinning(false);

      // Check combination
      if (pick1.id === pick2.id && pick2.id === pick3.id) {
        // 3 of a kind: JACKPOT
        const payout = pick1.payout3 * multiplier;
        setTotalWon((prev) => prev + payout);
        setLastWinText(`🎉 MEGA JACKPOT! 3x ${pick1.name} (+${payout} MoEdu)`);
        setIsJackpot(true);
        sound.playJackpot();
        fireJackpotShower();
      } else if (pick1.id === pick2.id || pick2.id === pick3.id || pick1.id === pick3.id) {
        // 2 of a kind: Mini Win
        const matched = pick1.id === pick2.id ? pick1 : pick3;
        const payout = matched.payout2 * multiplier;
        setTotalWon((prev) => prev + payout);
        setLastWinText(`⭐ PAR DE ${matched.name.toUpperCase()}! (+${payout} MoEdu)`);
        sound.playCorrect();
        fireCorrectSparkles(0.5, 0.5);
      } else {
        // No match
        setLastWinText('Quase! Tente novamente na próxima girada.');
      }
    }, 1900);
  };

  // End of spins check
  useEffect(() => {
    if (isSpinning) return;

    if (spinsLeft === 0) {
      const stars = totalWon >= targetMoEdu ? (totalWon >= targetMoEdu * 1.5 ? 3 : 2) : totalWon >= targetMoEdu * 0.5 ? 1 : 0;
      const baseReward = stars > 0 ? level.rewardMoEdu : 30;

      const finishTimer = setTimeout(() => {
        onFinishGame({
          stars,
          score: totalWon,
          moEduEarned: totalWon + baseReward,
          victory: stars >= 1,
        });
      }, 1200);

      return () => clearTimeout(finishTimer);
    }
  }, [spinsLeft, isSpinning, totalWon, targetMoEdu, level.rewardMoEdu, onFinishGame]);

  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full flex flex-col items-center justify-start p-3 sm:p-5 overflow-hidden bg-gradient-to-b from-slate-950 via-amber-950/40 to-slate-950">
      <div className="w-full max-w-lg mx-auto flex flex-col items-center">
        {/* Top Status Bar */}
        <div className="w-full bg-slate-900/90 border border-amber-500/40 rounded-2xl p-3 shadow-xl backdrop-blur-md mb-3 flex items-center justify-between gap-3">
          <div className="flex flex-col items-center bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Giros Restantes</span>
            <span className={`text-lg sm:text-xl font-black font-mono leading-none ${spinsLeft <= 1 ? 'text-rose-400 animate-pulse' : 'text-amber-300'}`}>
              {spinsLeft}/{maxSpins}
            </span>
          </div>

          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">MoEdu Acumulado</span>
            <div className="flex items-center justify-center gap-1.5 text-xl sm:text-2xl font-black text-yellow-300 font-mono drop-shadow">
              <span>+{totalWon}</span>
              <MoEduCoin size="sm" />
            </div>
          </div>

          <div className="flex flex-col items-center bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Meta</span>
            <div className="flex items-center gap-1 text-xs sm:text-sm font-black text-emerald-400 font-mono leading-none">
              <span>{targetMoEdu}</span>
              <MoEduCoin size="xs" />
            </div>
          </div>
        </div>

        {/* Fortune Tiger Style Golden Cabinet */}
        <div className="relative w-full max-w-[420px] bg-gradient-to-b from-amber-600 via-yellow-500 to-amber-700 p-2 sm:p-3 rounded-3xl shadow-[0_10px_35px_rgba(245,158,11,0.5)] border-4 border-yellow-200">
          {/* Cabinet Header Neon */}
          <div className="w-full py-2 bg-gradient-to-r from-red-800 via-rose-700 to-red-800 rounded-2xl border-2 border-yellow-300 shadow-inner flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
            <h3 className="text-sm sm:text-base font-black text-yellow-100 font-['Fredoka',sans-serif] tracking-wider uppercase drop-shadow">
              GIRO DA FORTUNA ENADE
            </h3>
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
          </div>

          {/* 3 Slot Reels Window */}
          <div className="relative bg-slate-950 rounded-2xl p-3 border-3 border-amber-900/80 shadow-2xl flex items-center justify-between gap-2 overflow-hidden">
            {/* Payline Marker */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-amber-400/20 via-yellow-300/60 to-amber-400/20 -translate-y-1/2 pointer-events-none z-20" />

            {/* Reel 1 */}
            <div className={`flex-1 h-32 sm:h-36 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-xl border-2 border-amber-400/40 flex flex-col items-center justify-center p-2 shadow-inner overflow-hidden relative ${isSpinning ? 'blur-[1px]' : ''}`}>
              <SlotReelBadge symbolId={reel1.id} name={reel1.name} isSpinning={isSpinning} />
            </div>

            {/* Reel 2 */}
            <div className={`flex-1 h-32 sm:h-36 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-xl border-2 border-amber-400/40 flex flex-col items-center justify-center p-2 shadow-inner overflow-hidden relative ${isSpinning ? 'blur-[1px]' : ''}`}>
              <SlotReelBadge symbolId={reel2.id} name={reel2.name} isSpinning={isSpinning} />
            </div>

            {/* Reel 3 */}
            <div className={`flex-1 h-32 sm:h-36 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-xl border-2 border-amber-400/40 flex flex-col items-center justify-center p-2 shadow-inner overflow-hidden relative ${isSpinning ? 'blur-[1px]' : ''}`}>
              <SlotReelBadge symbolId={reel3.id} name={reel3.name} isSpinning={isSpinning} />
            </div>
          </div>

          {/* Feedback Message Bar */}
          <div className="mt-2 py-1.5 px-3 bg-slate-950/90 rounded-xl border border-yellow-400/30 text-center min-h-[34px] flex items-center justify-center">
            <span className={`text-xs font-bold ${isJackpot ? 'text-yellow-300 font-black animate-pulse' : 'text-slate-200'}`}>
              {lastWinText || (isSpinning ? 'Girando os rolos da aprovação...' : 'Pressione GIRAR para tentar a sorte!')}
            </span>
          </div>

          {/* Big Chunky Spin Button */}
          <div className="mt-3">
            <button
              disabled={isSpinning || spinsLeft <= 0}
              onClick={handleSpin}
              className={`w-full py-4 px-6 rounded-2xl font-black text-xl sm:text-2xl uppercase tracking-widest font-['Fredoka',sans-serif] border-b-6 shadow-2xl transition-all flex items-center justify-center gap-3 cursor-pointer select-none ${
                isSpinning || spinsLeft <= 0
                  ? 'bg-slate-700 text-slate-400 border-slate-900 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 hover:from-red-400 hover:to-amber-400 active:translate-y-1 text-white border-red-900 shadow-[0_8px_25px_rgba(239,68,68,0.6)] animate-pulse'
              }`}
            >
              <RotateCw className={`w-7 h-7 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'GIRANDO...' : 'GIRAR!'}</span>
            </button>
          </div>
        </div>

        {/* Payout Guide Table */}
        <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-3 mt-3 shadow-lg">
          <div className="text-[10px] uppercase font-bold text-slate-400 text-center mb-1.5">
            Tabela de Prêmios MoEdu (3x Símbolos):
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
            {SLOT_SYMBOLS.slice(0, 6).map((sym) => (
              <div key={sym.id} className="bg-slate-950/80 p-1.5 rounded-lg border border-slate-800/80 flex items-center justify-between px-2">
                <SlotReelBadge symbolId={sym.id} name="" size="sm" />
                <span className="font-bold text-yellow-300 font-mono text-xs">+{sym.payout3}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-2 text-[11px] text-slate-500 text-center">
          *Minijogo de recompensa simulado da jornada. Não envolve dinheiro real.
        </p>
      </div>
    </div>
  );
};
