import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, GraduationCap, Brain, Layers, Dices, BookOpen, Trophy, Sparkles } from 'lucide-react';
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
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-950 text-slate-100">
      {/* Background subtle geometric grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center text-center"
      >
        {/* Academic Emblem Header */}
        <div className="mb-6 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 shadow-sm">
            <GraduationCap className="w-7 h-7 text-amber-400" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Simulador Interativo ENADE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Jornada ENADE
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1 max-w-xs">
            Trilha gamificada com questões reais, combinações e recompensas acadêmicas.
          </p>
        </div>

        {/* 3 Challenge Pillars */}
        <div className="w-full grid grid-cols-3 gap-2.5 mb-5">
          <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-2">
              <Brain className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-xs font-bold text-slate-200">Quiz</span>
            <span className="text-[10px] text-slate-400">Questões</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-2">
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-xs font-bold text-slate-200">Match-3</span>
            <span className="text-[10px] text-slate-400">Lógica</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-2">
              <Dices className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-200">Giro</span>
            <span className="text-[10px] text-slate-400">MoEdu</span>
          </div>
        </div>

        {/* Player Name Form */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4 text-left">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Identificação do Estudante
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Digite seu nome..."
            maxLength={24}
            className="w-full bg-slate-950 px-3.5 py-2.5 rounded-lg border border-slate-800 text-white font-semibold text-sm outline-none focus:border-amber-400 transition-colors"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleStart();
            }}
          />
        </div>

        {/* Solid Tactile Action Button */}
        <button
          onClick={handleStart}
          className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base tracking-wide border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-white text-white" />
          <span>INICIAR JORNADA</span>
        </button>
      </motion.div>
    </div>
  );
};
