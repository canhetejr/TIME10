import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Zap, CheckCircle, XCircle, HelpCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { LevelConfig, QuizQuestion } from '../../types';
import { sound } from '../../utils/sound';
import { fireCorrectSparkles } from '../../utils/confetti';
import { MoEduCoin } from '../GameIcons';

interface QuizGameProps {
  level: LevelConfig;
  onFinishGame: (result: { stars: number; score: number; moEduEarned: number; victory: boolean }) => void;
  onExit: () => void;
}

const QUESTION_TIME = 15;

export const QuizGame: React.FC<QuizGameProps> = ({ level, onFinishGame, onExit }) => {
  const questions: QuizQuestion[] = level.quizQuestions || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [score, setScore] = useState(0);
  const [moEduEarned, setMoEduEarned] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQ = questions[currentIndex];
  const optionLetters = ['A', 'B', 'C', 'D'];

  const handleTimeout = useCallback(() => {
    sound.playWrong();
    setIsAnswered(true);
    setSelectedOption(-1);
    setStreak(0);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (isAnswered || !currentQ) return;

    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, currentQ, handleTimeout]);

  const handleSelectOption = useCallback((index: number) => {
    if (isAnswered || !currentQ) return;

    setIsAnswered(true);
    setSelectedOption(index);

    const isCorrect = index === currentQ.correctIndex;

    if (isCorrect) {
      sound.playCorrect();
      fireCorrectSparkles(0.5, 0.4);

      const newStreak = streak + 1;
      setStreak(newStreak);

      const streakMultiplier = 1 + (newStreak - 1) * 0.5;
      const points = Math.round((100 + timeLeft * 10) * streakMultiplier);
      const coinBonus = Math.round(30 * streakMultiplier);

      setCorrectCount((prev) => prev + 1);
      setScore((prev) => prev + points);
      setMoEduEarned((prev) => prev + coinBonus);
    } else {
      sound.playWrong();
      setStreak(0);
    }
  }, [isAnswered, currentQ, streak, timeLeft]);

  const handleNext = useCallback(() => {
    sound.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(QUESTION_TIME);
      setShowExplanation(false);
    } else {
      let stars = 0;
      if (correctCount >= 5) stars = 3;
      else if (correctCount >= 3) stars = 2;
      else if (correctCount >= 1) stars = 1;

      const baseLevelReward = stars > 0 ? level.rewardMoEdu : 20;
      const totalReward = moEduEarned + baseLevelReward;

      onFinishGame({
        stars,
        score,
        moEduEarned: totalReward,
        victory: stars >= 1,
      });
    }
  }, [currentIndex, questions.length, correctCount, level.rewardMoEdu, moEduEarned, onFinishGame, score]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (!isAnswered) {
        if (key === '1' || key === 'a') handleSelectOption(0);
        else if (key === '2' || key === 'b') handleSelectOption(1);
        else if (key === '3' || key === 'c') handleSelectOption(2);
        else if (key === '4' || key === 'd') handleSelectOption(3);
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNext();
        } else if (key === 'e') {
          setShowExplanation((prev) => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, handleSelectOption, handleNext]);

  const handleConfirmExit = () => {
    if (window.confirm('Deseja sair do Quiz? O progresso desta fase será reiniciado.')) {
      sound.playClick();
      onExit();
    }
  };

  if (!currentQ) {
    return <div className="text-center p-8 text-white">Carregando perguntas...</div>;
  }

  const timePercent = (timeLeft / QUESTION_TIME) * 100;
  const timerBarColor =
    timeLeft <= 4 ? 'bg-rose-500 animate-pulse' : timeLeft <= 8 ? 'bg-amber-400' : 'bg-emerald-400';

  return (
    <div className="relative min-h-[calc(100vh-56px)] w-full flex flex-col items-center justify-start p-3 sm:p-4 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950">
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        {/* Compact Status Header */}
        <div className="w-full flex items-center justify-between gap-2 bg-slate-900/90 border border-indigo-500/30 rounded-2xl px-3 py-2 shadow-lg mb-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleConfirmExit}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Sair para o Mapa"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 py-0.5 rounded-lg bg-indigo-600/40 text-[11px] font-bold text-indigo-200">
              Q{currentIndex + 1}/{questions.length}
            </span>
            {streak > 1 && (
              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
                <Zap className="w-3 h-3 fill-current" />
                x{streak}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">Pontos:</span>
            <strong className="text-amber-300 font-bold">{score}</strong>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-2 p-0.5 mb-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${timerBarColor}`}
            style={{ width: `${timePercent}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="w-full bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-4 shadow-xl mb-3 text-center relative">
          <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest block mb-1">
            {currentQ.theme}
          </span>
          <p className="text-sm sm:text-base font-bold text-white leading-snug">
            {currentQ.question}
          </p>
          <div className="mt-2 flex items-center justify-center gap-1 text-[11px] text-amber-300/80 font-mono">
            <Clock className="w-3 h-3" />
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* 4 Alternative Buttons */}
        <div className="w-full space-y-2 mb-3">
          {currentQ.options.map((option, idx) => {
            const isPicked = selectedOption === idx;
            const isCorrect = idx === currentQ.correctIndex;

            let buttonStyle = 'bg-slate-900/90 border-slate-700 hover:border-indigo-400 text-slate-200';

            if (isAnswered) {
              if (isCorrect) {
                buttonStyle = 'bg-emerald-600/90 border-emerald-400 text-white font-bold ring-2 ring-emerald-400/50';
              } else if (isPicked && !isCorrect) {
                buttonStyle = 'bg-rose-900/80 border-rose-500 text-rose-200';
              } else {
                buttonStyle = 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-40';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full min-h-[48px] p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${buttonStyle} ${
                  !isAnswered ? 'active:scale-[0.99] hover:bg-slate-800/90' : ''
                }`}
              >
                <div className="w-6 h-6 rounded-lg bg-slate-950/50 border border-white/20 flex items-center justify-center font-bold text-white text-xs shrink-0">
                  {optionLetters[idx]}
                </div>
                <div className="text-xs sm:text-sm font-medium leading-tight flex-1">
                  {option}
                </div>
                {isAnswered && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />}
                {isAnswered && isPicked && !isCorrect && <XCircle className="w-4 h-4 text-rose-300 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Answer Feedback & Action */}
        {isAnswered && (
          <div className="w-full bg-slate-900 border border-indigo-500/30 rounded-2xl p-3 shadow-lg text-left animate-fadeIn">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className={`text-xs font-bold ${selectedOption === currentQ.correctIndex ? 'text-emerald-400' : 'text-rose-400'}`}>
                {selectedOption === currentQ.correctIndex ? '✓ Correto! (+MoEdu)' : '✕ Incorreto!'}
              </span>

              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-[11px] text-indigo-300 hover:text-white flex items-center gap-1 underline cursor-pointer"
              >
                <HelpCircle className="w-3 h-3" />
                <span>{showExplanation ? 'Ocultar Explicação (E)' : 'Ver Explicação (E)'}</span>
              </button>
            </div>

            {showExplanation && (
              <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800 my-2 leading-relaxed">
                💡 <strong className="text-amber-300">Explicação ENADE: </strong>
                {currentQ.explanation}
              </p>
            )}

            <button
              onClick={handleNext}
              className="mt-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 active:scale-98 text-slate-950 font-black text-xs uppercase tracking-wider font-['Fredoka',sans-serif] border-b-2 border-amber-700 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{currentIndex + 1 < questions.length ? 'PRÓXIMA QUESTÃO (Enter)' : 'RESULTADO FINAL (Enter)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Subtle Keyboard Shortcuts Info for Desktop */}
        <div className="mt-3 hidden sm:flex items-center justify-center gap-2 text-[10px] text-slate-500">
          <span>Dica de teclado: use teclas <strong>1-4</strong> ou <strong>A-D</strong> para responder</span>
        </div>
      </div>
    </div>
  );
};
