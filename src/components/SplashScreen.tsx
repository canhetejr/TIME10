import React, { useState } from 'react';
import { Play, Sparkles, Award, Zap, Brain, BookOpen, Dices, GraduationCap, Layers } from 'lucide-react';
import { sound } from '../utils/sound';
import { MoEduCoin } from './GameIcons';

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
      {/* Dynamic Background Game FX */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Glowing Orbs */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl animate-pulse" />
        
        {/* Floating game vector icons in background */}
        <div className="absolute top-16 left-8 opacity-20 animate-bounce duration-1000">
          <GraduationCap className="w-12 h-12 text-indigo-400" />
        </div>
        <div className="absolute top-28 right-12 opacity-25 animate-bounce duration-700">
          <MoEduCoin size="xl" />
        </div>
        <div className="absolute bottom-24 left-10 opacity-20 animate-pulse">
          <Layers className="w-12 h-12 text-emerald-400" />
        </div>
        <div className="absolute bottom-16 right-16 opacity-20 animate-bounce duration-1000">
          <Dices className="w-12 h-12 text-amber-400" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center text-center">
        {/* Top Mini Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-black uppercase tracking-wider mb-4 shadow-sm animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span>O Desafio Gamificado da Graduação</span>
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
        </div>

        {/* Big Game Title Banner */}
        <div className="relative mb-6">
          <div className="relative">
            <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 drop-shadow-[0_4px_12px_rgba(245,158,11,0.5)] font-['Fredoka',sans-serif] tracking-wide uppercase">
              JORNADA
            </h1>
            <div className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-200 to-blue-400 drop-shadow-[0_5px_15px_rgba(45,212,191,0.6)] font-['Fredoka',sans-serif] tracking-wider uppercase -mt-2">
              ENADE
            </div>
          </div>
          
          <div className="inline-block mt-1 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-widest shadow-md">
            Trilha do Conhecimento & MoEdu
          </div>
        </div>

        {/* 3 Minigames Preview Card */}
        <div className="w-full bg-slate-900/80 border-2 border-indigo-500/30 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-md mb-6">
          <div className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">
            Domine as 3 Modalidades de Minijogos:
          </div>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="flex flex-col items-center p-2.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/30">
              <div className="w-10 h-10 rounded-xl bg-purple-600/40 border border-purple-400/30 flex items-center justify-center mb-1.5 shadow-inner">
                <Brain className="w-5 h-5 text-purple-300" />
              </div>
              <span className="text-xs font-black text-indigo-200">Show Quiz</span>
              <span className="text-[10px] text-slate-400 leading-tight">Perguntas & Combos</span>
            </div>

            <div className="flex flex-col items-center p-2.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/30">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/40 border border-emerald-400/30 flex items-center justify-center mb-1.5 shadow-inner">
                <Layers className="w-5 h-5 text-emerald-300" />
              </div>
              <span className="text-xs font-black text-emerald-200">Match-3</span>
              <span className="text-[10px] text-slate-400 leading-tight">Doc. & Pontos</span>
            </div>

            <div className="flex flex-col items-center p-2.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/30">
              <div className="w-10 h-10 rounded-xl bg-amber-600/40 border border-amber-400/30 flex items-center justify-center mb-1.5 shadow-inner">
                <Dices className="w-5 h-5 text-amber-300" />
              </div>
              <span className="text-xs font-black text-amber-200">Giro da Sorte</span>
              <span className="text-[10px] text-slate-400 leading-tight">Jackpot MoEdu</span>
            </div>
          </div>
        </div>

        {/* Name input */}
        <div className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 sm:p-4 mb-5 shadow-lg">
          <label className="block text-xs font-bold text-slate-300 text-left mb-1.5 uppercase tracking-wide">
            Seu Nome de Jogador(a):
          </label>
          <div className="flex items-center gap-2 bg-slate-950 rounded-xl px-3 py-2 border border-slate-700 focus-within:border-amber-400 transition-colors">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/40 border border-indigo-400/40 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-amber-300" />
            </div>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Digite seu nome..."
              maxLength={20}
              className="w-full bg-transparent text-white font-bold text-sm sm:text-base outline-none placeholder:text-slate-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleStart();
              }}
            />
          </div>
        </div>

        {/* Big Juicy Play Button */}
        <button
          onClick={handleStart}
          className="group relative w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 active:translate-y-1 text-slate-950 font-black text-xl sm:text-2xl uppercase tracking-wider font-['Fredoka',sans-serif] border-b-6 border-emerald-800 shadow-[0_10px_25px_rgba(16,185,129,0.5)] transition-all cursor-pointer flex items-center justify-center gap-3 animate-pulse"
        >
          <Play className="w-7 h-7 fill-slate-950 text-slate-950 transition-transform group-hover:scale-125" />
          <span>INICIAR JORNADA!</span>
        </button>

        {/* Footer Guarantee */}
        <p className="mt-4 text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Ganhe MoEdu a cada vitória e desbloqueie todas as fases da trilha!
        </p>
      </div>
    </div>
  );
};
