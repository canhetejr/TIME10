import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Zap, CheckCircle, XCircle, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { LevelConfig, QuizQuestion } from '../../types';
import { sound } from '../../utils/sound';
import { fireCorrectSparkles } from '../../utils/confetti';
import { MoEduCoin } from '../GameIcons';

interface QuizGameProps {
  level: LevelConfig;
  onFinishGame: (result: { stars: number; score: number; moEduEarned: number; victory: boolean }) => void;
  onExit: () => void;
}

const QUESTION_TIME = 15; // 15 seconds per question

export const QuizGame: React.FC<QuizGameProps> = ({ level, onFinishGame, onExit }) => {
  const questions: QuizQuestion[] = level.quizQuestions || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [score, setScore] = useState(0);
  const [moEduEarned, setMoEduEarned] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQ = questions[currentIndex];
  const optionLetters = ['A', 'B', 'C', 'D'];
  const optionColors = [
    'from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 border-blue-900',
    'from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 border-emerald-900',
    'from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 border-amber-900',
    'from-rose-600 to-pink-700 hover:from-rose-500 hover:to-pink-600 border-rose-900',
  ];

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
  }, [timeLeft, isAnswered, currentQ]);

  const handleTimeout = () => {
    sound.playWrong();
    setIsAnswered(true);
    setSelectedOption(-1); // Timeout
    setStreak(0);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedOption(index);

    const isCorrect = index === currentQ.correctIndex;

    if (isCorrect) {
      sound.playCorrect();
      fireCorrectSparkles(0.5, 0.4);

      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      const streakMultiplier = 1 + (newStreak - 1) * 0.5; // 1x, 1.5x, 2x, 2.5x...
      const points = Math.round((100 + timeLeft * 10) * streakMultiplier);
      const coinBonus = Math.round(30 * streakMultiplier);

      setCorrectCount((prev) => prev + 1);
      setScore((prev) => prev + points);
      setMoEduEarned((prev) => prev + coinBonus);
    } else {
      sound.playWrong();
      setStreak(0);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(QUESTION_TIME);
      setShowExplanation(false);
    } else {
      // Calculate final outcome
      const totalCorrect = correctCount + (selectedOption === currentQ.correctIndex ? 0 : 0);
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
  };

  if (!currentQ) {
    return <div>Carregando perguntas...</div>;
  }

  // Timer color indicator
  const timePercent = (timeLeft / QUESTION_TIME) * 100;
  let timerBarColor = 'bg-emerald-400';
  if (timeLeft <= 5) timerBarColor = 'bg-rose-500 animate-pulse';
  else if (timeLeft <= 8) timerBarColor = 'bg-amber-400';

  return (
    <div
      className={`relative min-h-[calc(100vh-65px)] w-full flex flex-col items-center justify-start p-4 sm:p-6 overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 transition-all ${
        isShaking ? 'translate-x-2 animate-shake' : ''
      }`}
    >
      <div className="w-full max-w-xl mx-auto flex flex-col items-center">
        {/* Game Status Header */}
        <div className="w-full flex items-center justify-between gap-3 bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-3 sm:px-4 shadow-xl backdrop-blur-md mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-indigo-600/40 border border-indigo-400/40 text-xs font-black text-indigo-200">
              Questão {currentIndex + 1}/{questions.length}
            </span>
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
              {currentQ.theme}
            </span>
          </div>

          {/* Streak Combo Badge */}
          {streak > 1 && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black text-xs uppercase tracking-wider animate-bounce shadow-md">
              <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
              <span>COMBO x{streak}!</span>
            </div>
          )}

          {/* Current Score */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Pontos</span>
              <span className="text-xs sm:text-sm font-black text-amber-300 font-mono">
                {score}
              </span>
            </div>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-3 p-0.5 mb-4 shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-300 ${timerBarColor}`}
            style={{ width: `${timePercent}%` }}
          />
        </div>

        {/* Question Card (Show do Milhão Style) */}
        <div className="w-full bg-gradient-to-b from-slate-900 to-indigo-950 border-2 border-indigo-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md mb-5 text-center relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-[10px] font-black text-white uppercase tracking-widest border border-indigo-400 shadow-md">
            {currentQ.theme}
          </div>

          <p className="text-base sm:text-lg font-bold text-white leading-relaxed mt-2 font-['Plus_Jakarta_Sans',sans-serif]">
            {currentQ.question}
          </p>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-amber-300/80 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>Tempo restante: {timeLeft}s</span>
          </div>
        </div>

        {/* 4 Colored Alternative Buttons */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {currentQ.options.map((option, idx) => {
            const isPicked = selectedOption === idx;
            const isCorrect = idx === currentQ.correctIndex;

            let buttonStateStyle = `bg-gradient-to-r ${optionColors[idx]}`;

            if (isAnswered) {
              if (isCorrect) {
                buttonStateStyle = 'bg-gradient-to-r from-emerald-500 to-green-600 border-emerald-300 ring-4 ring-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.5)]';
              } else if (isPicked && !isCorrect) {
                buttonStateStyle = 'bg-gradient-to-r from-rose-600 to-red-700 border-rose-400 opacity-80';
              } else {
                buttonStateStyle = 'bg-slate-800/60 border-slate-700 opacity-40';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`relative w-full p-4 rounded-2xl border-b-4 text-left transition-all cursor-pointer shadow-lg active:translate-y-1 flex items-start gap-3 ${buttonStateStyle} ${
                  !isAnswered ? 'hover:scale-[1.02]' : ''
                }`}
              >
                {/* Letter bubble */}
                <div className="w-7 h-7 rounded-xl bg-slate-950/40 border border-white/20 flex items-center justify-center font-black text-white text-xs shrink-0 mt-0.5">
                  {optionLetters[idx]}
                </div>

                {/* Option text */}
                <div className="text-xs sm:text-sm font-semibold text-white leading-snug flex-1">
                  {option}
                </div>

                {/* Feedback Icons */}
                {isAnswered && isCorrect && (
                  <CheckCircle className="w-5 h-5 text-emerald-200 shrink-0 mt-0.5 animate-bounce" />
                )}
                {isAnswered && isPicked && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-200 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Post-Answer Card & Explanation */}
        {isAnswered && (
          <div className="w-full bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-4 mb-4 shadow-xl text-left animate-scale-up">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                {selectedOption === currentQ.correctIndex ? (
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span className="flex items-center gap-1">
                      Resposta Correta! (+MoEdu <MoEduCoin size="xs" />)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold text-sm">
                    <XCircle className="w-4 h-4" />
                    <span>Resposta Incorreta!</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 underline cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showExplanation ? 'Ocultar Justificativa' : 'Ver Justificativa'}</span>
              </button>
            </div>

            {showExplanation && (
              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 mt-2 leading-relaxed">
                💡 <strong className="text-amber-300">Explicação ENADE: </strong>
                {currentQ.explanation}
              </p>
            )}

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="mt-3 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 active:translate-y-0.5 text-slate-950 font-black text-sm uppercase tracking-wider font-['Fredoka',sans-serif] border-b-3 border-amber-700 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{currentIndex + 1 < questions.length ? 'PRÓXIMA QUESTÃO' : 'VER RESULTADO FINAL'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
