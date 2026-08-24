import React, { useState } from 'react';
import { Play, GraduationCap, Brain, Layers, Dices } from 'lucide-react';
import { sound } from '../utils/sound';

interface SplashScreenProps {
  onStartGame: (name: string) => void;
  defaultName: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStartGame, defaultName }) => {
  const [playerName, setPlayerName] = useState(defaultName || 'Estudante Fera');

  const handleStart = () => {
    sound.playCorrect();
    onStartGame(playerName.trim() || 'Estudante Fera');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950">
      {/* Subtle Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center text-center">
        {/* Game Title */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[11px] font-black uppercase tracking-wider mb-2">
            <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
            <span>Desafio Gamificado</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 font-['Fredoka',sans-serif] uppercase tracking-wide">
            JORNADA ENADE
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
            Conquiste estrelas, resolva desafios e acumule MoEdu!
          </p>
        </div>

        {/* 3 Minigames Quick Badges */}
        <div className="w-full grid grid-cols-3 gap-2 mb-6">
          <div className="flex flex-col items-center p-2 rounded-2xl bg-slate-900/80 border border-indigo-500/20 shadow-sm">
            <Brain className="w-5 h-5 text-indigo-400 mb-1" />
            <span className="text-[11px] font-bold text-slate-200">Quiz</span>
            <span className="text-[9px] text-slate-400">Questões</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-2xl bg-slate-900/80 border border-indigo-500/20 shadow-sm">
            <Layers className="w-5 h-5 text-emerald-400 mb-1" />
            <span className="text-[11px] font-bold text-slate-200">Match-3</span>
            <span className="text-[9px] text-slate-400">Combinações</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-2xl bg-slate-900/80 border border-indigo-500/20 shadow-sm">
            <Dices className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-[11px] font-bold text-slate-200">Giro</span>
            <span className="text-[9px] text-slate-400">Fortuna</span>
          </div>
        </div>

        {/* Name input */}
        <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 mb-5 shadow-md">
          <label className="block text-[11px] font-bold text-slate-400 text-left mb-1.5 uppercase tracking-wider">
            Seu Nome de Jogador:
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Digite seu nome..."
            maxLength={20}
            className="w-full bg-slate-950 px-3 py-2.5 rounded-xl border border-slate-700 text-white font-bold text-sm outline-none focus:border-amber-400 transition-colors"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleStart();
            }}
          />
        </div>

        {/* Big Juicy Play Button */}
        <button
          onClick={handleStart}
          className="group w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 active:scale-[0.98] text-slate-950 font-black text-lg sm:text-xl uppercase tracking-wider font-['Fredoka',sans-serif] border-b-4 border-emerald-800 shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5 fill-slate-950 text-slate-950" />
          <span>INICIAR JORNADA</span>
        </button>
      </div>
    </div>
  );
};
