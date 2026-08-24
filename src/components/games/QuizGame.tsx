import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Zap, CheckCircle, XCircle, HelpCircle, ArrowRight, ArrowLeft, Flame, Sparkles } from 'lucide-react';
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
  const [floatingPoints, setFloatingPoints] = useState<{ id: number; text: string; coin: number } | null>(null);

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

      setFloatingPoints({
        id: Date.now(),
        text: `+${points} pts`,
        coin: coinBonus,
      });
    } else {
      sound.playWrong();
      setStreak(0);
    }
  }, [isAnswered, currentQ, streak, timeLeft]);

  const handleNext = useCallback(() => {
    sound.playClick();
    setFloatingPoints(null);
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
    <div className="relative min-h-[calc(100vh-56px)] w-full flex flex-col items-center justify-start p-3 sm:p-4 bg-slate-950 text-slate-100">
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center">
        {/* Compact Status Header */}
        <div className="w-full flex items-center justify-between gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 shadow-sm mb-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleConfirmExit}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Sair para o Mapa"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200">
              Q{currentIndex + 1}/{questions.length}
            </span>
            {streak > 1 && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold text-xs">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>x{streak} Combo</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-slate-400">Pontos:</span>
            <strong className="text-amber-400 font-bold">{score}</strong>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-2 p-0.5 mb-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${timerBarColor}`}
            style={{ width: `${timePercent}%` }}
          />
        </div>

        {/* Question Card with Smooth Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm mb-3 text-center"
          >
            {/* Floating Point Feedback */}
            {floatingPoints && (
              <div className="absolute -top-3 right-4 z-30 pointer-events-none animate-float-up flex items-center gap-1.5 bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-md font-bold text-xs shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{floatingPoints.text}</span>
                <span className="text-amber-900">•</span>
                <span className="flex items-center gap-0.5">+{floatingPoints.coin} <MoEduCoin size="xs" /></span>
              </div>
            )}

            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block mb-1">
              {currentQ.theme}
            </span>
            <p className="text-sm sm:text-base font-bold text-white leading-snug">
              {currentQ.question}
            </p>
            <div className="mt-2.5 flex items-center justify-center gap-1 text-xs text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{timeLeft}s restantes</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 4 Alternative Buttons */}
        <div className="w-full space-y-2 mb-3">
          {currentQ.options.map((option, idx) => {
            const isPicked = selectedOption === idx;
            const isCorrect = idx === currentQ.correctIndex;

            let buttonStyle = 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200';

            if (isAnswered) {
              if (isCorrect) {
                buttonStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-100 font-semibold ring-1 ring-emerald-500/50';
              } else if (isPicked && !isCorrect) {
                buttonStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
              } else {
                buttonStyle = 'bg-slate-950 border-slate-900 text-slate-600 opacity-40';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full min-h-[48px] p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${buttonStyle} ${!isAnswered ? 'active:scale-[0.99]' : ''}`}
              >
                <div className="w-6 h-6 rounded bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-slate-300 text-xs shrink-0 font-mono">
                  {optionLetters[idx]}
                </div>
                <div className="text-xs sm:text-sm font-medium leading-tight flex-1">
                  {option}
                </div>
                {isAnswered && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                {isAnswered && isPicked && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Answer Feedback & Action */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm text-left"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className={`text-xs font-bold ${selectedOption === currentQ.correctIndex ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedOption === currentQ.correctIndex ? '✓ Resposta Correta' : '✕ Resposta Incorreta'}
                </span>

                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showExplanation ? 'Ocultar Explicação' : 'Ver Explicação'}</span>
                </button>
              </div>

              {showExplanation && (
                <div className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800 my-2 leading-relaxed">
                  <strong className="text-amber-400 block mb-1">Fundamentação:</strong>
                  {currentQ.explanation}
                </div>
              )}

              <button
                onClick={handleNext}
                className="mt-2 w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider border-b-2 border-emerald-800 active:border-b-0 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{currentIndex + 1 < questions.length ? 'Próxima Questão' : 'Resultado Final'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle Keyboard Shortcuts Info for Desktop */}
        <div className="mt-3 hidden sm:flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <span>Atalhos: use as teclas <strong>1-4</strong> ou <strong>A-D</strong></span>
        </div>
      </div>
    </div>
  );
};
